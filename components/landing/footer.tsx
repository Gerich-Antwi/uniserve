"use client";

import Link from "next/link";
import gsap from "gsap";
import {useRef, useEffect} from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChatBot } from "@/components/chat/bot";

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() =>{
      gsap.to(".box1",{
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play restart reverse none",
          scrub: true,
        },
        x: 200,
        y:500,
        rotation: 300,
        duration: 1.5,
        
      });

      gsap.from(".box2",{
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          scrub: true,
        },
         y: 100,
         x: -100,
      });

      gsap.from(".box3",{
        scrollTrigger: {
          trigger: sectionRef.current,  
          start: "top 80%",
          scrub:true
        },
         y: 20,
         opacity: 0,
      });

      gsap.from(".box4",{
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          scrub:true

        },
         x: 200,
         opacity: 0,
      });

  
    }, sectionRef)

    return () => ctx.revert()
  }, [])
  
  return (
    <>
      {/* Final CTA Section */}
      <section 
      ref={sectionRef}
      className="py-16 sm:py-24 md:py-32 bg-cyan-300 border-b-8 border-black relative overflow-hidden">
        {/* Decorative elements - hidden or scaled on very small screens */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="box1 absolute top-10 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-pink-400 border-4 border-black rotate-45 animate-float" style={{ "--float-rotate": "45deg" } as React.CSSProperties} />
          <div className="box2 absolute top-40 sm:top-60 right-4 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-yellow-300 rounded-full border-4 border-black animate-float " style={{ "--float-rotate": "0deg" } as React.CSSProperties} />
          <div className="box3 absolute bottom-4 sm:bottom-10 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-orange-400 border-4 border-black " style={{ "--float-rotate": "0deg" } as React.CSSProperties} />
          <div className="box4 absolute bottom-16 sm:bottom-20 right-1/4 sm:right-1/3 w-14 h-14 sm:w-20 sm:h-20 bg-lime-300 border-4 border-black rotate-12 " style={{ "--float-rotate": "12deg" } as React.CSSProperties} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 leading-tight">
            <span className="inline-block bg-white border-4 sm:border-6 border-black px-3 py-2 sm:px-6 sm:py-3 rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-2 sm:mb-4">
              READY TO
            </span>
            <br />
            <span className="inline-block bg-pink-400 border-4 sm:border-6 border-black px-3 py-2 sm:px-6 sm:py-3 -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              UPGRADE YOUR
            </span>
            <br />
            <span className="inline-block bg-yellow-300 border-4 sm:border-6 border-black px-3 py-2 sm:px-6 sm:py-3 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-2 sm:mt-4">
              CAMPUS LIFE?
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-8 sm:mb-12 px-2">
            Join 10,000+ students living their best life
          </p>
          <Link href="/auth/sign-up" className="inline-block">
            <div className="bg-black text-white px-6 py-4 sm:px-8 sm:py-5 md:px-12 md:py-6 font-black text-base sm:text-lg md:text-xl lg:text-2xl border-4 sm:border-[6px] border-black hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-1 hover:rotate-0 active:translate-y-0.5 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              GET STARTED FREE &rarr;
            </div>
          </Link>
          <p className="mt-6 sm:mt-8 font-bold text-sm sm:text-base md:text-lg px-2">
            No credit card &bull; No BS &bull; Just vibes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
            <div>
              <div className="inline-block bg-yellow-300 text-black border-4 border-white px-4 py-2 font-black text-xl mb-4 rotate-2">
                CAMPUS
              </div>
              <p className="font-bold text-gray-300">
                Making campus life easier, one service at a time.
              </p>
            </div>

            <div>
              <h4 className="font-black mb-4 text-xl">SERVICES</h4>
              <ul className="space-y-2 font-bold">
                <li>
                  <Link href="/services" className="hover:text-yellow-300 transition-colors">
                    &rarr; Laundry
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-yellow-300 transition-colors">
                    &rarr; Grooming
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-yellow-300 transition-colors">
                    &rarr; Tech Support
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-yellow-300 transition-colors">
                    &rarr; Food Delivery
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-4 text-xl">COMPANY</h4>
              <ul className="space-y-2 font-bold">
                <li>
                  <Link href="#" className="hover:text-pink-300 transition-colors">
                    &rarr; About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-pink-300 transition-colors">
                    &rarr; Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-pink-300 transition-colors">
                    &rarr; Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-pink-300 transition-colors">
                    &rarr; Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-4 text-xl">LEGAL</h4>
              <ul className="space-y-2 font-bold">
                <li>
                  <Link href="/privacy" className="hover:text-cyan-300 transition-colors">
                    &rarr; Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-cyan-300 transition-colors">
                    &rarr; Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-300 transition-colors">
                    &rarr; Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t-4 border-white text-center">
            <p className="font-black text-xs sm:text-sm md:text-lg px-2">
              &copy; 2026 CAMPUSSERVICES &bull; MADE WITH &hearts; BY STUDENTS
            </p>
          </div>

        </div>
      </footer>
      <ChatBot />
    </>
  );
}
