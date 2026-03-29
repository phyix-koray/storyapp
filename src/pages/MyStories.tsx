import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, MoreVertical, Film, Image, Mic, Trash2 } from "lucide-react";
import { getStories, deleteStory, StoryData } from "@/lib/store";
import storylyneLogo from "@/assets/storilyne-logo.png";
import storyThumb1 from "@/assets/story-thumb-1.jpg";
import storyThumb2 from "@/assets/story-thumb-2.jpg";
import storyThumb3 from "@/assets/story-thumb-3.jpg";
import storyThumb4 from "@/assets/story-thumb-4.jpg";

const outputTypeIcons = {
  storyboard: Image,
  animation: Film,
  voiceover: Mic,
};

const outputTypeLabels = {
  storyboard: "Storyboard",
  animation: "Animation",
  voiceover: "Voice-Over",
};

const outputTypeColors = {
  storyboard: "text-brand-teal",
  animation: "text-brand-orange",
  voiceover: "text-brand-pink",
};

const outputTypeBg = {
  storyboard: "bg-brand-teal/15",
  animation: "bg-brand-orange/15",
  voiceover: "bg-brand-pink/15",
};

const defaultStories = [
  { id: "default-1", title: "The Lost Kingdom", style: "Disney 3D", outputType: "animation" as const, frameCount: 12, thumbnail: storyThumb1, folder: null, createdAt: "2024-01-01" },
  { id: "default-2", title: "Space Odyssey", style: "Photorealistic", outputType: "storyboard" as const, frameCount: 8, thumbnail: storyThumb2, folder: null, createdAt: "2024-01-02" },
  { id: "default-3", title: "Ocean's Secret", style: "Anime", outputType: "voiceover" as const, frameCount: 15, thumbnail: storyThumb3, folder: "Fantasy", createdAt: "2024-01-03" },
  { id: "default-4", title: "Dragon's Fury", style: "Marvel-Style", outputType: "animation" as const, frameCount: 10, thumbnail: storyThumb4, folder: "Fantasy", createdAt: "2024-01-04" },
];

const MyStories = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [stories, setStories] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const filters = ["All", "Storyboard", "Animation", "Voice-Over"];

  useEffect(() => {
    const saved = getStories();
    const allStories = [
      ...saved.map(s => ({
        ...s,
        thumbnail: s.thumbnail || storyThumb1,
      })),
      ...defaultStories,
    ];
    setStories(allStories);
  }, []);

  const filterMap: Record<string, string> = {
    "Storyboard": "storyboard",
    "Animation": "animation",
    "Voice-Over": "voiceover",
  };

  const filtered = activeFilter === "All" ? stories : stories.filter((s) => s.outputType === filterMap[activeFilter]);

  const handleDelete = (id: string) => {
    deleteStory(id);
    setStories(prev => prev.filter(s => s.id !== id));
    setMenuOpen(null);
  };

  const filterColors: Record<string, string> = {
    All: "gradient-brand",
    Storyboard: "gradient-cool",
    Animation: "gradient-warm",
    "Voice-Over": "gradient-sunset",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <img src={storylyneLogo} alt="Storilyne" className="h-8 object-contain" />
        <button className="glass-white rounded-full p-2.5 hover:bg-white/10 transition-colors">
          <FolderPlus className="w-5 h-5 text-foreground/70" />
        </button>
      </div>

      {/* Filters */}
      <div className="px-5 pb-4">
        <div className="glass-card rounded-2xl p-1.5 flex gap-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === f
                  ? `${filterColors[f]} text-white shadow`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 scrollbar-hide">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence>
            {filtered.map((story, i) => {
              const TypeIcon = outputTypeIcons[story.outputType as keyof typeof outputTypeIcons] || Image;
              const typeLabel = outputTypeLabels[story.outputType as keyof typeof outputTypeLabels] || story.outputType;
              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-white/20 transition-all relative"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={story.thumbnail}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === story.id ? null : story.id); }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full glass-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>

                    {/* Context menu */}
                    {menuOpen === story.id && !story.id.startsWith("default") && (
                      <div className="absolute top-10 right-2 z-20 glass-card-strong rounded-xl p-1 min-w-[120px]">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(story.id); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/20 transition-colors text-sm text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}

                    {story.folder && (
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg glass-white text-xs text-white font-medium">
                        📁 {story.folder}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-display text-sm font-semibold text-white leading-tight truncate">
                        {story.title}
                      </h3>
                      <p className="text-xs text-white/60 mt-0.5">
                        {story.style} • {story.frameCount} frames
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-md ${outputTypeBg[story.outputType as keyof typeof outputTypeBg]} ${outputTypeColors[story.outputType as keyof typeof outputTypeColors]}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">{typeLabel}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyStories;
