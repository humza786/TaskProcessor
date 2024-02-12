import { createClient } from 'redis'
const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect()

export async function cacheResult (task) {
  try {
    // Ensure the client is connected before caching the result
    const result = await client.set(
      `task:${JSON.stringify(task)}`,
      JSON.stringify(task)
    )
    if (result) {
      console.log('Result cached successfully')
    } else {
      console.error('Error caching result')
    }
    // client.quit()
  } catch (err) {
    console.error('Redis Client Error', err)
  }
}

export async function getCachedResult (task, callback) {
  const result = await client.get(`task:${JSON.stringify(task)}`)
  if (result === null) {
    callback(null)
  } else {
    callback(JSON.parse(result))
  }
}
