import { connect } from 'amqplib'

async function manageTasks () {
  const connection = await connect('amqp://guest:guest@localhost')
  const channel = await connection.createChannel()

  const queue = 'tasks'

  await channel.assertQueue(queue, { durable: true })

  console.log('Supervisor listening for tasks...')

  let workerIndex = 0
  const numWorkers = 2 // Number of worker nodes

  channel.consume(queue, async msg => {
    const task = JSON.parse(msg.content.toString())
    console.log('Task received by supervisor:', task)

    // Distribute tasks among workers (load balancing)
    const workerId = (workerIndex % numWorkers) + 1
    const routingKey = `tasks.${workerId}`

    channel.sendToQueue(routingKey, msg.content, {
      persistent: true,
      headers: { 'worker-id': workerId }
    })
    console.log(`Task sent to worker ${workerId}:`, task)

    workerIndex++ // Round-robin scheduling

    // Acknowledge the original message
    channel.ack(msg)
  })
}

manageTasks().catch(console.error)
