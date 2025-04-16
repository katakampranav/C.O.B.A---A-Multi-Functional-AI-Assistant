import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Bot } from "lucide-react";
import { Logo } from "./logo";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden py-20 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-small-primary/[0.05] -z-10" />
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="mr-1 h-4 w-4" />
            <span>Powered by Advanced AI Models</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <Logo />
          </div>

          <p className="text-xl font-medium text-primary">
            Comprehensive Omni-functional Bot for Assistance
          </p>

          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Your all-in-one AI solution for text summarization, sentiment
            analysis, named entity recognition, question answering, and code
            generation.
          </p>

          <Button asChild variant="default" size="lg" className="group">
            <Link href="#carousel" className="flex items-center gap-2">
              Explore Features
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
