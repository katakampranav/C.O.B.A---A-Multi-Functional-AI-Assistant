import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <p className="text-sm text-muted-foreground">
              Comprehensive Omni-functional Bot for Assistance
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="font-medium">Features</h3>
            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/summarization"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Text Summarization
              </Link>
              <Link
                href="/ner"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Named Entity Recognition
              </Link>
              <Link
                href="/sentiment"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Sentiment Analysis
              </Link>
              <Link
                href="/code"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Code Generation
              </Link>
              <Link
                href="/chat"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Q&A Chatbot
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} C.O.B.A - Comprehensive Omni-functional
            Bot for Assistance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
