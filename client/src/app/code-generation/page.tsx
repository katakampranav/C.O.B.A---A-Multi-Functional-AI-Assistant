"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Clock, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Loading } from "@/components/loading";
import ReactMarkdown from "react-markdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { config } from "@/lib/config";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "C++", label: "C++" },
  { value: "java", label: "Java" }
];

export default function TextChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("LLama 3.3 Meta");
  const [language, setLanguage] = useState("Python");
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingLanguage, setAwaitingLanguage] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && scrollAreaViewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaViewportRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;

      if (isNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content:
            "👋 Hello! I'm C.O.B.A — your intelligent code generation assistant. Just paste or type your text, and I'll help you analyze and generate code effortlessly.",
          role: "assistant",
        },
      ]);
    }
  }, []);

  const analyzeText = async (text: string, language: string) => {
    try {
      const response = await axios.post(`${config.backendUrl}/generate-code`, {
        text,
        model_choice: model,
        language,
      });
      return response.data.code;
    } catch (error) {
      console.error("Error generating code:", error);
      return "Sorry, I couldn't analyze that text. Please try again.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setPendingQuestion(input);
    setInput("");
    setAwaitingLanguage(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const promptLanguage: Message = {
      id: (Date.now() + 1).toString(),
      content: "🧠 Please select your preferred programming language:",
      role: "assistant",
    };
    setMessages((prev) => [...prev, promptLanguage]);
  };

  const handleLanguageSelect = async (value: string) => {
    setLanguage(value);
    setIsLoading(true);
    setAwaitingLanguage(false);

    try {
      const aiResponse = await analyzeText(pendingQuestion, value);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: aiResponse,
          role: "assistant",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Sorry, something went wrong. Please try again.",
          role: "assistant",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const containsCode = (text: string) => {
    return text.includes('```');
  };

  const CopyButton = ({ text, show }: { text: string, show: boolean }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

    if (!show) return null;

    return (
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 rounded hover:bg-muted/50 transition"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-3 h-3 text-green-500" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] bg-background">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Model Selection */}
        <div className="p-4 border-b bg-background">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <label className="text-sm font-medium">Model:</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Choose Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LLama 3.3 Meta">LLama 3.3 Meta</SelectItem>
                <SelectItem value="Google Gemini">Google Gemini</SelectItem>
                <SelectItem value="Deepseek">Deepseek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 overflow-hidden">
          <div ref={scrollAreaViewportRef} className="h-full w-full px-4">
            <div className="max-w-3xl mx-auto py-6 space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "group flex gap-3",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mt-1">
                        <Bot className="h-5 w-5" />
                      </Avatar>
                    )}
                    <div className="flex flex-col gap-2 max-w-[80%] relative">
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2 shadow-sm relative",
                          message.role === "assistant"
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        )}
                      >
                        <CopyButton 
                          text={message.content} 
                          show={containsCode(message.content)} 
                        />
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                        {message.id === (messages[messages.length - 1]?.id) && 
                         message.role === "assistant" && 
                         awaitingLanguage && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {languages.map((lang) => (
                              <Button
                                key={lang.value}
                                variant="outline"
                                size="sm"
                                className="rounded-full px-4 py-1 text-sm"
                                onClick={() => handleLanguageSelect(lang.value)}
                              >
                                {lang.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 mt-1 bg-primary text-primary-foreground flex justify-center items-center">
                        <User className="h-5 w-5" />
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              <AnimatePresence>{isLoading && <Loading />}</AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <Textarea
                  ref={textareaRef}
                  placeholder="Enter text to analyze..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[56px] max-h-[200px] pr-12 resize-none"
                />
              </div>
              <Button
                size="icon"
                className="h-[56px] w-[56px] rounded-full"
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading || awaitingLanguage}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Processing may take a few seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}