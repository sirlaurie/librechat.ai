import dbConnect from '@/utils/dbConnect'
import Subscriber from '@/utils/Subscriber'
import validator from 'validator'

export const runtime = 'edge'

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const body = await req.json()
  const { email } = body

  if (!validator.isEmail(email)) {
    return new Response(JSON.stringify({ message: 'Invalid email format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

    try {
      await dbConnect()
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Database connection failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    try {
      const updatedSubscriber = await Subscriber.findOneAndUpdate(
        { email },
        { status: 'unsubscribed' },
        { new: true },
      )

      if (updatedSubscriber) {
        return new Response(JSON.stringify({ message: 'Unsubscription successful' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      return new Response(JSON.stringify({ message: 'Subscriber not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Unsubscription failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
}
