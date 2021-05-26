const amqp = require('amqplib/callback_api');

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

        let messages = await getQuotes();
        messages = formatMessages(messages);
        console.log(messages);

        setInterval(async () => {
            let newMessages = await getQuotes();
            newMessages = formatMessages(newMessages);
            console.log(newMessages);
            newMessages.forEach(message => {
                messages.unshift(message);
            });
            console.log(`messages refilled: ${messages.length}`)

        }, 3500);

        //publish 20 messages per second
        setInterval(() => {
            for (let i = 0; i <= 20; i++) {
                let message = messages.pop();
                channel.publish(exchange, message.severity, Buffer.from(JSON.stringify(message)));
                console.log("sent")
            }

        }, 1000);
    });
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getQuotes() {
    let res = await axios.get("https://baconipsum.com/api/?type=all-meat&sentences=100&start-with-lorem=0");
    return res.data.toString().split(".");
}

function formatMessages(data) {
    let messages = [];
    for (let i = 0; i < data.length - 1; i++) {
        let message = {
            quote: data[i],
            timestamp: Date.now(),
            severity: (getRandomInt(1, 100) >= 7 ? 'high' : 'low')
        };
        messages.push(message);
    }
    return messages
}
