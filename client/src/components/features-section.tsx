import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Code, PieChart, Search } from "lucide-react"

const features = [
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "Text Summarization",
    description: "Generate concise summaries of long texts or uploaded documents with advanced AI models.",
  },
  {
    icon: <PieChart className="h-10 w-10 text-primary" />,
    title: "Sentiment Analysis",
    description: "Determine the sentiment of a given text as positive, negative, or neutral with high accuracy.",
  },
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Named Entity Recognition",
    description: "Extract key entities from text including people, organizations, locations, and more.",
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Question Answering",
    description: "Get AI-generated answers or retrieve information from documents using RAG-based search.",
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: "Code Generation",
    description: "Generate code snippets and receive programming assistance across multiple languages.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-muted/50">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful AI Features</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Explore the capabilities of C.O.B.A
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:shadow-md transition-all"
            >
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

