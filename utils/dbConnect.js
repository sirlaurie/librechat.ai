const { MongoClient } = require('mongodb')

let client = null

async function dbConnect() {
  try {
    if (client) {
      return client
    }

    const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/?retryWrites=true&w=majority&appName=${process.env.MONGODB_DATABASE}`
    client = new MongoClient(uri)
    await client.connect()

    return client
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default dbConnect
