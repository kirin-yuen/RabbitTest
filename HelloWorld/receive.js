// The consumer receives messages from that queue.

// receive.js has the same require as send:
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {

	conn.createChannel(function(err, ch) {
		var q = 'hello';

		ch.assertQueue(q, {durable: false});
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

		// Receiver keep it running to listen for messages and print them out
		ch.consume(q, function(msg) {
			// provide a callback that will be executed when RabbitMQ pushes messages to our consumer
			console.log(" [x] Received %s", msg.content.toString());
		}, {noAck: true});
	});
});