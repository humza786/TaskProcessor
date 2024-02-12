import { connect } from 'amqplib'

async function produceTask () {
  const connection = await connect('amqp://guest:guest@localhost')
  const channel = await connection.createChannel()

  const queue = 'tasks'

  await channel.assertQueue(queue, { durable: true })

  setInterval(() => {
    const complexity = Math.ceil(Math.random() * 10)
    const task = { complexity }
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(task)), {
      persistent: true
    })
    console.log('Task sent:', task)
  }, 2000)
}

produceTask().catch(console.error)
