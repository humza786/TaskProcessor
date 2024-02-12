import { connect } from 'amqplib'
import { cacheResult, getCachedResult } from './cache.js'

async function processTask (workerId, task) {
  // Simulate time-consuming task by introducing a delay
  const delayMs = task.complexity * 1000 // Simulate time in seconds
  await new Promise(resolve => setTimeout(resolve, delayMs))

  // After the delay, task processing is complete
  console.log(`Task processed by worker ${workerId}:`, task)
  return task // Return the processed task
}

async function startWorker (workerId) {
  const connection = await connect('amqp://guest:guest@localhost')
  const channel = await connection.createChannel()

  const queue = `tasks.${workerId}`

  await channel.assertQueue(queue, { durable: true })
  channel.prefetch(1)

  console.log(`Worker ${workerId} waiting for tasks...`)

  channel.consume(queue, async msg => {
    const task = JSON.parse(msg.content.toString())
    console.log(`Task received by worker ${workerId}:`, task)

    // Check if the result is cached
    await getCachedResult(task, async cachedResult => {
      if (cachedResult) {
        console.log(`Result for task ${JSON.stringify(task)} found in cache.`)
        // Return the cached result
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(cachedResult))
        )
        channel.ack(msg)
      } else {
        // Process the task (simulate time-consuming task)
        const processedTask = await processTask(workerId, task)

        // Cache the processed task result
        await cacheResult(processedTask)

        // Send the processed task back
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(processedTask))
        )
        channel.ack(msg)
      }
    })
  })
}

const workerId = process.argv[2]
startWorker(workerId).catch(console.error)
