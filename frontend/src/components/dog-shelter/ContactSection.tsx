import { SlideIn } from '../ui/animations'

export function ContactSection() {
  return (
    <section className="py-32 bg-surface-container-low" id="contact">
      <div className="max-w-container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <SlideIn from="left">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl mb-10">
                Visit Our Shelter
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm mb-1 uppercase tracking-widest">Address</h4>
                    <p className="font-body text-lg">
                      123 Rescue Lane, Houndview Heights<br />Paw City, PC 56789
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm mb-1 uppercase tracking-widest">Call Us</h4>
                    <a href="tel:+15557297663" className="font-body text-lg hover:text-primary transition-colors inline-flex items-center gap-2">
                      (555) PAW-SOME • (555) 729-7663
                    </a>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm mb-1 uppercase tracking-widest">Visiting Hours</h4>
                    <p className="font-body text-lg">
                      Mon - Fri: 10 AM - 6 PM<br />Sat - Sun: 11 AM - 4 PM
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm mb-1 uppercase tracking-widest">Email</h4>
                    <a href="mailto:info@pawsomeshelter.com" className="font-body text-lg hover:text-primary transition-colors">
                      info@pawsomeshelter.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-16 flex gap-6">
                <a className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary-container hover:text-white transition-all shadow-sm" href="#">
                  <img alt="Facebook" className="w-6 h-6" src="/images/icon-facebook.png" />
                </a>
                <a className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary-container hover:text-white transition-all shadow-sm" href="#">
                  <img alt="Instagram" className="w-6 h-6" src="/images/icon-instagram.png" />
                </a>
                <a className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary-container hover:text-white transition-all shadow-sm" href="#">
                  <img alt="Twitter" className="w-6 h-6" src="/images/icon-twitter.png" />
                </a>
                <a className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary-container hover:text-white transition-all shadow-sm" href="#">
                  <img alt="TikTok" className="w-6 h-6" src="/images/icon-tiktok.png" />
                </a>
              </div>
            </div>
          </SlideIn>

          {/* Interactive Map */}
          <SlideIn from="right">
            <a
              href="https://www.google.com/maps/search/?api=1&query=123+Rescue+Lane+Houndview+Heights+Paw+City+PC+56789"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative h-[500px] bg-surface rounded-3xl overflow-hidden shadow-2xl border-4 border-white group"
            >
              <div
                className="absolute inset-0 bg-gray-200 group-hover:opacity-90 transition-opacity duration-300"
                style={{ backgroundImage: "url('/images/map-placeholder.jpg')" }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-primary-container text-white p-4 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">pets</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="material-symbols-outlined text-primary text-lg">directions</span>
                <span className="font-semibold text-sm">Get Directions</span>
              </div>
            </a>
          </SlideIn>
        </div>
      </div>
    </section>
  )
}
