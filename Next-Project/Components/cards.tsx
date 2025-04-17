"use client";

import React from "react";
import { Carousel, Card } from "@/Components/ui/apple-cards-carousel";
import Image from "next/image";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-[100%] px-30 bg-gray-900">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans flex justify-center items-center">
        Key Features
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Healthcare AI",
    title: "Search Medicine Details Instantly",
    src: "https://images.unsplash.com/photo-1735399976112-17508533c97a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNlYXJjaCUyMGZlYXR1cmV8ZW58MHwxfDB8fHww",
    content: <DummyContent />,
  },
  {
    category: "AI Chatbot",
    title: "Talk to Your Medical Assistant",
    src: "https://plus.unsplash.com/premium_photo-1702599103376-23b8b22a1f27?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGFsayUyMHRvJTIwZG9jdG9yfGVufDB8MXwwfHx8MA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Trusted Sources",
    title: "Backed by Verified NHS Information",
    src: "https://images.unsplash.com/photo-1587500154541-1cafd74f0efc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },

  {
    category: "24/7 Availability",
    title: "Medical Info On Demand",
    src: "https://images.unsplash.com/photo-1603091451761-28fc9da09387?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8MjQlMkY3JTIwbWVkaWNhbCUyMHN0b3JlfGVufDB8MXwwfHx8MA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Personalization",
    title: "Tailored Suggestions for You",
    src: "https://plus.unsplash.com/premium_photo-1682023585957-f191203ab239?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyc29uYWxpc2F0aW9ufGVufDB8MXwwfHx8MA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "User-Friendly",
    title: "Easy to Use, Safe to Trust",
    src: "https://plus.unsplash.com/premium_photo-1681490461418-7eb9f5675339?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dXNlciUyMGZyaWVuZGx5fGVufDB8MXwwfHx8MA%3D%3D",
    content: <DummyContent />,
  },
];
