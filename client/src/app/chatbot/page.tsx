"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Send,
  FileUp,
  Bot,
  User,
  X,
  FileText,
  Loader2,
  MessageSquare,
  FileInput,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Loading } from "@/components/loading";
import { config } from "@/lib/config";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
};

type Mode = "selection" | "qa" | "document";

function FileUploadBox({ onFileUpload }: { onFileUpload: (file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }
    onFileUpload(file);
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 hover:border-muted-foreground/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
        <FileInput className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Upload Document</h3>
      <p className="text-muted-foreground mb-6">
        Drag and drop your file here, or click to browse
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
      </p>
      <Button variant="outline">
        <FileUp className="h-4 w-4 mr-2" />
        Select File
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
    </div>
  );
}

export default function Summarization() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<Mode>("selection");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && scrollAreaViewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaViewportRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      
      if (isNearBottom) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
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

  const analyzeText = async (text: string) => {
    try {
      const response = await axios.post(`${config.backendUrl}/generate-answer`, { 
        text,
      });
      return response.data.answer;
    } catch (error) {
      console.error("Error analyzing text:", error);
      return "Sorry, I couldn't analyze that text. Please try again.";
    }
  };

  const analyzeDocument = async (uploaded_file: File, query: string) => {
    const formData = new FormData();
    formData.append("file", uploaded_file);
    formData.append("query", query);
    formData.append("model", "LLama 3.3 Meta");
  
    try {
      const response = await axios.post(
        `${config.backendUrl}/answer-query-from-document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.answer;
    } catch (error) {
      console.error("Error analyzing document:", error);
      return "Sorry, I couldn't analyze that document. Please try again.";
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
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      let analysisResult: string;
      
      if (mode === "document" && uploadedFile) {
        analysisResult = await analyzeDocument(uploadedFile, input);
      } else {
        analysisResult = await analyzeText(input);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: analysisResult,
        role: "assistant",
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, something went wrong. Please try again.",
        role: "assistant",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setMessages([
      {
        id: "welcome",
        content: `Document "${file.name}" uploaded successfully. Ask me anything about this document.`,
        role: "assistant",
        attachments: [
          {
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
          },
        ],
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setMode("selection");
    setMessages([]);
  };

  const startQAChat = () => {
    setMode("qa");
    setMessages([
      {
        id: "welcome",
        content: "👋 Hello! I'm your QA assistant. Ask me anything!",
        role: "assistant",
      },
    ]);
  };

  const startDocumentUpload = () => {
    setMode("document");
    setMessages([]);
  };

  const resetChat = () => {
    setMode("selection");
    setMessages([]);
    setUploadedFile(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] bg-background">
      {mode === "selection" ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-xl border p-6 flex flex-col items-center text-center cursor-pointer hover:bg-accent transition-colors"
              onClick={startQAChat}
            >
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">QA Chatbot</h3>
              <p className="text-muted-foreground">
                Ask general questions and get answers from our AI assistant
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-card rounded-xl border p-6 flex flex-col items-center text-center cursor-pointer hover:bg-accent transition-colors"
              onClick={startDocumentUpload}
            >
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FileInput className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Document-based QA</h3>
              <p className="text-muted-foreground">
                Upload a document and ask questions about its content
              </p>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {mode === "document" && !uploadedFile && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center p-4">
              <FileUploadBox onFileUpload={handleFileUpload} />
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {mode === "qa" ? "QA Chatbot" : "Document-based QA"}
              </h2>
              <Button variant="ghost" onClick={resetChat}>
                New Chat
              </Button>
            </div>

            <ScrollArea className="flex-1 overflow-hidden">
              <div 
                ref={scrollAreaViewportRef}
                className="h-full w-full px-4"
              >
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

                        <div className="flex flex-col gap-2 max-w-[80%]">
                          <div
                            className={cn(
                              "rounded-2xl px-4 py-2 shadow-sm",
                              message.role === "assistant"
                                ? "bg-muted"
                                : "bg-primary text-primary-foreground"
                            )}
                          >
                            {message.attachments?.map((attachment, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "flex items-center gap-2 p-2 rounded-lg mb-2",
                                  message.role === "assistant"
                                    ? "bg-background"
                                    : "bg-primary-foreground/10"
                                )}
                              >
                                <FileText className="h-4 w-4 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs opacity-70">
                                    {attachment.size}
                                  </p>
                                </div>
                                {message.role === "assistant" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full"
                                    onClick={removeUploadedFile}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                            <div className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </div>
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

                  {/* Loading indicator */}
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
                      placeholder={
                        mode === "document" && !uploadedFile
                          ? "Upload a document first"
                          : "Type your message..."
                      }
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-[56px] max-h-[200px] pr-12 resize-none"
                      disabled={mode === "document" && !uploadedFile}
                    />
                  </div>

                  <Button
                    size="icon"
                    className="h-[56px] w-[56px] rounded-full"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading || (mode === "document" && !uploadedFile)}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center text-xs text-muted-foreground">
                  {mode === "document" ? (
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>Supports PDF, DOC, TXT (Max 10MB)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>Ask any question and get answers</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
}