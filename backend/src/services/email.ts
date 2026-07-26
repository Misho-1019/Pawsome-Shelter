import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_FROM = process.env.EMAIL_FROM || 'Pawsome Shelter <noreply@pawsomeshelter.com>'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email send error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

// Newsletter welcome email
export async function sendNewsletterWelcome(email: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF8F0; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #E97A3D 0%, #9E4203 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🐾 Welcome to Pawsome Shelter!</h1>
        </div>
        <div style="padding: 40px;">
          <p style="color: #231915; font-size: 16px; line-height: 1.6;">Hi there,</p>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">Thank you for subscribing to our newsletter! We're thrilled to have you join our community of animal lovers.</p>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">You'll receive updates about:</p>
          <ul style="color: #564239; font-size: 16px; line-height: 1.8;">
            <li>🐕 New dogs available for adoption</li>
            <li>❤️ Success stories from happy families</li>
            <li>📅 Upcoming events and volunteer opportunities</li>
          </ul>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">Together, we can find loving homes for every dog.</p>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">Woofs and warm regards,<br><strong>The Pawsome Shelter Team</strong></p>
        </div>
        <div style="background: #F2DED6; padding: 20px; text-align: center;">
          <p style="color: #564239; font-size: 12px; margin: 0;">© 2026 Pawsome Shelter. Made with ❤️ for dogs everywhere.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to Pawsome Shelter! 🐾',
    html,
  })
}

// Adoption inquiry confirmation
export async function sendAdoptionConfirmation(
  email: string,
  name: string,
  dogName: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF8F0; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #2A9D8F 0%, #00687C 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🐕 Adoption Inquiry Received!</h1>
        </div>
        <div style="padding: 40px;">
          <p style="color: #231915; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">Thank you for your interest in adopting <strong>${dogName}</strong>! We're excited about your inquiry.</p>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">We've received your application and our team will review it within 24-48 hours.</p>
          <div style="background: #FFF8F0; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #9E4203; margin: 0 0 16px 0; font-size: 18px;">What happens next:</h3>
            <ol style="color: #564239; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>We'll review your application</li>
              <li>Schedule a meet-and-greet with ${dogName}</li>
              <li>Complete the adoption process</li>
            </ol>
          </div>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">Questions? Reply to this email or call us at <strong>(555) PAW-SOME</strong>.</p>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">Warm regards,<br><strong>The Pawsome Shelter Team</strong></p>
        </div>
        <div style="background: #F2DED6; padding: 20px; text-align: center;">
          <p style="color: #564239; font-size: 12px; margin: 0;">© 2026 Pawsome Shelter. Made with ❤️ for dogs everywhere.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Your Adoption Inquiry for ${dogName} - We're Excited! 🐕`,
    html,
  })
}

// Volunteer application confirmation
export async function sendVolunteerConfirmation(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF8F0; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #E97A3D 0%, #2A9D8F 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🙋 Volunteer Application Received!</h1>
        </div>
        <div style="padding: 40px;">
          <p style="color: #231915; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">Thank you for your interest in volunteering at Pawsome Shelter! We truly appreciate your willingness to help our furry friends.</p>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">We've received your application and will review it shortly. Our volunteer coordinator will contact you within 3-5 business days.</p>
          <div style="background: #FFF8F0; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h3 style="color: #9E4203; margin: 0 0 16px 0; font-size: 18px;">What to expect:</h3>
            <ol style="color: #564239; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Application review</li>
              <li>Orientation session</li>
              <li>Start making a difference!</li>
            </ol>
          </div>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">Thank you for wanting to help our furry friends.</p>
          <p style="color: #564239; font-size: 16px; line-height: 1.6;">Warm regards,<br><strong>The Pawsome Shelter Team</strong></p>
        </div>
        <div style="background: #F2DED6; padding: 20px; text-align: center;">
          <p style="color: #564239; font-size: 12px; margin: 0;">© 2026 Pawsome Shelter. Made with ❤️ for dogs everywhere.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: 'Volunteer Application Received! 🙋',
    html,
  })
}
