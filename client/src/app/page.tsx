import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { CarouselComp } from "@/components/carousel-comp";
import { ModelSection } from "@/components/model-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <main className="flex-1 w-full">
        {/* Main container with centered content and consistent padding */}
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <FeaturesSection />
          
          {/* Carousel section with improved spacing */}
          <section id="carousel" className="py-16 bg-background w-full">
            <div className="mx-auto px-4 md:px-6 max-w-7xl">
              <div  className="flex flex-col items-center text-center space-y-4 mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Explore Our Capabilities
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See C.O.B.A in action with these interactive examples
                </p>
              </div>
              <CarouselComp />
            </div>
          </section>

          <ModelSection />
        </div>
      </main>
      <Footer />
    </div>


  );
}