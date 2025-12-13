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

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    const toEmail = 'contact.cramdesk@gmail.com'

    if (resendApiKey) {
      const subject = `Nouveau message contact - ${topic}`
      const textBody = `
Nom: ${name || 'Non renseigné'}
Email: ${email}
Sujet: ${topic}
Message:
${message}

Meta:
- CreatedAt: ${payload.createdAt}
- UserAgent: ${payload.userAgent}
`.trim()

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Cramdesk Contact <no-reply@cramdesk.com>',
          to: [toEmail],
          subject,
          text: textBody,
          reply_to: email,
        }),
      })

      if (!emailRes.ok) {
        const err = await emailRes.text()
        console.error('Resend contact error:', err)
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
      }
    } else {
      console.warn('RESEND_API_KEY not set; logging contact message instead.')
      console.log('Contact message:', payload)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
