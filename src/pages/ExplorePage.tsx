import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Send, Search, ChevronLeft, Bookmark } from "lucide-react";
import storyThumb1 from "@/assets/story-thumb-1.jpg";
import storyThumb2 from "@/assets/story-thumb-2.jpg";
import storyThumb3 from "@/assets/story-thumb-3.jpg";
import storyThumb4 from "@/assets/story-thumb-4.jpg";

const feedItems = [
  {
    id: 1,
    user: { name: "Michael Turner", username: "@Michael-Official", avatar: "MT", verified: true },
    image: storyThumb1,
    likes: 7500,
    comments: 350,
    shares: 120,
    tags: ["#CinematicVibes", "#StoryFrames", "#FilmMagic", "#VisualTales"],
    category: "Short Film",
    isFollowing: false,
  },
  {
    id: 2,
    user: { name: "Alara Storm", username: "@alarastorm", avatar: "AS", verified: false },
    image: storyThumb2,
    likes: 12400,
    comments: 567,
    shares: 234,
    tags: ["#SciFi", "#Storilyne", "#AIStory"],
    category: "Animation",
    isFollowing: true,
  },
  {
    id: 3,
    user: { name: "Luna Wave", username: "@lunawave", avatar: "LW", verified: true },
    image: storyThumb3,
    likes: 9100,
    comments: 445,
    shares: 189,
    tags: ["#UnderwaterMagic", "#Fantasy"],
    category: "Voice-Over",
    isFollowing: false,
  },
  {
    id: 4,
    user: { name: "Blaze Knight", username: "@blazeknight", avatar: "BK", verified: false },
    image: storyThumb4,
    likes: 4200,
    comments: 128,
    shares: 67,
    tags: ["#DragonTale", "#Epic"],
    category: "Storyboard",
    isFollowing: false,
  },
];

const formatCount = (n: number) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState<string>("For You");
  const [currentIndex, setCurrentIndex] = useState(0);
  const tabs = ["Follow", "For You", "Creatives"];
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollPos = el.scrollTop;
    const itemHeight = el.clientHeight;
    const newIndex = Math.round(scrollPos / itemHeight);
    if (newIndex !== currentIndex && newIndex < feedItems.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      >
        {feedItems.map((item, i) => (
          <div key={item.id} className="relative h-full snap-start snap-always flex-shrink-0">
            <img
              src={item.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading={i < 2 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/70" />

            {/* Top nav */}
            {i === currentIndex && (
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="glass-card-strong rounded-full px-1 py-1 flex items-center gap-1 w-fit">
                  <button className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeTab === tab
                          ? "bg-white/15 text-white"
                          : "text-white/60 hover:text-white/80"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button className="absolute right-0 top-0 glass-card-strong rounded-full p-2.5">
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            {/* Right side actions */}
            <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-10">
              <button className="flex flex-col items-center gap-1 group">
                <div className="glass-card-strong rounded-full p-2.5">
                  <Heart className="w-5 h-5 text-white group-hover:text-brand-coral transition-colors" />
                </div>
                <span className="text-[10px] text-white/80 font-medium">{formatCount(item.likes)}</span>
              </button>
              <button className="flex flex-col items-center gap-1 group">
                <div className="glass-card-strong rounded-full p-2.5">
                  <MessageCircle className="w-5 h-5 text-white group-hover:text-brand-teal transition-colors" />
                </div>
                <span className="text-[10px] text-white/80 font-medium">{formatCount(item.comments)}</span>
              </button>
              <button className="flex flex-col items-center gap-1 group">
                <div className="glass-card-strong rounded-full p-2.5">
                  <Send className="w-5 h-5 text-white group-hover:text-brand-orange transition-colors" />
                </div>
                <span className="text-[10px] text-white/80 font-medium">{formatCount(item.shares)}</span>
              </button>
              <button className="group">
                <div className="glass-card-strong rounded-full p-2.5">
                  <Bookmark className="w-5 h-5 text-white group-hover:text-brand-yellow transition-colors" />
                </div>
              </button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-6 left-4 right-16 z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/20">
                  {item.user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-sm font-semibold text-white">
                      {item.user.name}
                    </span>
                    {item.user.verified && (
                      <div className="w-4 h-4 rounded-full bg-brand-teal flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-white/50">{item.user.username}</span>
                </div>
                {!item.isFollowing && (
                  <button className="glass-card-strong rounded-full px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors">
                    Follow
                  </button>
                )}
              </div>
              <p className="text-xs text-white/70 leading-relaxed mb-2">
                {item.tags.join("  ")}
              </p>
              <span className="glass-card-strong rounded-full px-3 py-1 text-[10px] font-medium text-white/90">
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
