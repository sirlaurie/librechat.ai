const dbConnect = require('./dbConnect')

class Subscriber {
  static async findOne(query) {
    const client = await dbConnect()
    const db = client.db(process.env.MONGODB_DATABASE)
    const result = await db.collection('subscribers').findOne(query)
    return result
  }

  static async findOneAndUpdate(query, update, options) {
    const client = await dbConnect()
    const db = client.db(process.env.MONGODB_DATABASE)
    const result = await db.collection('subscribers').findOneAndUpdate(
      query,
      { $set: update },
      { returnDocument: options?.new ? 'after' : 'before' }
    )
    return options?.new ? result.value : result.ok === 1
  }

  static async save(document) {
    const client = await dbConnect()
    const db = client.db(process.env.MONGODB_DATABASE)
    const result = await db.collection('subscribers').insertOne(document)
    return { insertedId: result.insertedId }
  }
}

export default Subscriber
