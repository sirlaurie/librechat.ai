import validator from 'validator'
import dbConnect from '@/utils/dbConnect'
import Subscriber from '@/utils/Subscriber'

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

  if (!email || !validator.isEmail(email)) {
    return new Response(JSON.stringify({ message: 'Valid email is required' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    await dbConnect()

    const existingSubscriber = await Subscriber.findOne({ email })

    if (existingSubscriber) {
      return new Response(JSON.stringify({ message: 'Email already subscribed' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    await Subscriber.save({ email })

    return new Response(JSON.stringify({ message: 'Subscription successful' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ message: 'Subscription failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
