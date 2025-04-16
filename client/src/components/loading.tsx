import { Bot } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { motion } from "framer-motion";

export const Loading =() =>{
    return(
        <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <Bot className="h-5 w-5" />
                  </Avatar>
                  <div className="rounded-2xl bg-muted px-4 py-2 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        <motion.span
                          className="block h-2 w-2 rounded-full bg-primary"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        />
                        <motion.span
                          className="block h-2 w-2 rounded-full bg-primary"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                        />
                        <motion.span
                          className="block h-2 w-2 rounded-full bg-primary"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                        />
                      </div>
                      <span className="text-sm">Analyzing content...</span>
                    </div>
                  </div>
                </motion.div>
    )
}