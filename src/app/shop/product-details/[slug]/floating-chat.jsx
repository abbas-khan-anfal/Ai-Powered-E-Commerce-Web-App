"use client";

import { Bot, Loader, SendHorizonal, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import useAiAssistant from "@/hooks/ai-assistant/useAiAssistant";
import { useEffect, useRef, useState } from "react";

// MARKDOWN PACKAGES
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function ChatSheet({ product }) {
  const { data : session, status } = useSession();
  const { askAiAssistantHandler } = useAiAssistant();
  const [chats, setChats] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollToBottomRef = useRef(null);
  const [chatsLoading, setChatsLoading] = useState(false);

  // console.log("Product in floating sheet : ", product);

  const askAiHandler = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;
    // push two message in chats
    setChats((prev) => [
      ...prev,
      { role: "user", content: userInput },
      { role: "assistant", content: "" },
    ]);

    const context = `Product Name: ${product.name}, Product Price: ${product.price}, Product Discounted Price: ${product.discountPrice}, Product Description: ${product.description?.toString()?.substring(0, 90)}, Product Reviews Count: ${product.reviews.length}, Product Reviews and Rating: ${product.reviews.map((review, i) => `${i + 1}- Rating: ${review.rating}, Review: ${review.review}`).join("; ")}.`;

    // chat history context from last five messages
    let chatHistory = "";
    if (chats.length > 0) {
      chatHistory = chats.slice(-5).map((chat, ind) => `${ind+1} - ${chat.role}: ${chat.content?.toString().substring(0, 100)}+"."`).join("\n");
    }
    const userData = { question: userInput, context, chatHistory };

    setUserInput("");
    setIsLoading(true);
    const reader = await askAiAssistantHandler(userData);
    const decoder = new TextDecoder();

    let aiText = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      aiText += decoder.decode(value);
      // update last message in chats
      setChats((prev) => {
        const newChats = [...prev];
        newChats[newChats.length - 1].content = aiText;
        return newChats;
      });
    }

    setIsLoading(false);
  };

  // get chats
  const getAllChatsHandler = async (userId) => {
    if(!userId || userId?.toString().trim() == "") return;
    setChatsLoading(true);
    try
    {
      const res = await axios.get(`/api/ai-assistant/get-chats/${userId}`);
      if(res?.data?.success)
      {
        setChats(res.data.chats);
      }
    }
    catch(error)
    {
      console.log(error);
    }
    finally
    {
      setChatsLoading(false);
    }
  };

  // get chats
  useEffect(() => {
    if(session)
    {
      getAllChatsHandler(session?.user?.id?.toString());
    }
  }, [session])

  const scrollToBottom = () => {
    scrollToBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  useEffect(() => {
    if (chats.length === 0) {
      setChats([
        {
          role: "assistant",
          content:
            "Hi! I am your AI assistant. How can I help you with this product?",
        },
      ]);
    }
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="group relative w-full overflow-hidden rounded-lg py-5 text-white">
          <span className="absolute inset-0 animate-[gradient_4s_linear_infinite] bg-[linear-gradient(90deg,#4285F4,#7C3AED,#EC4899,#F59E0B,#4285F4)] bg-[length:300%_100%]" />

          <span className="relative flex items-center justify-center gap-2 font-medium">
            <Bot size={20} />
            Get AI Insights
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[350px] p-0 flex flex-col">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <Bot size={18} />
            AI Assistant
          </SheetTitle>
        </SheetHeader>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {
            chatsLoading
            ?
            (
              <div>
                <Loader className="animate-spin size-5" />
              </div>
            )
            :
            (
              chats &&
            chats.length > 0 &&
            chats.map((currChat, ind) =>
              currChat?.role == "user" ? (
                <div key={ind+1} className={`flex justify-end`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm rounded-br-md bg-primary text-primary-foreground`}
                  >
                    {currChat.content}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="bg-muted text-xs mb-1 font-bold rounded-full h-[25px] w-[25px] flex justify-center items-center border">
                    <Bot size={17} />
                  </span>

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-4 leading-7">
                            {children}
                          </p>
                        ),

                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold mb-4">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold mb-3 mt-6">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="text-lg font-semibold mb-2 mt-5">
                            {children}
                          </h3>
                        ),

                        ul: ({ children }) => (
                          <ul className="list-disc pl-6 mb-4 space-y-2">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="list-decimal pl-6 mb-4 space-y-2">
                            {children}
                          </ol>
                        ),

                        li: ({ children }) => (
                          <li className="leading-7">
                            {children}
                          </li>
                        ),

                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {children}
                          </a>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-semibold">
                            {children}
                          </strong>
                        ),

                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 pl-4 my-4 italic text-muted-foreground">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {currChat?.content}
                    </ReactMarkdown>
                  </div>

                </div>
              ),
            )
            )
          }
          <div ref={scrollToBottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={askAiHandler} className="border-t p-3 flex gap-2">
          <Input
            placeholder="Type your question..."
            value={userInput}
            disabled={isLoading}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button type="submit" disabled={isLoading} className="disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? <Square /> : <SendHorizonal />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
