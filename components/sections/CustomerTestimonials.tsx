import { FC } from 'react';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}

const CustomerTestimonials: FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Rajesh Sharma',
      role: 'Vegetable grower, Punjab',
      content:
        'The product recommendations were practical and timely. We improved crop uniformity and reduced trial-and-error purchases during the season.',
      rating: 5,
      initials: 'RS',
    },
    {
      id: 2,
      name: 'Priya Verma',
      role: 'Organic farmer, Uttar Pradesh',
      content:
        'IGO CropCare made it easier to compare verified organic inputs and place repeat orders without calling multiple suppliers.',
      rating: 5,
      initials: 'PV',
    },
    {
      id: 3,
      name: 'Arun Kumar',
      role: 'Horticulture grower, Karnataka',
      content:
        'Crop Doctor helped us respond quickly when tomato symptoms appeared. The recommendations were clear and easy to share with my team.',
      rating: 5,
      initials: 'AK',
    },
    {
      id: 4,
      name: 'Sunita Devi',
      role: 'Apple grower, Himachal Pradesh',
      content:
        'Delivery updates, product details, and support are more organized than traditional ordering. It feels built for serious growers.',
      rating: 4,
      initials: 'SD',
    },
  ];

  return (
    <section className="bg-gray-50 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-700">Customer outcomes</p>
          <h2 className="mt-2 text-4xl font-bold text-gray-900">Trusted by growers across India</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Practical tools, dependable products, and responsive support for everyday farm decisions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md"
            >
              <Quote className="mb-5 h-7 w-7 text-green-600" />
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-gray-700">&quot;{testimonial.content}&quot;</p>

              <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {testimonial.initials}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid overflow-hidden rounded-lg border border-green-200 bg-white md:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-green-700 p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-100">Field success program</p>
            <h3 className="mt-2 text-2xl font-bold">Advisory support for dealers and high-volume farms</h3>
            <p className="mt-3 text-green-50">
              Build crop-wise input plans, request bulk pricing, and coordinate seasonal procurement with the IGO team.
            </p>
          </div>
          <div className="flex items-center justify-center p-8">
            <a
              href="/b2b"
              className="rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition hover:bg-green-700"
            >
              Start B2B Inquiry
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
