"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import { config } from "@/lib/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SentimentalAnalysis = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("LLama 3.3 Meta");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
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
      const response = await axios.post(`${config.backendUrl}/analyze_sentiment`, {
        text_input: input,
        model_choice: model,
      });
      setAnalysis(response.data.sentiment);
    } catch (err) {
      console.error(err);
      setAnalysis("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearInput = () => {
    setInput("");
    setAnalysis(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col items-center justify-center p-6">
            <Card className="w-full max-w-3xl p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Input your text</h2>
                <p className="text-sm text-muted-foreground">
                  Paste your text and choose a model to analyze its sentiment.
                </p>
              </div>

              {/* Model selection */}
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

              {/* Text input */}
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

              {/* Submit button */}
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
                  "Analyze Sentiment"
                )}
              </Button>

              {/* Sentiment result */}
              {analysis && (
                <div className="text-center mt-4">
                  <p
                    className={`text-lg font-semibold ${
                      analysis.toLowerCase().includes("positive")
                        ? "text-green-600"
                        : analysis.toLowerCase().includes("negative")
                        ? "text-red-600"
                        : "text-yellow-500"
                    }`}
                  >
                    Sentiment: {analysis}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={clearInput}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentalAnalysis;