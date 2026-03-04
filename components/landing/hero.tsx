"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import gsap from "gsap";
import useLenis from "@/hooks/useLenis";
import { useEffect, useRef } from "react";

export default function Hero() {
  useLenis();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".hero-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out",
      })
        .from(
          ".hero-sub",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".hero-cta",
          {
            scale: 1.3,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3",
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div>
      {/* <Navbar />  */}
      {/* <section ref={heroRef}
       className="min-h-screen  flex items-center justify-center bg-gray-50 relative overflow-hidden">
        
        
        <div className="max-w-6xl mx-auto h-96 px-4 w-full flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="flex flex-col gap-5 text-center bg md:text-left max-w-xl w-full">
            <h1 className="hero-title font-bold text-4xl md:text-5xl leading-tight text-gray-900">
              No Stress. No Searching.
            </h1>

            <h3 className="font-medium text-lg text-teal-700">
              Just Student Services Made Easy
            </h3>

            <p className="text-gray-600">
              Your gateway to seamless university services — from food and
              laundry to announcements and campus opportunities.
            </p>

            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <Link href="/auth/signup">
                <button className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition">
                  Get Started
                </button>
              </Link>

              <Link href="/services">
                <button className="border border-teal-600 text-teal-600 px-6 py-3 rounded-md hover:bg-teal-50 transition">
                  Explore Services
                </button>
              </Link>
            </div>
          </div>

          
          <div className="bg-emerald-950 w-dvh h-72  md:w-96 md:h-96 rounded-3xl flex items-center justify-center shadow-lg shrink-0 relative overflow-hidden ">
            <Image
              src="/landing_assets/youth.jpg"
              alt="Students using campus services"
              fill
              className="object-cover rounded-3xl opacity-90 "
              
            />
          </div>
        </div>
      </section> */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-6 bg-cyan-950 relative overflow-hidden"
      >
        
        <div className="absolute inset-0 bg-[url('/landing_assets/graduation.jpg')] bg-cover bg-center opacity-30" />
        <div className="max-w-4xl text-center">
          <h1 className="hero-title text-4xl md:text-6xl font-bold leading-tight text-white">
            Campus Life. Finally Simplified.
          </h1>
          <p className="hero-sub mt-6 text-lg text-gray-200">
            Access trusted campus services and real-time announcements — all in
            one place.
          </p>

          {/* Cta-button container */}
          <div className="hero-cta mt-8 flex justify-center gap-4">
            <Link href="/auth/signup">
              <button className="px-6 py-3 bg-black border-2  hover:bg-teal-600 text-white rounded-lg hover:opacity-90 transition">
                Get Started
              </button>
            </Link>
            <Link href="/services">
              <button className="px-6 py-3 text-gray-100 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 hover:border-emerald-900 transition">
                Explore Services
              </button>
            </Link>
          </div>
          
        </div>
      </section>
    </div>
  );
}
