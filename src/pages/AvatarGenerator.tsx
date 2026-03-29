import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Sparkles, X, ImagePlus, ChevronRight } from "lucide-react";
import { StoryCharacter, generateId } from "@/lib/store";

interface AvatarGeneratorProps {
  characters: StoryCharacter[];
  onComplete: (characters: StoryCharacter[]) => void;
  onBack: () => void;
  style: string;
  uploadedCharacterImages?: string[];
}

const AvatarGenerator = ({ characters: initialCharacters, onComplete, onBack, style, uploadedCharacterImages }: AvatarGeneratorProps) => {
  const [characters, setCharacters] = useState<StoryCharacter[]>(
    initialCharacters.length > 0 ? initialCharacters : [
      { id: generateId(), name: "", role: "Lead", description: "", referenceImages: [] },
    ]
  );
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const addCharacter = () => {
    setCharacters(prev => [...prev, {
      id: generateId(),
      name: "",
      role: "Supporting",
      description: "",
      referenceImages: [],
    }]);
  };

  const removeCharacter = (id: string) => {
    if (characters.length <= 1) return;
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  const updateCharacter = (id: string, field: keyof StoryCharacter, value: any) => {
    setCharacters(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addReferenceImage = (charId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setCharacters(prev => prev.map(c => {
            if (c.id !== charId) return c;
            return { ...c, referenceImages: [...(c.referenceImages || []), reader.result as string] };
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeReferenceImage = (charId: string, imgIndex: number) => {
    setCharacters(prev => prev.map(c => {
      if (c.id !== charId) return c;
      return { ...c, referenceImages: (c.referenceImages || []).filter((_, i) => i !== imgIndex) };
    }));
  };

  const handleGenerateAvatar = async (charId: string) => {
    setGeneratingId(charId);
    // Simulate generation with placeholder
    await new Promise(r => setTimeout(r, 1500));
    const placeholderAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${charId}`;
    updateCharacter(charId, "imageUrl", placeholderAvatar);
    setGeneratingId(null);
  };

  const allValid = characters.every(c => c.name.trim() && c.description.trim());

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <button onClick={onBack} className="glass-white rounded-full p-2 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold gradient-brand-text">Avatar Generator</h1>
          <p className="text-xs text-muted-foreground">Create consistent character avatars</p>
        </div>
        <button
          onClick={addCharacter}
          className="glass-white rounded-full p-2.5 hover:bg-white/10 transition-colors"
        >
          <Plus className="w-5 h-5 text-brand-teal" />
        </button>
      </div>

      {/* Characters List */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 scrollbar-hide space-y-4">
        <AnimatePresence>
          {characters.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass-card rounded-2xl p-4 space-y-3"
            >
              {/* Character Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    index === 0 ? "gradient-warm text-white" : "glass-white text-foreground/80"
                  }`}>
                    {index === 0 ? "Lead" : `Supporting #${index}`}
                  </span>
                </div>
                {characters.length > 1 && (
                  <button
                    onClick={() => removeCharacter(char.id)}
                    className="p-1.5 rounded-full hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive/70" />
                  </button>
                )}
              </div>

              {/* Avatar Preview + Generate */}
              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-2xl glass-white overflow-hidden flex items-center justify-center flex-shrink-0">
                  {char.imageUrl ? (
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus className="w-8 h-8 text-muted-foreground/40" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleGenerateAvatar(char.id)}
                    disabled={generatingId === char.id}
                    className="w-full py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {generatingId === char.id ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {generatingId === char.id ? "Generating..." : "Generate Character"}
                  </motion.button>
                  <p className="text-[10px] text-muted-foreground text-center">Style: {style}</p>
                </div>
              </div>

              {/* Reference Images */}
              {(char.referenceImages && char.referenceImages.length > 0 || uploadedCharacterImages?.length) && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Reference Images</p>
                  <div className="flex gap-2 flex-wrap">
                    {uploadedCharacterImages && index === 0 && uploadedCharacterImages.map((img, i) => (
                      <div key={`uploaded-${i}`} className="relative w-12 h-12 rounded-lg overflow-hidden border border-brand-teal/30">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 left-0 right-0 bg-brand-teal/80 text-[7px] text-white text-center">Ref</span>
                      </div>
                    ))}
                    {(char.referenceImages || []).map((img, i) => (
                      <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden glass-white group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeReferenceImage(char.id, i)}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2.5 h-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addReferenceImage(char.id)}
                      className="w-12 h-12 rounded-lg glass-white flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )}

              {/* Name Input */}
              <input
                type="text"
                placeholder="Character name"
                value={char.name}
                onChange={(e) => updateCharacter(char.id, "name", e.target.value)}
                className="w-full glass-white rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/20 transition-colors"
              />

              {/* Description */}
              <textarea
                placeholder="Physical & demographic description (e.g. 35, male, brown hair, tall, blue eyes...)"
                value={char.description}
                onChange={(e) => updateCharacter(char.id, "description", e.target.value)}
                rows={2}
                className="w-full glass-white rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/20 resize-none transition-colors"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Character Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={addCharacter}
          className="w-full py-3.5 rounded-2xl glass-card flex items-center justify-center gap-2 text-sm font-medium text-brand-teal hover:bg-white/5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Character
        </motion.button>

        {/* Continue Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onComplete(characters)}
          disabled={!allValid}
          className="w-full py-4 rounded-2xl gradient-brand text-white font-display font-bold text-base shadow-lg glow-orange flex items-center justify-center gap-2 disabled:opacity-40"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default AvatarGenerator;
