"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Loader2, Download } from "lucide-react";
import { config } from "@/lib/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NameEntityRecognition() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("LLama 3.3 Meta");
  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState<Record<string, string[]> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${config.backendUrl}/extract_entities`, {
        text: input,
        model_choice: model,
      });

      const parsedEntities = parseEntities(response.data.entities);
      setEntities(parsedEntities);
    } catch (error) {
      console.error("NER Error:", error);
      setEntities(null);
    } finally {
      setIsLoading(false);
    }
  };

  const parseEntities = (raw: string): Record<string, string[]> => {
    const lines = raw.split("\n").filter(Boolean);
    const result: Record<string, string[]> = {};
    let currentType = "";

    for (const line of lines) {
      if (line.endsWith(":")) {
        currentType = line.replace(":", "").trim();
        result[currentType] = [];
      } else if (line.startsWith('"') && line.endsWith('"') && currentType) {
        result[currentType].push(line.replace(/"/g, ""));
      }
    }

    return result;
  };

  const clearInputs = () => {
    setInput("");
    setEntities(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {!entities ? (
          <div className="h-full flex flex-col items-center justify-center p-6">
            <Card className="w-full max-w-3xl p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Named Entity Recognition</h2>
                <p className="text-sm text-muted-foreground">
                  Paste your text below to extract named entities.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Model</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LLama 3.3 Meta">LLama 3.3 Meta</SelectItem>
                    <SelectItem value="Google Gemini">Google Gemini</SelectItem>
                    <SelectItem value="Deepseek">Deepseek</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Text Input</label>
                  <Textarea
                    ref={textareaRef}
                    placeholder="Paste your text here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Extract Entities"
                  )}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="h-full p-6 overflow-auto">
            <div className="max-w-4xl mx-auto h-full flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Named Entities</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearInputs}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    New Input
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {Object.entries(entities).map(([type, values]) => (
                <Card key={type} className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{type}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {values.map((value, idx) => (
                      <li key={idx} className="text-muted-foreground">"{value}"</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
