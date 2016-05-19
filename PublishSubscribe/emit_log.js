// We'll deliver a message to multiple consumers. 
// This pattern is known as "publish/subscribe".


var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'logs';
    var msg = process.argv.slice(2).join(' ') || 'Hello World!';

	// There are a few exchange types available: direct, topic, headers and fanout. 
    // fanout just broadcasts all the messages it receives to all the queues it knows
    ch.assertExchange(ex, 'fanout', {durable: false});

    // publish to our named exchange "logs"
    // he empty string as second parameter means that we don't want to send the message to any specific queue. 
    // We want only to publish it to our 'logs' exchange.
    ch.publish(ex, '', new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});