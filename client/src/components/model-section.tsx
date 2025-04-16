import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Cpu, Layers, Zap } from "lucide-react"

const models = [
  {
    icon: <Brain className="h-8 w-8 text-primary" />,
    title: "Gemini",
    description: "Google's advanced multimodal model with strong reasoning capabilities.",
    tags: ["Text", "Images", "Code"],
  },
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: "DeepSeek",
    description: "Specialized model with excellent code generation and technical understanding.",
    tags: ["Code", "Technical", "Documentation"],
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "LLaMA",
    description: "Open-source large language model with broad capabilities and customization options.",
    tags: ["General", "Customizable", "Open-source"],
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: "Hugging Face Models",
    description: "Access to a wide range of specialized models for specific NLP tasks.",
    tags: ["NER", "Sentiment", "Classification"],
  },
]

export function ModelSection() {
  return (
    <section className="py-16">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Supported AI Models</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Switch between different models to optimize for your specific use case
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model, index) => (
            <Card
              key={index}
              className="border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:shadow-md transition-all"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                {model.icon}
                <div>
                  <CardTitle>{model.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">{model.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

