const axios = require('axios');
const amqp = require('amqplib/callback_api');

var amqp_url = "amqps://tqigunti:Z3lVxmRsW2tedQqhCghElYciBMZTEbQL@mustang.rmq.cloudamqp.com/tqigunti";

function publish(quotes) {
    amqp.connect(amqp_url, function (error0, connection) {
        if (error0) {
            throw error0
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            let exchange = "message_exchange";

            channel.assertExchange(exchange, 'direct', {
                durable: true
            });
            for (let i = 0; i < quotes.length - 1; i++) {
                let message = {
                    message: quotes[i],
                    timestamp: Date.now(),
                    priority: getRandomInt(1, 10)
                };
                let severity = (message.priority >= 7 ? 'high' : 'low');
                channel.publish(exchange, severity, Buffer.from(JSON.stringify(message)));
            }
        });
        setTimeout(function () {
            connection.close();
            process.exit(0);

        }, 500);
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getQuotes() {
    const res = await axios.get("https://baconipsum.com/api/?type=all-meat&sentences=20&start-with-lorem=0");
    return res.data
}

//
getQuotes().then(data => {
    const quotes = data.toString().split(".");
    publish(quotes);
    console.log(`${quotes} quote is published`);
});
