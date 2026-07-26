import { Drawer } from '../ui'

interface TermsOfServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Terms of Service" size="lg">
      <div className="p-8">
        <p className="text-sm text-on-surface-variant mb-6">Last updated: July 27, 2026</p>

        <div className="space-y-8">
          <section>
            <h3 className="font-heading text-xl mb-3">1. Acceptance of Terms</h3>
            <p className="text-on-surface-variant leading-relaxed">
              By accessing and using the Pawsome Shelter website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">2. Adoption Terms</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Submitting an adoption inquiry does not guarantee adoption. All adoptions are subject to:
            </p>
            <ul className="list-disc list-inside text-on-surface-variant mt-3 space-y-2">
              <li>Approval of adoption application</li>
              <li>Successful meet-and-greet with the dog</li>
              <li>Home visit approval</li>
              <li>Payment of applicable adoption fees</li>
            </ul>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">3. Liability Disclaimer</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Pawsome Shelter strives to provide accurate information about our dogs, including temperament, health, and behavior. However, we cannot guarantee that a dog's behavior will remain unchanged after adoption. Adopters assume responsibility for their adopted pet.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">4. Intellectual Property</h3>
            <p className="text-on-surface-variant leading-relaxed">
              All content on this website, including text, images, logos, and design elements, is the property of Pawsome Shelter and is protected by copyright laws. You may not reproduce or distribute any content without written permission.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">5. Donations</h3>
            <p className="text-on-surface-variant leading-relaxed">
              All donations are final and non-refundable. Donations are used to support the care and welfare of animals at Pawsome Shelter. Tax receipts will be provided for qualifying donations.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">6. Changes to Terms</h3>
            <p className="text-on-surface-variant leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on this page. Your continued use of the website constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h3 className="font-heading text-xl mb-3">7. Contact Information</h3>
            <p className="text-on-surface-variant leading-relaxed">
              For questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-disc list-inside text-on-surface-variant mt-3 space-y-2">
              <li>Email: legal@pawsomeshelter.com</li>
              <li>Phone: (555) PAW-SOME</li>
              <li>Address: 123 Rescue Lane, Houndview Heights, Paw City, PC 56789</li>
            </ul>
          </section>
        </div>
      </div>
    </Drawer>
  )
}
