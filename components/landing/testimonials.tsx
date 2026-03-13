import { Star, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    role: "CS Student",
    quote: "This app is literally a lifesaver! No cap",
    rating: 5,
    color: "bg-pink-200",
    rotation: "rotate-1",
  },
  {
    name: "Rahul V.",
    role: "Business Major",
    quote: "Finally, someone gets what students need fr fr",
    rating: 5,
    color: "bg-cyan-200",
    rotation: "-rotate-2",
  },
  {
    name: "Ananya P.",
    role: "Engineering",
    quote: "Best decision I made this semester",
    rating: 5,
    color: "bg-yellow-200",
    rotation: "rotate-2",
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-orange-100 border-b-8 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="inline-block text-3xl sm:text-5xl md:text-6xl font-black mb-4 bg-pink-300 border-4 sm:border-6 border-black px-4 sm:px-6 md:px-8 py-3 sm:py-4 rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            STUDENT LOVE
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-bold mt-4 sm:mt-8 px-2">
            Real talk from real students
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative group">
              <div
                className={`${testimonial.color} border-4 sm:border-6 border-black p-4 sm:p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all ${testimonial.rotation} hover:rotate-0`}
              >
                {/* Quote */}
                <div className="bg-white border-4 border-black p-4 sm:p-6 mb-4 sm:mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-bold text-sm sm:text-base md:text-lg leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-base sm:text-xl">
                      {testimonial.name[0]}
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-300 border-2 sm:border-[3px] border-black rounded-full flex items-center justify-center rotate-12">
                      <CheckCircle size={12} className="sm:w-4 sm:h-4 text-black" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-base sm:text-lg truncate">{testimonial.name}</div>
                    <div className="font-bold text-xs sm:text-sm text-foreground/80">{testimonial.role}</div>
                    <div className="flex gap-0.5 sm:gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={12} className="sm:w-3.5 sm:h-3.5 fill-black text-black" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {index === 1 && (
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-lime-300 border-4 border-black px-2 py-0.5 sm:px-3 sm:py-1 font-black text-xs sm:text-sm rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  BEST!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
