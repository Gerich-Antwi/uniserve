// "use client"

// export default function Features() {
//   return (
//     <section id="services" className="py-28 bg-white">
//       <div className="max-w-6xl mx-auto px-4">

//         {/* Heading */}
//         <div className="text-center max-w-2xl mx-auto mb-20">
//           <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
//             Everything Students Need — In One Place
//           </h2>
//           <p className="text-gray-600 mt-5 text-lg">
//             Access essential campus services and important updates without stress.
//           </p>
//         </div>

//         {/* Grid */}
//         <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

//           <FeatureCard
//             icon={<ServicesIcon />}
//             title="Campus Services"
//             desc="Food, laundry, barbering, cleaning, and daily student essentials in one place."
//           />

//           <FeatureCard
//             icon={<BookingIcon />}
//             title="Easy Booking"
//             desc="Book services instantly without long queues or complicated steps."
//           />

//           <FeatureCard
//             icon={<AnnouncementIcon />}
//             title="Announcements Hub"
//             desc="Get updates on internships, events, payments, and campus deadlines."
//           />

//           <FeatureCard
//             icon={<ProviderIcon />}
//             title="Service Providers"
//             desc="Verified vendors connect directly with students through the platform."
//           />

//         </div>

//       </div>
//     </section>
//   )
// }

// function FeatureCard({
//   icon,
//   title,
//   desc,
// }: {
//   icon: React.ReactNode
//   title: string
//   desc: string
// }) {
//   return (
//     <div className="group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl transition duration-300">

//       <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-6 group-hover:scale-110 transition">
//         {icon}
//       </div>

//       <h3 className="font-semibold text-xl text-gray-900 mb-3">
//         {title}
//       </h3>

//       <p className="text-gray-600 leading-relaxed text-sm">
//         {desc}
//       </p>
//     </div>
//   )
// }

// function ServicesIcon() {
//   return (
//     <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M4 6h16v12H4z" />
//     </svg>
//   )
// }

// function BookingIcon() {
//   return (
//     <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M5 3h14v18H5z" />
//     </svg>
//   )
// }

// function AnnouncementIcon() {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
//   <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
//   <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
// </svg>

//   )
// }

// function ProviderIcon() {
//   return (
//     <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
//       <circle cx="12" cy="8" r="4" />
//       <path d="M4 22c0-4 4-7 8-7s8 3 8 7" />
//     </svg>
//   )
// }

"use client"

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Shirt,
  Scissors,
  Smartphone,
  Utensils,
  Coffee,
  BookOpen,
} from "lucide-react";
import { useRef, useEffect } from "react";

const services = [
  {
    id: 1,
    name: "Laundry",
    icon: Shirt,
    color: "bg-cyan-400",
    description: "Fresh clothes, zero effort",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800&q=80",
    rotation: "-rotate-2",
  },
  {
    id: 2,
    name: "Grooming",
    icon: Scissors,
    color: "bg-pink-400",
    description: "Look sharp, feel good",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    rotation: "rotate-1",
  },
  {
    id: 3,
    name: "Tech Support",
    icon: Smartphone,
    color: "bg-purple-400",
    description: "Fix it fast",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80",
    rotation: "rotate-2",
  },
  {
    id: 4,
    name: "Food Delivery",
    icon: Utensils,
    color: "bg-orange-400",
    description: "Hungry? Sorted.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    rotation: "-rotate-1",
  },
  {
    id: 5,
    name: "Coffee Run",
    icon: Coffee,
    color: "bg-lime-400",
    description: "Caffeine on demand",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80",
    rotation: "rotate-3",
  },
  {
    id: 6,
    name: "Tutoring",
    icon: BookOpen,
    color: "bg-yellow-400",
    description: "Ace those exams",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
    rotation: "-rotate-2",
  },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Same-day service on most requests",
    color: "bg-yellow-300",
  },
  {
    icon: Shield,
    title: "100% Verified",
    description: "All providers are campus-approved",
    color: "bg-green-300",
  },
  {
    icon: DollarSign,
    title: "Student Deals",
    description: "Exclusive discounts for students",
    color: "bg-blue-300",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Built by students, for students",
    color: "bg-purple-300",
  },
  {
    icon: Star,
    title: "Top Rated",
    description: "4.9★ average across all services",
    color: "bg-pink-300",
  },
  {
    icon: TrendingUp,
    title: "Growing Fast",
    description: "10K+ students already onboard",
    color: "bg-orange-300",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate heading
      gsap.from(".features-heading", {
        scrollTrigger: {
          trigger: sectionRef.current,
          // toggleActions: "play reverse restart reverse",
          markers: true,
          scrub: 0.5,
          start: "top 80%",
        },
        x: 500,
        opacity: 30,
        duration: 0.8,
        ease: "power3.out",
      })

      // Animate feature cards
      // gsap.from(".feature-card", {
      //   scrollTrigger: {
      //     trigger: sectionRef.current,
      //     toggleActions: "play none none none",
      //     markers: true,
      //     start: "top 75%",
      //   },
      //   y: 60,
      //   opacity: 0,
      //   stagger: 0.15,
      //   duration: 1,
      //   ease: "power3.out",
      // })
    // }, sectionRef)

    ScrollTrigger.batch(".feature-card", {
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { 
              y: 60,
               opacity: 0 ,
           },

            {
              y: 30,
              opacity: 100,
              duration: 0.8,
              stagger: 0.15,
              scrub: 0.5,
              ease: "power3.out",
              overwrite: true, // ← prevents conflicting tweens
            }
          ),
        // onLeaveBack: (elements) =>
        //   gsap.to(elements, {
        //     y: 60,
        //     opacity: 0,
        //     duration: 0.4,
        //     stagger: 0.1,
        //     overwrite: true,
        //   }),
        start: "top 85%",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (

    <>
      {/* Services - Horizontal Scroll with Neo-Brutalism */}
      <section className="py-24 bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center">
            <h2 className="inline-block text-5xl sm:text-6xl font-black mb-4 bg-yellow-300 border-6 border-black px-8 py-4 rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              WHAT WE OFFER
            </h2>
            <p className="text-xl font-bold mt-8 max-w-2xl mx-auto">
              All the essentials, zero hassle 💪
            </p>
          </div>

        </div>

        <div className="relative">
          <div className="flex gap-8 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-8 scrollbar-hide">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="flex-shrink-0 w-80 sm:w-96"
                >
                  <Link href={`/services`}>
                    <div
                      className={`group relative h-[500px] border-6 border-black ${service.rotation} hover:rotate-0 transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 overflow-hidden`}
                    >
                      {/* Image */}
                      <div className="absolute inset-0">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Color overlay for mixed-media style */}
                        <div
                          className={`absolute inset-0 ${service.color} mix-blend-multiply opacity-60`}
                        />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 h-full p-6 flex flex-col">
                        {/* Icon Badge */}
                        <div
                          className={`w-20 h-20 ${service.color} border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4`}
                        >
                          <Icon className="text-black" size={36} />
                        </div>

                        {/* Service Name */}
                        <div className="mt-auto">
                          <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-3">
                            <h3 className="text-3xl font-black mb-1">
                              {service.name}
                            </h3>
                            <p className="font-bold text-sm">
                              {service.description}
                            </p>
                          </div>

                          {/* Action Button */}
                          <div
                            className={`${service.color} border-4 border-black px-4 py-3 font-black text-sm flex items-center justify-between group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
                          >
                            <span>LEARN MORE</span>
                            <ArrowRight
                              size={20}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>


        <div className="text-center mt-12">
          <Link href="/services" className="inline-block">
            <div className="bg-pink-300 border-4 border-black px-8 py-4 font-black text-lg hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              VIEW ALL SERVICES →
            </div>
          </Link>
        </div>
      </section>

      {/* Features Grid - WHY WE ROCK */}
      <section className="py-24 bg-lime-100 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="inline-block text-5xl sm:text-6xl font-black mb-4 bg-white border-6 border-black px-8 py-4 -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              WHY WE ROCK
            </h2>
            <p className="text-xl font-bold mt-8">
              Because your time is precious ⏰
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`${feature.color} border-6 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all ${index % 2 === 0 ? "rotate-1" : "-rotate-1"} hover:rotate-0`}
                >
                  <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center mb-6 rotate-12">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-3 uppercase">
                    {feature.title}
                  </h3>
                  <p className="font-bold text-lg">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

