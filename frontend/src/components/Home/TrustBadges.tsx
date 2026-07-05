import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const badges = [
  { icon: Truck, title: 'Complimentary Shipping', desc: 'On all orders over $500' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: '256-bit SSL encryption' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return window' },
  { icon: Headphones, title: 'Concierge Support', desc: '24/7 dedicated service' }
];

export default function TrustBadges() {
  return (
    <section className="py-14 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                <badge.icon className="w-5 h-5 text-neutral-900" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 text-sm">{badge.title}</h4>
                <p className="text-xs text-neutral-500 mt-0.5">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
