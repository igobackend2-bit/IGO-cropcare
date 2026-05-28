import { FC } from 'react';
import { Award, CheckCircle, Clock, HeadphonesIcon, Shield, Star, Truck, Users } from 'lucide-react';

interface Badge {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

const TrustBadgesSection: FC = () => {
  const badges: Badge[] = [
    {
      icon: <CheckCircle className="h-7 w-7" />,
      title: '100% Genuine',
      desc: 'Verified & authentic products only',
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: <Truck className="h-7 w-7" />,
      title: 'PAN India Delivery',
      desc: 'Fast shipping to all pin codes',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: <Award className="h-7 w-7" />,
      title: 'COD Available',
      desc: 'Pay on delivery — no prepay needed',
      color: 'text-orange-600 bg-orange-50',
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: '50,000+ Farmers',
      desc: 'Trusted by growers across India',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: <Star className="h-7 w-7" />,
      title: '4.6 / 5 Rating',
      desc: 'Top-rated agri platform',
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      icon: <HeadphonesIcon className="h-7 w-7" />,
      title: 'Expert Support',
      desc: 'Agronomy help at every step',
      color: 'text-teal-600 bg-teal-50',
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: 'Secure Checkout',
      desc: 'Safe & encrypted payments',
      color: 'text-red-600 bg-red-50',
    },
    {
      icon: <Clock className="h-7 w-7" />,
      title: '24/7 Service',
      desc: 'Round-the-clock farmer support',
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  return (
    <section className="border-b border-gray-100 bg-white px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:border-green-200 hover:shadow-md"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${badge.color}`}>
                {badge.icon}
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight">{badge.title}</p>
              <p className="text-[11px] text-gray-500 leading-tight hidden sm:block">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;
