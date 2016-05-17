var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
        var q = 'task_queue';

        ch.assertQueue(q, {durable: true});
        
        // use the prefetch method with the value of 1. 
        // Tells RabbitMQ not to give more than one message to a worker at a time. 
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

        ch.consume(q, function(msg) {
            // every dot will account for one second of "work"
            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());

            // We don't have a real-world task, like images to be resized or pdf files to be rendered
            // let's fake it by just pretending we're busy - by using the setTimeout method
            setTimeout(function() {
                console.log(" [x] Done");

                // An ack(nowledgement) is sent back from the consumer to tell RabbitMQ 
                // that a particular message has been received, processed and that RabbitMQ is free to delete it.
                ch.ack(msg);
                
            }, secs * 1000);
        }, {noAck: false});
    });
});

