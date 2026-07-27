import { useState } from 'react'
import { Drawer } from '../ui'

interface FAQModalProps {
  isOpen: boolean
  onClose: () => void
}

const faqs = [
  {
    question: 'How long does the adoption process take?',
    answer: 'The adoption process typically takes 1-2 weeks from application to bringing your dog home. This includes application review, meet-and-greet, home visit, and final paperwork.',
  },
  {
    question: 'What are the adoption fees?',
    answer: 'Adoption fees vary by dog and range from $150 to $400. The fee covers vaccinations, spay/neuter surgery, microchipping, and a health checkup.',
  },
  {
    question: 'Can I meet the dog before adopting?',
    answer: 'Absolutely! We encourage meet-and-greets before finalizing the adoption. You can schedule a visit during our operating hours or arrange a specific appointment.',
  },
  {
    question: 'What if the adoption doesn\'t work out?',
    answer: 'We offer a 30-day trial period. If the adoption isn\'t a good fit, you can return the dog to us. We\'ll work with you to find a better match or provide support to help the adjustment.',
  },
  {
    question: 'Do you accept donations?',
    answer: 'Yes! Donations help us provide medical care, food, and shelter for our dogs. You can donate online through our website or visit us in person. All donations are tax-deductible.',
  },
  {
    question: 'How can I volunteer?',
    answer: 'Click "Apply to Volunteer" in the Get Involved section or contact us directly. We need help with dog walking, event support, administrative tasks, and more. No experience necessary!',
  },
  {
    question: 'What are your visiting hours?',
    answer: 'We\'re open Monday-Friday from 10 AM to 6 PM, and Saturday-Sunday from 11 AM to 4 PM. Walk-ins are welcome, but appointments are recommended for meet-and-greets.',
  },
  {
    question: 'Can I adopt if I live in an apartment?',
    answer: 'Yes! Many of our dogs do well in apartments. We\'ll help match you with a dog that fits your living situation and lifestyle. Factors like energy level, size, and exercise needs are considered.',
  },
]

export function FAQModal({ isOpen, onClose }: FAQModalProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Frequently Asked Questions" size="lg">
      <div className="p-8">
        <p className="text-on-surface-variant mb-8">
          Find answers to common questions about adoption, volunteering, and our shelter.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-outline-variant rounded-xl overflow-hidden"
            >
              <h3 className="sr-only" id={`faq-question-${index}`}>
                {faq.question}
              </h3>
              <button
                onClick={() => toggleFaq(index)}
                aria-expanded={expandedIndex === index}
                aria-controls={`faq-answer-${index}`}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-surface-container-low transition-colors"
              >
                <span className="font-heading font-semibold text-on-surface pr-4">
                  {faq.question}
                </span>
                <span
                  className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                >
                  expand_more
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  expandedIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4 text-on-surface-variant leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-surface-container-low rounded-xl">
          <p className="text-on-surface-variant text-sm">
            Still have questions? Contact us at{' '}
            <a href="mailto:info@pawsomeshelter.com" className="text-primary hover:underline">
              info@pawsomeshelter.com
            </a>{' '}
            or call{' '}
            <a href="tel:+15557297663" className="text-primary hover:underline">
              (555) PAW-SOME
            </a>
          </p>
        </div>
      </div>
    </Drawer>
  )
}
