const amqp = require('amqplib/callback_api');
const csv_parser = require('./csv_parser');
//should be read from an env variable
const amqp_url = "amqps://tqigunti:Z3lVxmRsW2tedQqhCghElYciBMZTEbQL@mustang.rmq.cloudamqp.com/tqigunti";


amqp.connect(amqp_url, function (error0, connection) {
    if (error0) {
        throw error0
    }
    connection.createChannel(async function (error1, channel) {
        if (error1) {
            throw error1;
        }

        const exchange = "message_exchange";
        channel.assertExchange(exchange, 'direct', {
            durable: true
        });

        let messages = await csv_parser("./quotes.csv");
        console.log(messages);

        //publish 20 messages per second
        setInterval(() => {
            for (let i = 0; i <= 20; i++) {
                let message = messages.pop();
                message.timestamp = Date.now()
                var severity = (message.severity) >= 7 ? "high" : "low";
                channel.publish(exchange, severity, Buffer.from(JSON.stringify(message)));
                console.log(message);
            }
        }, 1000);
    });
});
