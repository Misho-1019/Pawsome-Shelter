import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { join } from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_FROM = process.env.EMAIL_FROM || 'Pawsome Shelter <onboarding@resend.dev>'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Load hero image as base64
let HERO_IMAGE_BASE64 = ''
try {
  const heroPath = join(__dirname, 'hero-base64.txt')
  HERO_IMAGE_BASE64 = readFileSync(heroPath, 'utf-8').trim()
} catch (error) {
  console.warn('Hero image not found, using placeholder')
  HERO_IMAGE_BASE64 = ''
}

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

// Shared email wrapper
function wrapEmail(content: string): string {
  const heroImage = HERO_IMAGE_BASE64
    ? `<img src="data:image/jpeg;base64,${HERO_IMAGE_BASE64}" alt="Happy golden retriever" style="width: 100%; height: auto; display: block; max-height: 300px; object-fit: cover;">`
    : `<div style="background: linear-gradient(135deg, #E97A3D 0%, #2A9D8F 100%); height: 200px;"></div>`

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #FFF8F0; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFF8F0;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
              <!-- Header with Logo -->
              <tr>
                <td style="padding: 20px; text-align: center; background-color: #FFF8F0;">
                  <span style="font-size: 24px;">🐾</span>
                  <span style="font-size: 20px; font-weight: bold; color: #9E4203; font-family: Arial, sans-serif;"> Pawsome Shelter</span>
                </td>
              </tr>
              <!-- Hero Image -->
              <tr>
                <td>
                  ${heroImage}
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 24px; background-color: #F2DED6; text-align: center;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom: 16px;">
                        <a href="https://facebook.com/pawsomeshelter" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                          <img src="https://img.icons8.com/ios-filled/24/9E4203/facebook.png" alt="Facebook" width="24" height="24" style="border: 0;">
                        </a>
                        <a href="https://instagram.com/pawsomeshelter" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                          <img src="https://img.icons8.com/ios-filled/24/9E4203/instagram.png" alt="Instagram" width="24" height="24" style="border: 0;">
                        </a>
                        <a href="https://twitter.com/pawsomeshelter" style="display: inline-block; margin: 0 8px; text-decoration: none;">
                          <img src="https://img.icons8.com/ios-filled/24/9E4203/twitter.png" alt="Twitter" width="24" height="24" style="border: 0;">
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #564239; font-size: 12px; margin: 0 0 8px 0;">© 2026 Pawsome Shelter. All rights reserved.</p>
                  <p style="color: #564239; font-size: 12px; margin: 0 0 8px 0;">
                    <a href="mailto:unsubscribe@pawsomeshelter.com" style="color: #9E4203; text-decoration: underline;">Unsubscribe</a> | 
                    <a href="https://pawsomeshelter.com/privacy" style="color: #9E4203; text-decoration: underline;">Privacy Policy</a>
                  </p>
                  <p style="color: #564239; font-size: 12px; margin: 0;">🐾 Made with love for dogs everywhere</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

// Newsletter welcome email
export async function sendNewsletterWelcome(email: string) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

  // Build signed unsubscribe URL (lazy import to avoid circular deps)
  const { buildUnsubscribeUrl } = await import('../routes/newsletter')
  const unsubscribeUrl = buildUnsubscribeUrl(email, `${process.env.API_URL || 'http://localhost:3001'}`)

  const content = `
    <h1 style="color: #231915; font-size: 28px; margin: 0 0 20px 0;">🎉 Welcome to Pawsome Shelter!</h1>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hi there,</p>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Thank you for subscribing to our newsletter! We're thrilled to have you join our community of animal lovers.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding: 8px 0; color: #564239; font-size: 16px;">✓ New dogs available for adoption</td></tr>
      <tr><td style="padding: 8px 0; color: #564239; font-size: 16px;">✓ Success stories from happy families</td></tr>
      <tr><td style="padding: 8px 0; color: #564239; font-size: 16px;">✓ Events and volunteer opportunities</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
      <tr><td align="center">
        <a href="${escapeHtml(frontendUrl)}/#dogs" style="background-color: #E97A3D; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Browse Our Dogs →</a>
      </td></tr>
    </table>
    <p style="color: #564239; font-size: 14px; line-height: 1.6; margin-top: 32px;">Questions? Reply to this email or call us at <strong>(555) PAW-SOME</strong>.</p>
    <p style="color: #564239; font-size: 12px; line-height: 1.6; margin-top: 24px;">
      <a href="${escapeHtml(unsubscribeUrl)}" style="color: #9E4203; text-decoration: underline;">Unsubscribe from these emails</a>
    </p>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin-top: 16px;">Woofs and warm regards,<br><strong>The Pawsome Shelter Team</strong></p>
  `

  return sendEmail({
    to: email,
    subject: 'Welcome to Pawsome Shelter! 🐾',
    html: wrapEmail(content),
  })
}

// Adoption inquiry confirmation
export async function sendAdoptionConfirmation(email: string, name: string, dogName: string) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

  const content = `
    <h1 style="color: #231915; font-size: 28px; margin: 0 0 20px 0;">🐕 Adoption Inquiry Received!</h1>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hi ${escapeHtml(name)},</p>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Thank you for your interest in adopting <strong>${escapeHtml(dogName)}</strong>! We're excited about your inquiry.
    </p>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      We've received your application and our team will review it within 24-48 hours.
    </p>
    <div style="background: #FFF8F0; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #9E4203; margin: 0 0 16px 0; font-size: 18px;">What happens next:</h3>
      <ol style="color: #564239; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>We'll review your application</li>
        <li>Schedule a meet-and-greet with ${escapeHtml(dogName)}</li>
        <li>Complete the adoption process</li>
      </ol>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
      <tr><td align="center">
        <a href="${escapeHtml(frontendUrl)}/#dogs" style="background-color: #E97A3D; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">View Dog Details →</a>
      </td></tr>
    </table>
    <p style="color: #564239; font-size: 14px; line-height: 1.6; margin-top: 32px;">Questions? Reply to this email or call us at <strong>(555) PAW-SOME</strong>.</p>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin-top: 16px;">Warm regards,<br><strong>The Pawsome Shelter Team</strong></p>
  `

  return sendEmail({
    to: email,
    subject: `Your Adoption Inquiry for ${escapeHtml(dogName)} - We're Excited! 🐕`,
    html: wrapEmail(content),
  })
}

// Volunteer application confirmation
export async function sendVolunteerConfirmation(email: string, name: string) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

  const content = `
    <h1 style="color: #231915; font-size: 28px; margin: 0 0 20px 0;">🙋 Volunteer Application Received!</h1>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hi ${escapeHtml(name)},</p>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Thank you for your interest in volunteering at Pawsome Shelter! We truly appreciate your willingness to help our furry friends.
    </p>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      We've received your application and will review it shortly. Our volunteer coordinator will contact you within 3-5 business days.
    </p>
    <div style="background: #FFF8F0; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #9E4203; margin: 0 0 16px 0; font-size: 18px;">What to expect:</h3>
      <ol style="color: #564239; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>Application review</li>
        <li>Orientation session</li>
        <li>Start making a difference!</li>
      </ol>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
      <tr><td align="center">
        <a href="${escapeHtml(frontendUrl)}/#volunteer" style="background-color: #2A9D8F; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Learn More →</a>
      </td></tr>
    </table>
    <p style="color: #564239; font-size: 14px; line-height: 1.6; margin-top: 32px;">Questions? Reply to this email or call us at <strong>(555) PAW-SOME</strong>.</p>
    <p style="color: #564239; font-size: 16px; line-height: 1.6; margin-top: 16px;">Warm regards,<br><strong>The Pawsome Shelter Team</strong></p>
  `

  return sendEmail({
    to: email,
    subject: 'Volunteer Application Received! 🙋',
    html: wrapEmail(content),
  })
}
