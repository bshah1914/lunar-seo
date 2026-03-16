import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Send,
  Plus,
  MessageSquare,
  Sparkles,
  Search,
  BarChart3,
  Target,
  Lightbulb,
  TrendingUp,
  Megaphone,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";

// ---------- Types ----------
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

// ---------- Mock data ----------
const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content:
      "Hello! I'm your AI Marketing Assistant. I can help you with SEO strategy, content ideas, competitor analysis, campaign planning, and more. What would you like to work on?",
    timestamp: "10:00 AM",
  },
  {
    id: "m2",
    role: "user",
    content:
      "What are the best SEO strategies for improving our rankings for 'digital marketing tools'?",
    timestamp: "10:02 AM",
  },
  {
    id: "m3",
    role: "assistant",
    content: `Great question! Here are the **top SEO strategies** to improve your rankings for "digital marketing tools":

### 1. Content Optimization
- Create a comprehensive **pillar page** covering digital marketing tools in depth (3,000+ words)
- Build **topic clusters** around related long-tail keywords like "best digital marketing tools for small business", "free digital marketing tools 2026", and "digital marketing tools comparison"
- Ensure your content has **clear E-E-A-T signals** (Experience, Expertise, Authoritativeness, Trustworthiness)

### 2. Technical SEO Improvements
- Optimize **Core Web Vitals** — aim for LCP under 2.5s and CLS under 0.1
- Implement proper **schema markup** (SoftwareApplication, Review, FAQ) on tool-related pages
- Ensure mobile-first indexing readiness with responsive design

### 3. Backlink Strategy
- Target **guest posts** on high-DA marketing publications (HubSpot, Moz, Search Engine Journal)
- Create **link-worthy assets** like original research, infographics, or free tools
- Pursue **broken link building** on competitor resource pages

### 4. On-Page Optimization
- Optimize title tags: *"Best Digital Marketing Tools [2026] - Reviews & Comparisons"*
- Use semantic variations naturally in headers and body copy
- Add **FAQ sections** targeting People Also Ask queries

### 5. User Experience & Engagement
- Improve **dwell time** with interactive elements (comparison tables, filters)
- Add video content reviewing or demonstrating tools
- Implement **internal linking** from high-authority pages to your target content

Would you like me to dive deeper into any of these strategies or create a specific action plan?`,
    timestamp: "10:02 AM",
  },
  {
    id: "m4",
    role: "user",
    content: "Can you create a content calendar for the next month focused on these topics?",
    timestamp: "10:05 AM",
  },
  {
    id: "m5",
    role: "assistant",
    content: `Absolutely! Here's a **content calendar** for the next 4 weeks targeting "digital marketing tools" and related keywords:

---

### Week 1: Foundation Content
| Day | Content Type | Topic | Target Keyword |
|-----|-------------|-------|----------------|
| Mon | Blog Post | "15 Best Digital Marketing Tools in 2026" | digital marketing tools |
| Wed | Comparison | "HubSpot vs Semrush: Complete Comparison" | marketing tool comparison |
| Fri | Listicle | "7 Free Digital Marketing Tools for Startups" | free digital marketing tools |

### Week 2: Deep Dives
| Day | Content Type | Topic | Target Keyword |
|-----|-------------|-------|----------------|
| Mon | Guide | "How to Build a Marketing Tech Stack" | marketing tech stack |
| Wed | Review | "Semrush Review 2026: Is It Worth It?" | semrush review |
| Fri | Tutorial | "Setting Up Marketing Automation in 30 Min" | marketing automation setup |

### Week 3: Thought Leadership
| Day | Content Type | Topic | Target Keyword |
|-----|-------------|-------|----------------|
| Mon | Original Research | "State of Marketing Tools: Survey Results" | marketing tools report |
| Wed | Expert Roundup | "Top Marketers Share Their Favorite Tools" | best marketing tools |
| Fri | Infographic | "Digital Marketing Tools Ecosystem Map" | digital marketing ecosystem |

### Week 4: Conversion Content
| Day | Content Type | Topic | Target Keyword |
|-----|-------------|-------|----------------|
| Mon | Case Study | "How We Increased Traffic 200% Using These Tools" | marketing tools results |
| Wed | Buyer's Guide | "Digital Marketing Tools Buyer's Guide" | choose marketing tools |
| Fri | Webinar Recap | "Live Demo: Top 5 Tools in Action" | marketing tools demo |

---

**Key metrics to track:** Organic impressions, keyword ranking changes, click-through rates, and time on page for each piece.

Want me to help draft any of these content pieces or suggest specific distribution strategies?`,
    timestamp: "10:05 AM",
  },
];

const recentConversations: Conversation[] = [
  {
    id: "c1",
    title: "SEO Strategy for Digital Marketing Tools",
    timestamp: "Today",
    messages: initialMessages,
  },
  {
    id: "c2",
    title: "Competitor Analysis: MarketPro vs TechCorp",
    timestamp: "Yesterday",
    messages: [],
  },
  {
    id: "c3",
    title: "Google Ads Budget Optimization",
    timestamp: "Mar 14",
    messages: [],
  },
  {
    id: "c4",
    title: "Content Ideas for Q2 Campaign",
    timestamp: "Mar 12",
    messages: [],
  },
  {
    id: "c5",
    title: "Backlink Outreach Strategy",
    timestamp: "Mar 10",
    messages: [],
  },
  {
    id: "c6",
    title: "Social Media Content Plan",
    timestamp: "Mar 8",
    messages: [],
  },
];

const quickSuggestions = [
  { label: "Analyze my website SEO", icon: <Search className="h-4 w-4" /> },
  { label: "Generate content ideas", icon: <Lightbulb className="h-4 w-4" /> },
  { label: "Compare competitors", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Plan a campaign", icon: <Megaphone className="h-4 w-4" /> },
  { label: "Keyword opportunities", icon: <TrendingUp className="h-4 w-4" /> },
  { label: "Improve my ad performance", icon: <Target className="h-4 w-4" /> },
];

// ---------- Component ----------
const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeConversation, setActiveConversation] = useState("c1");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        role: "assistant",
        content:
          "That's a great question! Let me analyze the data and provide you with actionable insights. Based on your current performance metrics and industry benchmarks, I'd recommend focusing on the following areas...\n\nI'll need a moment to pull the latest data from your connected accounts to give you the most accurate recommendations.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (label: string) => {
    setInput(label);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left sidebar */}
      <div className="hidden w-64 shrink-0 flex-col border-r bg-gray-50/50 md:flex">
        <div className="p-3">
          <Button className="w-full justify-start" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1 px-2 py-2">
          <p className="mb-2 px-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Recent Conversations
          </p>
          <div className="space-y-1">
            {recentConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-100 ${
                  activeConversation === conv.id
                    ? "bg-gray-100 border border-gray-200"
                    : ""
                }`}
              >
                <div className="flex w-full items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="truncate text-sm font-medium text-gray-700">
                    {conv.title}
                  </span>
                </div>
                <span className="mt-0.5 pl-5.5 text-xs text-gray-400">{conv.timestamp}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">AI Marketing Assistant</h2>
            <p className="text-xs text-gray-500">Powered by advanced AI &middot; Always learning</p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                      : "bg-gray-700"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-white" />
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-td:text-gray-700 prose-th:text-gray-700 prose-th:font-semibold">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                  <p
                    className={`mt-1.5 text-[10px] ${
                      msg.role === "user" ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-gray-100 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick suggestions */}
        <div className="border-t bg-gray-50/50 px-4 py-3">
          <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
            {quickSuggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSuggestionClick(s.label)}
                className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="border-t bg-white px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2">
              {/* Client context selector */}
              <Select>
                <SelectTrigger className="w-36 shrink-0">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="techcorp">TechCorp</SelectItem>
                  <SelectItem value="marketpro">MarketPro</SelectItem>
                  <SelectItem value="growthco">GrowthCo</SelectItem>
                  <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                </SelectContent>
              </Select>

              {/* Textarea */}
              <div className="relative flex-1">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about marketing..."
                  className="min-h-[44px] max-h-32 resize-none pr-12"
                  rows={1}
                />
                <Button
                  size="sm"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute bottom-1.5 right-1.5 h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-gray-400">
              AI responses are generated based on your account data and marketing best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
