// every running copy of the receiver program will get the messages


var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'logs';

    ch.assertExchange(ex, 'fanout', {durable: false});

    // we supply queue name as an empty string, we create a non-durable queue with a generated name
    // the queue instance contains a random queue name generated by RabbitMQ. 
    // @q.queue - For example it may look like amq.gen-JzTY20BRgKO-HjmUJj0wLg.
    ch.assertQueue('', {exclusive: true}, function(err, q) {

      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

      // we need to tell the exchange to send messages to our queue
      ch.bindQueue(q.queue, ex, '');

      ch.consume(q.queue, function(msg) {
        console.log(" [x] %s", msg.content.toString());
      }, {noAck: true});
    });
  });
});