import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Save, FolderOpen, Sparkles, X, ChevronDown, ImagePlus, Box, Clock, Clipboard, Library, Wand2, Film, Image, Mic, SkipForward, Shuffle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { saveStory, saveCharacter, generateId, StoryCharacter } from "@/lib/store";
import AvatarGenerator from "@/pages/AvatarGenerator";
import styleAnime from "@/assets/style-anime.jpg";
import styleDisney from "@/assets/style-disney3d.jpg";
import styleGhibli from "@/assets/style-ghibli.jpg";
import stylePhoto from "@/assets/style-photorealistic.jpg";
import styleMarvel from "@/assets/style-marvel.jpg";
import styleKawaii from "@/assets/style-kawaii.jpg";
import styleManga from "@/assets/style-manga.jpg";
import styleCartoon from "@/assets/style-cartoon.jpg";
import styleDC from "@/assets/style-dc.jpg";
import styleSimpsons from "@/assets/style-simpsons.jpg";
import styleRickMorty from "@/assets/style-rickmorty.jpg";
import styleMinecraft from "@/assets/style-minecraft.jpg";
import styleRoblox from "@/assets/style-roblox.jpg";
import styleFamilyGuy from "@/assets/style-familyguy.jpg";
import styleHandDrawn from "@/assets/style-handdrawn.jpg";

const artStyles = [
  { id: "anime", name: "Anime", image: styleAnime },
  { id: "manga", name: "Manga", image: styleManga },
  { id: "disney3d", name: "Disney 3D", image: styleDisney },
  { id: "cartoon", name: "Cartoon", image: styleCartoon },
  { id: "ghibli", name: "Ghibli", image: styleGhibli },
  { id: "photorealistic", name: "Photo", image: stylePhoto },
  { id: "marvel", name: "Marvel", image: styleMarvel },
  { id: "dc", name: "DC-Style", image: styleDC },
  { id: "simpsons", name: "Simpsons", image: styleSimpsons },
  { id: "rickmorty", name: "Rick & Morty", image: styleRickMorty },
  { id: "minecraft", name: "Minecraft", image: styleMinecraft },
  { id: "roblox", name: "Roblox", image: styleRoblox },
  { id: "kawaii", name: "Kawaii", image: styleKawaii },
  { id: "familyguy", name: "Family Guy", image: styleFamilyGuy },
  { id: "handdrawn", name: "Hand Drawn", image: styleHandDrawn },
];

const languages = ["English", "Turkish", "Spanish", "French", "German", "Japanese", "Korean", "Portuguese", "Arabic", "Chinese"];
const frameCounts = [4, 6, 8, 10, 12, 15, 20];
const imageFormats = ["1:1 Square", "9:16 Portrait", "16:9 Landscape", "4:5 Social"];

const storyTopics = [
  "Work Life", "Relationships", "Psychology", "Law", "Football",
  "Technology", "Health", "Religion", "Astrology", "History", "Animals"
];

// Topics that need follow-up questions
const topicFollowUps: Record<string, { question: string; placeholder: string }> = {
  "Law": { question: "Which country's laws?", placeholder: "e.g. United States, Turkey, Germany..." },
  "Religion": { question: "Which religion?", placeholder: "e.g. Islam, Christianity, Buddhism..." },
  "Astrology": { question: "Which zodiac sign(s)?", placeholder: "e.g. Leo, Scorpio, Pisces..." },
  "History": { question: "War, country history? Which years?", placeholder: "e.g. World War II, Ottoman Empire 1453..." },
  "Animals": { question: "Any specific animal?", placeholder: "e.g. Wolf, Eagle, Dolphin..." },
};

const outputTypes = [
  { id: "storyboard", label: "Storyboard", icon: Image, gradient: "gradient-cool" },
  { id: "animation", label: "Animation", icon: Film, gradient: "gradient-warm" },
  { id: "voiceover", label: "Voice-Over", icon: Mic, gradient: "gradient-sunset" },
];

type UploadTarget = "character" | "object" | null;
type ViewState = "form" | "avatar-generator";

const CreateStory = () => {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>("form");
  const [selectedStyle, setSelectedStyle] = useState("anime");
  const [outputType, setOutputType] = useState("storyboard");
  const [language, setLanguage] = useState("English");
  const [frameCount, setFrameCount] = useState(8);
  const [imageFormat, setImageFormat] = useState("9:16 Portrait");
  const [topicType, setTopicType] = useState<"Fictional" | "Documentary" | null>(null);
  const [topic, setTopic] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [consistencyCheck, setConsistencyCheck] = useState(true);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showFrameDropdown, setShowFrameDropdown] = useState(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [characters, setCharacters] = useState<{ name: string; role: string; imageUrl?: string }[]>([]);
  const [objects, setObjects] = useState<{ name: string; role: string; imageUrl?: string }[]>([]);
  const [uploadMenu, setUploadMenu] = useState<UploadTarget>(null);
  const [showUploadDialog, setShowUploadDialog] = useState<UploadTarget>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadRole, setUploadRole] = useState("");
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [avatarCharacters, setAvatarCharacters] = useState<StoryCharacter[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const needsFollowUp = selectedCategory && topicFollowUps[selectedCategory];

  const handleUploadOption = (option: string, target: UploadTarget) => {
    if (option === "clipboard") {
      navigator.clipboard.read?.().then(items => {
        for (const item of items) {
          if (item.types.some(t => t.startsWith("image/"))) {
            const imageType = item.types.find(t => t.startsWith("image/"));
            if (imageType) {
              item.getType(imageType).then(blob => {
                const reader = new FileReader();
                reader.onload = () => {
                  setUploadImage(reader.result as string);
                  setShowUploadDialog(target);
                };
                reader.readAsDataURL(blob);
              });
            }
          }
        }
      }).catch(() => {
        toast.error("Cannot read clipboard. Please try uploading from library.");
      });
    } else if (option === "library") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setUploadImage(reader.result as string);
            setShowUploadDialog(target);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else if (option === "history") {
      setShowUploadDialog(target);
    }
    setUploadMenu(null);
  };

  const confirmUpload = () => {
    if (!uploadName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    const item = { name: uploadName, role: uploadRole, imageUrl: uploadImage || undefined };
    if (showUploadDialog === "character") {
      setCharacters(prev => [...prev, item]);
      saveCharacter({
        id: generateId(),
        name: uploadName,
        role: uploadRole,
        imageUrl: uploadImage || undefined,
        usedIn: 0,
        createdAt: new Date().toISOString(),
      });
    } else {
      setObjects(prev => [...prev, item]);
    }
    setShowUploadDialog(null);
    setUploadName("");
    setUploadRole("");
    setUploadImage(null);
    toast.success(`${showUploadDialog === "character" ? "Character" : "Object"} added!`);
  };

  const handleGenerate = () => {
    if (!topicType || !selectedCategory) {
      toast.error("Please select a story topic");
      return;
    }

    // If character consistency is on, go to avatar generator first
    if (consistencyCheck) {
      // Pre-populate characters from the story context
      const defaultChars: StoryCharacter[] = [
        {
          id: generateId(),
          name: "",
          role: "Lead",
          description: "",
          referenceImages: characters.filter(c => c.imageUrl).map(c => c.imageUrl!),
        },
      ];
      setAvatarCharacters(defaultChars);
      setViewState("avatar-generator");
      return;
    }

    // Generate story directly
    completeStoryGeneration([]);
  };

  const completeStoryGeneration = (finalCharacters: StoryCharacter[]) => {
    const story = {
      id: generateId(),
      title: `${selectedCategory} Story`,
      style: artStyles.find(s => s.id === selectedStyle)?.name || selectedStyle,
      outputType: outputType as "storyboard" | "animation" | "voiceover",
      language,
      frameCount,
      imageFormat,
      topicType: topicType!,
      category: selectedCategory!,
      topic: topic || followUpAnswer,
      consistencyCheck,
      characters: finalCharacters,
      thumbnail: artStyles.find(s => s.id === selectedStyle)?.image,
      createdAt: new Date().toISOString(),
    };
    saveStory(story);

    // Save characters to assets
    finalCharacters.forEach(char => {
      saveCharacter({
        id: char.id,
        name: char.name,
        role: char.role,
        imageUrl: char.imageUrl,
        usedIn: 1,
        createdAt: new Date().toISOString(),
      });
    });

    toast.success("Story created successfully! 🎉");
    navigate("/");
  };

  const handleAvatarComplete = (completedCharacters: StoryCharacter[]) => {
    completeStoryGeneration(completedCharacters);
  };

  // Avatar Generator view
  if (viewState === "avatar-generator") {
    return (
      <AvatarGenerator
        characters={avatarCharacters}
        onComplete={handleAvatarComplete}
        onBack={() => setViewState("form")}
        style={artStyles.find(s => s.id === selectedStyle)?.name || selectedStyle}
        uploadedCharacterImages={characters.filter(c => c.imageUrl).map(c => c.imageUrl!)}
      />
    );
  }

  const uploadMenuItems = [
    { id: "library", label: "Library", icon: Library, desc: "Choose from files", color: "text-brand-teal" },
    { id: "history", label: "History", icon: Clock, desc: "From your assets", color: "text-brand-orange" },
    { id: "clipboard", label: "Clipboard", icon: Clipboard, desc: "Paste copied image", color: "text-brand-yellow" },
  ];

  const UploadMenuPopup = ({ target }: { target: UploadTarget }) => (
    <AnimatePresence>
      {uploadMenu === target && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          className="absolute z-30 top-full mt-2 left-0 right-0 glass-card-strong rounded-2xl p-2 space-y-1"
        >
          {uploadMenuItems.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleUploadOption(opt.id, target)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg glass-white flex items-center justify-center">
                <opt.icon className={`w-5 h-5 ${opt.color}`} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Upload Dialog */}
      <AnimatePresence>
        {showUploadDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card-strong rounded-2xl p-5 w-full max-w-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-foreground">
                  Add {showUploadDialog === "character" ? "Character" : "Object"}
                </h3>
                <button onClick={() => { setShowUploadDialog(null); setUploadImage(null); }} className="p-1 rounded-full hover:bg-white/10">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Image preview */}
              {uploadImage && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto glass-white">
                  <img src={uploadImage} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <input
                type="text"
                placeholder="Name (e.g. Hatice, Mother)"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                className="w-full glass-white rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="Role (e.g. Anne, Villain, Hero)"
                value={uploadRole}
                onChange={(e) => setUploadRole(e.target.value)}
                className="w-full glass-white rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              {!uploadImage && (
                <button
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setUploadImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  className="w-full py-3 rounded-xl glass-white text-sm text-brand-teal font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <ImagePlus className="w-4 h-4" /> Choose Image
                </button>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={confirmUpload}
                className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm"
              >
                Add {showUploadDialog === "character" ? "Character" : "Object"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <h1 className="font-display text-xl font-bold gradient-brand-text">Create Story</h1>
        <div className="flex gap-2">
          <button className="glass-white rounded-full p-2 hover:bg-white/10 transition-colors" title="Load Template">
            <FolderOpen className="w-4 h-4 text-foreground/70" />
          </button>
          <button className="glass-white rounded-full p-2 hover:bg-white/10 transition-colors" title="Save Template">
            <Save className="w-4 h-4 text-foreground/70" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-6 scrollbar-hide space-y-4">

        {/* Output Type Tabs */}
        <div className="glass-card rounded-2xl p-1.5 flex gap-1.5">
          {outputTypes.map((type) => {
            const isActive = outputType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setOutputType(type.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? `${type.gradient} text-white shadow-lg`
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <type.icon className="w-5 h-5" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Upload Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <button
              onClick={() => setUploadMenu(uploadMenu === "character" ? null : "character")}
              className="w-full glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-brand-teal/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-brand-teal/15 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ImagePlus className="w-6 h-6 text-brand-teal" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Character</p>
                <p className="text-xs text-muted-foreground">Add reference</p>
              </div>
            </button>
            <UploadMenuPopup target="character" />
            {characters.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {characters.map((c, i) => (
                  <span key={i} className="glass-white rounded-full px-2.5 py-1 text-xs text-foreground flex items-center gap-1.5">
                    {c.imageUrl && <img src={c.imageUrl} alt="" className="w-4 h-4 rounded-full object-cover" />}
                    {c.name} {c.role && <span className="text-muted-foreground">({c.role})</span>}
                    <X className="w-3 h-3 text-muted-foreground cursor-pointer" onClick={() => setCharacters(prev => prev.filter((_, idx) => idx !== i))} />
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setUploadMenu(uploadMenu === "object" ? null : "object")}
              className="w-full glass-card rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-brand-orange/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-brand-orange/15 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Box className="w-6 h-6 text-brand-orange" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Object</p>
                <p className="text-xs text-muted-foreground">Add reference</p>
              </div>
            </button>
            <UploadMenuPopup target="object" />
            {objects.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {objects.map((o, i) => (
                  <span key={i} className="glass-white rounded-full px-2.5 py-1 text-xs text-foreground flex items-center gap-1.5">
                    {o.name} {o.role && <span className="text-muted-foreground">({o.role})</span>}
                    <X className="w-3 h-3 text-muted-foreground cursor-pointer" onClick={() => setObjects(prev => prev.filter((_, idx) => idx !== i))} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Character Consistency */}
        <div
          onClick={() => setConsistencyCheck(!consistencyCheck)}
          className="glass-card rounded-2xl p-3.5 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Wand2 className="w-5 h-5 text-brand-yellow" />
            <div>
              <p className="text-sm font-medium text-foreground">Character Consistency</p>
              <p className="text-xs text-muted-foreground">Generate avatar for consistency</p>
            </div>
          </div>
          <div className={`w-10 h-5 rounded-full transition-colors relative ${consistencyCheck ? "gradient-warm" : "bg-secondary"}`}>
            <motion.div
              animate={{ x: consistencyCheck ? 18 : 2 }}
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          </div>
        </div>

        {/* Art Style — horizontal scroll, portrait cards */}
        <div>
          <label className="font-display text-sm font-semibold text-foreground mb-2 block">Choose Style</label>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
            {artStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className="flex-shrink-0 w-[80px] group"
              >
                <div
                  className={`relative w-[80px] h-[110px] rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedStyle === style.id
                      ? "border-brand-orange glow-orange"
                      : "border-transparent glass-card"
                  }`}
                >
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {selectedStyle === style.id && (
                    <div className="absolute inset-0 bg-brand-orange/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                <p className={`text-[10px] text-center mt-1.5 font-medium truncate ${
                  selectedStyle === style.id ? "text-brand-orange" : "text-muted-foreground"
                }`}>
                  {style.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Settings — stacked rows */}
        <div className="space-y-2.5">
          <label className="font-display text-sm font-semibold text-foreground block">Settings</label>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => { setShowLangDropdown(!showLangDropdown); setShowFrameDropdown(false); setShowFormatDropdown(false); }}
              className="w-full glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-brand-teal uppercase tracking-wider">Language</span>
                <span className="text-sm text-foreground font-medium">{language}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showLangDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-30 mt-1 w-full glass-card-strong rounded-xl overflow-hidden max-h-48 overflow-y-auto scrollbar-hide"
                >
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLanguage(l); setShowLangDropdown(false); }}
                      className={`w-full px-4 py-3 text-sm text-left flex items-center justify-between hover:bg-white/5 transition-colors ${language === l ? "text-brand-teal" : "text-foreground"}`}
                    >
                      {l}
                      {language === l && <Check className="w-4 h-4 text-brand-teal" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Frames */}
          <div className="relative">
            <button
              onClick={() => { setShowFrameDropdown(!showFrameDropdown); setShowLangDropdown(false); setShowFormatDropdown(false); }}
              className="w-full glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">Frames</span>
                <span className="text-sm text-foreground font-medium">{frameCount}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showFrameDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showFrameDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-30 mt-1 w-full glass-card-strong rounded-xl overflow-hidden"
                >
                  {frameCounts.map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFrameCount(f); setShowFrameDropdown(false); }}
                      className={`w-full px-4 py-3 text-sm text-left hover:bg-white/5 transition-colors ${frameCount === f ? "text-brand-orange" : "text-foreground"}`}
                    >
                      {f} frames
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Format */}
          <div className="relative">
            <button
              onClick={() => { setShowFormatDropdown(!showFormatDropdown); setShowLangDropdown(false); setShowFrameDropdown(false); }}
              className="w-full glass-card rounded-2xl px-4 py-3.5 flex items-center justify-between hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-brand-pink uppercase tracking-wider">Format</span>
                <span className="text-sm text-foreground font-medium">{imageFormat}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showFormatDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showFormatDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-30 mt-1 w-full glass-card-strong rounded-xl overflow-hidden"
                >
                  {imageFormats.map((f) => (
                    <button
                      key={f}
                      onClick={() => { setImageFormat(f); setShowFormatDropdown(false); }}
                      className={`w-full px-4 py-3 text-sm text-left hover:bg-white/5 transition-colors ${imageFormat === f ? "text-brand-pink" : "text-foreground"}`}
                    >
                      {f}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Story Topic */}
        <div>
          <label className="font-display text-sm font-semibold text-foreground mb-2 block">Story Topic</label>

          <div className="glass-card rounded-2xl p-1 flex gap-1 mb-3">
            {(["Fictional", "Documentary"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setTopicType(topicType === type ? null : type);
                  setSelectedCategory(null);
                  setFollowUpAnswer("");
                }}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  topicType === type
                    ? type === "Fictional" ? "gradient-brand text-white shadow-lg" : "gradient-cool text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {topicType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {storyTopics.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(selectedCategory === cat ? null : cat);
                        setFollowUpAnswer("");
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                        selectedCategory === cat
                          ? topicType === "Fictional" ? "gradient-warm text-white shadow" : "gradient-cool text-white shadow"
                          : "glass-white text-foreground/80 hover:bg-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Conditional Follow-up Question */}
                <AnimatePresence>
                  {needsFollowUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-3"
                    >
                      <div className="glass-card rounded-2xl p-4 space-y-3">
                        <p className="text-sm font-medium text-foreground">
                          {topicFollowUps[selectedCategory!].question}
                        </p>
                        <input
                          type="text"
                          placeholder={topicFollowUps[selectedCategory!].placeholder}
                          value={followUpAnswer}
                          onChange={(e) => setFollowUpAnswer(e.target.value)}
                          className="w-full glass-white rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/20 transition-colors"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setFollowUpAnswer("")}
                            className="flex-1 py-2.5 rounded-xl glass-white text-sm font-medium text-muted-foreground flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
                          >
                            <SkipForward className="w-3.5 h-3.5" />
                            Skip
                          </button>
                          <button
                            onClick={() => {
                              const randoms: Record<string, string[]> = {
                                "Law": ["United States", "Turkey", "Germany", "France", "Japan", "United Kingdom"],
                                "Religion": ["Islam", "Christianity", "Buddhism", "Hinduism", "Judaism"],
                                "Astrology": ["Aries", "Leo", "Scorpio", "Pisces", "Gemini", "Capricorn"],
                                "History": ["World War II", "Ottoman Empire", "Roman Empire", "Ancient Egypt", "Viking Age"],
                                "Animals": ["Wolf", "Eagle", "Dolphin", "Lion", "Elephant", "Fox"],
                              };
                              const options = randoms[selectedCategory!] || [];
                              setFollowUpAnswer(options[Math.floor(Math.random() * options.length)]);
                            }}
                            className="flex-1 py-2.5 rounded-xl gradient-brand-subtle text-sm font-medium text-foreground flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                            Random
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Only show free-form when no topic type selected */}
          {!topicType && (
            <textarea
              placeholder="Describe your story idea..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              className="w-full glass-card rounded-2xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/20 resize-none transition-colors"
            />
          )}
        </div>

        {/* Generate Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGenerate}
          className="w-full py-4 rounded-2xl gradient-brand text-white font-display font-bold text-base shadow-lg glow-orange flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {consistencyCheck ? "Next: Generate Characters" : "Generate Story"}
        </motion.button>
      </div>
    </div>
  );
};

export default CreateStory;
