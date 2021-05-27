const amqp = require('amqplib/callback_api');

//Should be using environment
const amqp_url = "amqps://tqigunti:Z3lVxmRsW2tedQqhCghElYciBMZTEbQL@mustang.rmq.cloudamqp.com/tqigunti";
const severity = ['high', 'low'];

module.exports = function subscriber(io) {
    amqp.connect(amqp_url, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            const exchange = 'message_exchange';

            channel.assertExchange(exchange, 'direct', {
                durable: true
            });

            severity.forEach(level => {
                createQueue(channel, `${level}_queue`, level, exchange, io)
            })
        });
    });

    function createQueue(channel, queue_name, severity, exchange, io) {
        channel.assertQueue(queue_name, {
            exclusive: true
        }, function (err, q) {
            if (err) {
                throw err;
            }
            console.log(" [x] Waiting for logs. To exit press CTRL+C", q.queue);

            channel.bindQueue(q.queue, exchange, severity);
            channel.consume(q.queue, function (msg) {
                if (q.queue === 'high_queue') {
                    io.emit("FromAPI", msg.content.toString())
                }
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                //TODO: Save low severity messages to logfile

            }, {
                noAck: true
            })
        })
    }
};
