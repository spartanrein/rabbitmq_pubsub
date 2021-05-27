# *Rabbitmq pub/sub*

*A simulation of a high-volume data input environment using nodejs, rabbitmq, socketio, reactjs* 

## Setup 
1. Install nodejs https://nodejs.org/en/download/
2. Run [npm install] in the command line from the /backend and /pubsub_frontend folders

*Provide links and descriptions for the third-party libraries you're having your users install.

### Getting started
<p align="center">
<img align="center" src="https://github.com/spartanrein/rabbitmq_pubsub/blob/master/rabbitmqpubsub.jpg" alt="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flinthillsbridalshow.com%2Fsorry-image-not-available%2F&psig=AOvVaw2zCyDzgtuIRBTvPlEI9_5o&ust=1622184516106000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLjSs7Gi6fACFQAAAAAdAAAAABAD">
</p>

The architecture consists of 4 main components:

1. Publisher - data is parsed from a csv file then published to a Cloudamqp server message exchange.  The exchange will then send the message to the appropriate queue.
2. Subscriber - will create a channel to the Cloudamqp server and consume from the queues.  Messages from the high priority queue will be pushed to the front end through socketio.
3. Cloud amqp server - hosts the rabbitmq exchange and queues
4. Backend server - Creates a local backend server. Uses express and socketio.
5. React Frontend - Uses socketio client connection to the backend server to propagate data to a component.

## Usage
1. Start the frontend with "npm start" in the /pubsub_frontend folder
2. Start the Backend server and subscriber with "node app.js" in the /backend folder
3. Finally, start the publisher by running "node publisher.js" in the /backend folder

## Errors and bugs
Note: I have also made a publisher that calls an online api for 100 messages, then sends 20 messages/sec.  The api is called to replenish the messages every 3 seconds.
However, I've been blocked after a day of consistently calling their API, so I decided to get my messages from a CSV file.
The publisher is called OnlinePublisher.js

##TODO
1. Need to create an environment file for security.  Right now, the login and password are exposed for the cloud server
2. The messages from the low priority queue should be saved in a logfile instead of just printing in console.
3. TESTS. It's no excuse as I know the concept of TDD.  I will redo this project but as TDD.
4. Improve the frontend to relay the data better.

##Feedback:

I really enjoyed this test.  To be honest, I don't do very well with time pressure during coding tests.
Looking back, I wish I asked more questions about the implementation and architecture.  
If I had to do it again, I would spend more time asking about the requirements.


