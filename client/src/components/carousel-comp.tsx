"use client";

import Carousel from "@/components/ui/carousel";
export function CarouselComp() {
  const slideData = [
    {
      title: "Summarization",
      button: "Explore",
      src: "/assets/summarization.png",
      path: "/summarization"
    },
    {
      title: "Name Entity Recognition",
      button: "Explore",
      src: "/assets/name-entity-recognition.png",
      path: "/name-entity-recognition"
    },
    {
      title: "Sentimental Analysis",
      button: "Explore",
      src: "/assets/sentimental-analysis.png",
      path: "/sentimental-analysis"
    },
    {
      title: "Code generation",
      button: "Explore",
      src: "/assets/code-generation.png",
      path: "/code-generation"
    },
    {
      title: "Q & A Chatbot",
      button: "Explore",
      src: "/assets/chatbot.png",
      path: "/chatbot"
    },
  ];

  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      <Carousel slides={slideData} />
    </div>
  );
}