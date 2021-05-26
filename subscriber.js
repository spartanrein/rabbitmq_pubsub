var amqp = require('amqplib/callback_api');
amqp_url = "amqps://tqigunti:Z3lVxmRsW2tedQqhCghElYciBMZTEbQL@mustang.rmq.cloudamqp.com/tqigunti";

var args = process.argv.slice(2);

var severity_level = ['high', 'low'];

amqp.connect(amqp_url, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var exchange = 'message_exchange';

        channel.assertExchange(exchange, 'direct', {
            durable: true
        });

        channel.assertQueue('low_queue', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(' [*] Waiting for logs. To exit press CTRL+C', q.queue);

            channel.bindQueue(q.queue, exchange, 'low');
            channel.consume(q.queue, function (msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });

        channel.assertQueue('high_queue', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(' [*] Waiting for logs. To exit press CTRL+C', q.queue);

            channel.bindQueue(q.queue, exchange, 'high');
            channel.consume(q.queue, function (msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});
