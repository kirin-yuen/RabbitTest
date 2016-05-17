// Our "Hello world" won't be too complex
// let's send a message, receive it and print it on the screen

// send.js - Producer sends messages to the "hello" queue.

var amqp = require('amqplib/callback_api');

// connect to RabbitMQ server
amqp.connect('amqp://localhost', function(err, conn) {


	// create a channel, which is where most of the API for getting things done resides
	conn.createChannel(function(err, ch) {
		// declare a queue for us to send to
		var q = 'hello';
		var msg = 'Hello World!';

		// then we can publish a message to the queue
		ch.assertQueue(q, {durable: false});
		ch.sendToQueue(q, new Buffer(msg));
		console.log(" [x] Sent %s", msg);
	});

	// Lastly, we close the connection and exit;
	setTimeout(function() { conn.close(); process.exit(0) }, 500);
});