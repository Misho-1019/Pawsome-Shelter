import { Drawer } from '../ui'

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Privacy Policy" size="lg">
      <div className="p-8">
        <p className="text-sm text-on-surface-variant mb-6">Last updated: July 27, 2026</p>

        <div className="space-y-8">
          <section>
            <h3 className="font-heading text-xl mb-3">1. Information We Collect</h3>
            <p className="text-on-surface-variant leading-relaxed">
              When you interact with our website, we may collect the following information:
            </p>
            <ul className="list-disc list-inside text-on-surface-variant mt-3 space-y-2">
              <li>Name and contact information when you submit adoption or volunteer forms</li>
              <li>Email address when you subscribe to our newsletter</li>
              <li>Phone number (optional) for contact purposes</li>
              <li>Adoption inquiry details and preferences</li>
            </ul>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">2. How We Use Your Information</h3>
            <p className="text-on-surface-variant leading-relaxed">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-on-surface-variant mt-3 space-y-2">
              <li>Process adoption inquiries and match dogs with families</li>
              <li>Send newsletter updates about available dogs and events (if subscribed)</li>
              <li>Contact you about volunteer opportunities</li>
              <li>Improve our services and website experience</li>
            </ul>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">3. Data Protection</h3>
            <p className="text-on-surface-variant leading-relaxed">
              We take your privacy seriously. Your data is stored securely in our database and is protected by industry-standard security measures. We do not sell, trade, or rent your personal information to third parties.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">4. Cookies</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Our website uses essential cookies to ensure proper functionality. We do not use third-party tracking cookies or advertising cookies.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">5. Your Rights</h3>
            <p className="text-on-surface-variant leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-on-surface-variant mt-3 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of newsletter communications at any time</li>
            </ul>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">6. Contact Us</h3>
            <p className="text-on-surface-variant leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-disc list-inside text-on-surface-variant mt-3 space-y-2">
              <li>Email: privacy@pawsomeshelter.com</li>
              <li>Phone: (555) PAW-SOME</li>
              <li>Address: 123 Rescue Lane, Houndview Heights, Paw City, PC 56789</li>
            </ul>
          </section>
        </div>
      </div>
    </Drawer>
  )
}
