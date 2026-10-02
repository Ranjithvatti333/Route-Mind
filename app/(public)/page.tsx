import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { NetworkOverview } from "@/components/home/NetworkOverview";
import {
  HowItWorks,
  IntelligentFeatures,
  CrowdPreview,
  WeatherIntelligence,
  EventIntelligence,
  AllocationPreview,
  FinalCta,
} from "@/components/home/HomeSections";
import { WhatIfPreview } from "@/components/home/WhatIfPreview";
import { MapSection } from "@/components/home/MapSection";

export const metadata: Metadata = {
  title: "Route Mind — Understand Demand. Predict Crowds. Move Smarter.",
  description:
    "AI-powered public transport intelligence for Hyderabad — demand analytics, crowd prediction, weather and event impact, and smarter bus allocation.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <NetworkOverview />
      <HowItWorks />
      <IntelligentFeatures />
      <CrowdPreview />
      <WeatherIntelligence />
      <EventIntelligence />
      <AllocationPreview />
      <section className="bg-white pb-16 sm:pb-20" aria-labelledby="whatif-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">What-if simulation</p>
            <h2 id="whatif-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Test tomorrow&rsquo;s scenario today
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
              Adjust the conditions and preview the impact on demand, crowding, waiting time and
              fleet requirements.
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <WhatIfPreview />
          </div>
        </div>
      </section>
      <MapSection />
      <FinalCta />
    </>
  );
}
