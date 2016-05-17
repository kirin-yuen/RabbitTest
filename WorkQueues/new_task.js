// we'll create a Work Queue that will be used to distribute
// time-consuming tasks among multiple workers.

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
	conn.createChannel(function(err, ch) {
		var q = 'task_queue';

		// to allow arbitrary messages to be sent from the command line
		var msg = process.argv.slice(2).join(' ') || "Hello World.....";

		// To let RabbitMQ never lose our queue, we need to declare it as durable:
		ch.assertQueue(q, {durable: true});

		// mark our messages as persistent
		ch.sendToQueue(q, new Buffer(msg), {persistent: true});
			console.log(" [x] Sent '%s'", msg);
		});
	setTimeout(function() { conn.close(); process.exit(0) }, 500);
});