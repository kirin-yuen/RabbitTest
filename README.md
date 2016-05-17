### 在Ubuntu上安装rabbitmq
---

#### 打开/etc/apt/sources.list，在最后加入

    deb http://www.rabbitmq.com/debian/ testing main

#### 加入公钥

    sudo wget https://www.rabbitmq.com/rabbitmq-signing-key-public.asc
    sudo apt-key add rabbitmq-signing-key-public.asc

#### 更新
    
    sudo apt-get update

#### 安装

    sudo apt-get install rabbitmq-server

#### 状态
    
    sudo rabbitmqctl status

#### RabbitMQ管理工具
    
    sudo rabbitmq-plugins enable rabbitmq_management
在浏览器输入`localhost:15672`进入管理界面，账号密码：guest/guest


### 利用Javascript方式使用rabbitmq
---

#### 本示例共6个部分，运行示例前请先`npm install`安装所需依赖

#### "Hello World!" 
---
> The simplest thing that does something

##### 运行
程序位于HelloWorld，进入该目录后同一终端运行，或打开两个终端各自运行
```
node send
node receive
```
![image](images/1.png "双终端运行")


可以使用如下命令查看queue
```
rabbitmqctl list_queues
```

详细内容：http://www.rabbitmq.com/tutorials/tutorial-one-javascript.html


#### Work Queues
---
> create a Work Queue that will be used to distribute time-consuming tasks among multiple workers.

程序位于WorkQueues，进入该目录后打开两个或多个终端各自运行
```
shell1$ node new_task.js First message...
shell2$ node worker.js
shell3$ node worker.js
```


#### 循环分发 Round-robin dispatching

> By default, RabbitMQ will send each message to the next consumer, in sequence. 
On average every consumer will get the same number of messages. 
This way of distributing messages is called round-robin.

分别启动两个worker
```
shell1$ node worker.js
shell2$ node worker.js
```

发送5条消息
```
shell3$ node new_task.js First message.
shell3$ node new_task.js Second message..
shell3$ node new_task.js Third message...
shell3$ node new_task.js Fourth message....
shell3$ node new_task.js Fifth message.....
```

两个worker会出现
```
shell1$ ./worker.js
 [*] Waiting for messages. To exit press CTRL+C
 [x] Received 'First message.'
 [x] Received 'Third message...'
 [x] Received 'Fifth message.....'
shell2$ ./worker.js
 [*] Waiting for messages. To exit press CTRL+C
 [x] Received 'Second message..'
 [x] Received 'Fourth message....'
```


#### 消息确认 Message acknowledgment

> In order to make sure a message is never lost, RabbitMQ supports message acknowledgments. An ack(nowledgement) is sent back from the consumer to tell RabbitMQ that a particular message has been received, processed and that RabbitMQ is free to delete it.

> If a consumer dies (its channel is closed, connection is closed, or TCP connection is lost) without sending an ack,
RabbitMQ will understand that a message wasn't processed fully and will re-queue it. 
If there are other consumers online at the same time, it will then quickly redeliver it to another consumer. 
That way you can be sure that no message is lost, even if the workers occasionally die. 

In order to debug mistaking to miss the ack you can use rabbitmqctl to print the messages_unacknowledged field:

```
$ sudo rabbitmqctl list_queues name messages_ready messages_unacknowledged
Listing queues ...
hello    0       0
...done.
```


#### 消息持久化 Message durability

> We have learned how to make sure that even if the consumer dies, the task isn't lost. 
But our tasks will still be lost if RabbitMQ server stops.

> When RabbitMQ quits or crashes it will forget the queues and messages unless you tell it not to. 
Two things are required to make sure that messages aren't lost: we need to mark both the queue and messages as durable.

```
ch.assertQueue('hello', {durable: true});
ch.sendToQueue(q, new Buffer(msg), {persistent: true});
```


#### 公平分发 Fair dispatch

> You might have noticed that the dispatching still doesn't work exactly as we want. 
For example in a situation with two workers, when all odd messages are heavy and even messages are light,
one worker will be constantly busy and the other one will do hardly any work. Well,
RabbitMQ doesn't know anything about that and will still dispatch messages evenly.

> This happens because RabbitMQ just dispatches a message when the message enters the queue. 
It doesn't look at the number of unacknowledged messages for a consumer. 
It just blindly dispatches every n-th message to the n-th consumer.

```
ch.prefetch(1);
```

详细内容：http://www.rabbitmq.com/tutorials/tutorial-two-javascript.html











---
中文参考：http://blog.csdn.net/anzhsoft/article/details/19570187













