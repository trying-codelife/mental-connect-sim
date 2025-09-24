// ===== ChatbotIntegration.tsx =====
import React, { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Clock, Shield, Zap } from "lucide-react";

// Chatbot component types
interface ChatMessage {
  role: "user" | "model";
  text: string;
  isError?: boolean;
  hideInChat?: boolean;
}

interface ApiRequestMessage {
  role: string;
  parts: { text: string }[];
}

interface ApiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
  error?: {
    message: string;
  };
}

// Chatbot Icon Component
const ChatbotIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 1024 1024"
      className="flex-shrink-0"
    >
      <path
        fill="currentColor"
        d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5-53.5z"
      />
    </svg>
  );
};

// Chat Form Component
interface ChatFormProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  generateBotResponse: (history: ChatMessage[]) => Promise<void>;
}

const ChatForm: React.FC<ChatFormProps> = ({
  chatHistory,
  setChatHistory,
  generateBotResponse,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    setTimeout(() => {
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "Thinking..." },
      ]);
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `As a mental health support assistant, please provide helpful guidance for: ${userMessage}`,
        },
      ]);
    }, 600);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex gap-2 p-4 border-t bg-background"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask about mental health, stress, anxiety..."
        className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        required
      />
      <Button type="submit" size="sm" className="px-4">
        Send
      </Button>
    </form>
  );
};

// Chat Message Component
interface ChatMessageProps {
  chat: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ chat }) => {
  if (chat.hideInChat) return null;

  return (
    <div
      className={`flex gap-3 p-4 ${chat.role === "user" ? "justify-end" : ""}`}
    >
      {chat.role === "model" && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <ChatbotIcon />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          chat.role === "user"
            ? "bg-primary text-primary-foreground ml-auto"
            : `bg-muted ${
                chat.isError ? "border border-destructive text-destructive" : ""
              }`
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{chat.text}</p>
      </div>
    </div>
  );
};

// Main Integrated Component
const ChatbotIntegration: React.FC = () => {
  // Chatbot state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      hideInChat: true,
      role: "model",
      text: "You are a supportive mental health assistant for students. Provide compassionate, helpful guidance while encouraging professional help when needed.",
    },
  ]);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Quick topic handler
  const handleQuickTopic = (topic: string) => {
    setChatHistory((history) => [...history, { role: "user", text: topic }]);

    setTimeout(() => {
      setChatHistory((history) => [
        ...history,
        { role: "model", text: "Thinking..." },
      ]);
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          text: `As a mental health support assistant, please provide helpful guidance for: ${topic}`,
        },
      ]);
    }, 600);
  };

  // API Integration
  const generateBotResponse = async (history: ChatMessage[]): Promise<void> => {
    const updateHistory = (text: string, isError: boolean = false): void => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    // Check if API URL is configured
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      updateHistory(
        "API URL not configured. Please set VITE_API_URL in your environment variables.",
        true
      );
      return;
    }

    const formattedHistory: ApiRequestMessage[] = history.map(
      ({ role, text }) => ({
        role,
        parts: [{ text }],
      })
    );

    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      console.log("Making API request to:", apiUrl);
      console.log("Request payload:", { contents: formattedHistory });

      const response = await fetch(apiUrl, requestOptions);

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.log("Non-JSON response:", textResponse);
        throw new Error(
          `Expected JSON response but got: ${contentType}. Response: ${textResponse.substring(
            0,
            200
          )}...`
        );
      }

      const data: ApiResponse = await response.json();
      console.log("Parsed response:", data);

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Validate response structure
      if (
        !data.candidates ||
        !data.candidates[0] ||
        !data.candidates[0].content ||
        !data.candidates[0].content.parts ||
        !data.candidates[0].content.parts[0]
      ) {
        throw new Error("Invalid API response structure");
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.error("API Error:", error);
      let errorMessage =
        "I'm having trouble connecting right now. Please try again or contact campus support if urgent.";

      if (error instanceof Error) {
        if (error.message.includes("JSON")) {
          errorMessage =
            "The API returned an invalid response. Please check your API configuration.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Unable to connect to the API. Please check your internet connection and API URL.";
        } else if (
          error.message.includes("overloaded") ||
          error.message.includes("busy")
        ) {
          errorMessage =
            "The AI is currently experiencing high demand. Please wait a moment and try again. 🤖";
        } else {
          errorMessage = error.message;
        }
      }

      updateHistory(errorMessage, true);
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          AI Support Assistant
        </h1>
        <p className="text-muted-foreground">
          Get immediate support and guidance from our AI-powered mental health
          assistant
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 bg-gradient-primary text-primary-foreground">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">24/7 Available</h3>
            <p className="text-sm opacity-90">
              Always here when you need support
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-success text-success-foreground">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Private & Secure</h3>
            <p className="text-sm opacity-90">
              Your conversations are confidential
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-calm text-foreground">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Instant Response</h3>
            <p className="text-sm opacity-70">
              Get immediate guidance and support
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Integrated Chatbot */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>AI Wellness Assistant</span>
          </CardTitle>
          <CardDescription>
            Start a conversation with our AI assistant for personalized mental
            health support
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px] flex flex-col">
            {/* Chat Area */}
            <div ref={chatBodyRef} className="flex-1 overflow-y-auto">
              {/* Welcome Message */}
              <div className="flex gap-3 p-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ChatbotIcon />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                  <p className="text-sm">
                    Hey there 👋
                    <br />
                    I'm here to support your mental health and wellbeing. Feel
                    free to share what's on your mind, or click one of the
                    common topics below to get started.
                  </p>
                </div>
              </div>

              {/* Chat History */}
              {chatHistory.map((chat, index) => (
                <ChatMessageComponent key={index} chat={chat} />
              ))}
            </div>

            {/* Chat Input */}
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Emergency Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Common Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              size="sm"
              onClick={() =>
                handleQuickTopic("I'm feeling anxious about exams")
              }
            >
              "I'm feeling anxious about exams"
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              size="sm"
              onClick={() => handleQuickTopic("Help me with study stress")}
            >
              "Help me with study stress"
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              size="sm"
              onClick={() => handleQuickTopic("I'm having trouble sleeping")}
            >
              "I'm having trouble sleeping"
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              size="sm"
              onClick={() => handleQuickTopic("Feeling overwhelmed lately")}
            >
              "Feeling overwhelmed lately"
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Emergency Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-semibold text-destructive">
                Crisis Support
              </p>
              <p className="text-xs text-muted-foreground">
                If you're in crisis, call 988 (Suicide & Crisis Lifeline)
              </p>
            </div>
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm font-semibold text-warning">
                Campus Emergency
              </p>
              <p className="text-xs text-muted-foreground">
                24/7 Campus Safety: (555) 123-4567
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotIntegration;
