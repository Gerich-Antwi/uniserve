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

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"


gsap.registerPlugin(ScrollTrigger)

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
    <section
      ref={sectionRef}
      id="services"
      className="py-28 bg-yellow-50"
    >
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="features-heading text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Everything Students Need — In One Place
          </h2>
          <p className="text-gray-600 mt-5 text-lg">
            Access essential campus services and important updates without stress.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          <FeatureCard
            icon={<ServicesIcon />}
            title="Campus Services"
            desc="Food, laundry, barbering, cleaning, and daily student essentials in one place."
          />

          <FeatureCard
            icon={<BookingIcon />}
            title="Easy Booking"
            desc="Book services instantly without long queues or complicated steps."
          />

          <FeatureCard
            icon={<AnnouncementIcon />}
            title="Announcements Hub"
            desc="Get updates on internships, events, payments, and campus deadlines."
          />

          <FeatureCard
            icon={<ProviderIcon />}
            title="Service Providers"
            desc="Verified vendors connect directly with students through the platform."
          />

        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="feature-card group bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-6 group-hover:scale-110 transition">
        {icon}
      </div>

      <h3 className="font-semibold text-xl text-gray-900 mb-3">
        {title}
      </h3>

      <p className="text-gray-600 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  )
}

function ServicesIcon() {
  return (
    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4 6h16v12H4z" />
    </svg>
  )
}

function BookingIcon() {
  return (
    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 3h14v18H5z" />
    </svg>
  )
}

function AnnouncementIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
  <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
</svg>

  )
}

function ProviderIcon() {
  return (
    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 22c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  )
}