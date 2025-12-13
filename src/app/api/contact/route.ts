import { NextResponse } from 'next/server'

interface ContactPayload {
  name?: string
  email: string
  topic: string
  message: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload
    const { name = '', email, topic, message } = body

    if (!email || !message || !topic) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Basic payload
    const payload = {
      name,
      email,
      topic,
      message,
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
    }

    // Optional webhook (e.g., Slack/Discord) defined in env
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      // Fallback: log to server console (visible in Vercel logs)
      console.log('Contact message:', payload)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
