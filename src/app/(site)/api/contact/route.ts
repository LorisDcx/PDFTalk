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

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      typeof topic !== 'string' || !topic.trim() || topic.length > 120 ||
      typeof message !== 'string' || !message.trim() || message.length > 5000 ||
      typeof name !== 'string' || name.length > 120) {
      return NextResponse.json({ error: 'Invalid contact details' }, { status: 400 })
    }

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    const toEmail = 'contact.cramdesk@gmail.com'

    if (!resendApiKey) return NextResponse.json({ error: 'Contact service unavailable' }, { status: 503 })

    {
      const subject = `Nouveau message contact - ${topic}`
      const textBody = `
Nom: ${name || 'Non renseigné'}
Email: ${email}
Sujet: ${topic}
Message:
${message}

Meta:
- CreatedAt: ${new Date().toISOString()}
`.trim()

      try {
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
          console.error('Resend contact error:', emailRes.status)
          return NextResponse.json({ error: 'Message delivery failed' }, { status: 502 })
        }
      } catch (sendErr) {
        console.error('Resend contact exception:', sendErr)
        return NextResponse.json({ error: 'Message delivery failed' }, { status: 502 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
