import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Box, FileText, Search, MoreVertical, Upload, Plus, Trash2, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { getCharacters, getObjects, saveCharacter, saveObject, deleteCharacter, deleteObject, generateId, AssetCharacter, AssetObject } from "@/lib/store";
import styleAnime from "@/assets/style-anime.jpg";
import styleDisney from "@/assets/style-disney3d.jpg";
import styleGhibli from "@/assets/style-ghibli.jpg";

const assetTabs = [
  { id: "characters", label: "Characters", icon: User, gradient: "gradient-cool" },
  { id: "objects", label: "Objects", icon: Box, gradient: "gradient-warm" },
  { id: "templates", label: "Templates", icon: FileText, gradient: "gradient-sunset" },
];

const defaultCharacters = [
  { id: "def-1", name: "Luna", role: "Lead", imageUrl: styleAnime, usedIn: 3, createdAt: "" },
  { id: "def-2", name: "Captain Rex", role: "Hero", imageUrl: styleDisney, usedIn: 1, createdAt: "" },
  { id: "def-3", name: "Sakura", role: "Supporting", imageUrl: styleGhibli, usedIn: 5, createdAt: "" },
];

const mockTemplates = [
  { id: 1, name: "Fantasy Adventure", style: "Disney 3D", frames: 12, format: "Animation", color: "text-brand-orange" },
  { id: 2, name: "Sci-Fi Short", style: "Photorealistic", frames: 8, format: "Voice-Over", color: "text-brand-teal" },
  { id: 3, name: "Comic Strip", style: "Marvel-Style", frames: 6, format: "Storyboard", color: "text-brand-yellow" },
];

const AssetsPage = () => {
  const [activeTab, setActiveTab] = useState("characters");
  const [searchQuery, setSearchQuery] = useState("");
  const [characters, setCharacters] = useState<AssetCharacter[]>([]);
  const [objects, setObjects] = useState<AssetObject[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadRole, setUploadRole] = useState("");
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const saved = getCharacters();
    setCharacters([...saved, ...defaultCharacters]);
    setObjects(getObjects());
  }, []);

  const filteredChars = characters.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredObjs = objects.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    if (!uploadName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (activeTab === "characters") {
      const char: AssetCharacter = {
        id: generateId(),
        name: uploadName,
        role: uploadRole,
        imageUrl: uploadImage || undefined,
        usedIn: 0,
        createdAt: new Date().toISOString(),
      };
      saveCharacter(char);
      setCharacters(prev => [char, ...prev]);
    } else {
      const obj: AssetObject = {
        id: generateId(),
        name: uploadName,
        role: uploadRole,
        imageUrl: uploadImage || undefined,
        usedIn: 0,
        createdAt: new Date().toISOString(),
      };
      saveObject(obj);
      setObjects(prev => [obj, ...prev]);
    }
    setShowUpload(false);
    setUploadName("");
    setUploadRole("");
    setUploadImage(null);
    toast.success(`${activeTab === "characters" ? "Character" : "Object"} added!`);
  };

  const handleDelete = (id: string) => {
    if (activeTab === "characters") {
      deleteCharacter(id);
      setCharacters(prev => prev.filter(c => c.id !== id));
    } else {
      deleteObject(id);
      setObjects(prev => prev.filter(o => o.id !== id));
    }
    setMenuOpen(null);
    toast.success("Deleted successfully");
  };

  const pickImage = () => {
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
  };

  return (
    <div className="flex flex-col h-full">
      {/* Upload Dialog */}
      <AnimatePresence>
        {showUpload && (
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
                  Add {activeTab === "characters" ? "Character" : "Object"}
                </h3>
                <button onClick={() => { setShowUpload(false); setUploadImage(null); }} className="p-1 rounded-full hover:bg-white/10">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {uploadImage ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto glass-white">
                  <img src={uploadImage} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <button
                  onClick={pickImage}
                  className="w-full py-8 rounded-xl glass-white flex flex-col items-center gap-2 hover:bg-white/10 transition-colors"
                >
                  <ImagePlus className="w-8 h-8 text-muted-foreground/40" />
                  <span className="text-sm text-muted-foreground">Choose Image</span>
                </button>
              )}

              <input
                type="text"
                placeholder="Name (e.g. Hatice, Sword)"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
                className="w-full glass-white rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <input
                type="text"
                placeholder="Role (e.g. Anne, Weapon, Hero)"
                value={uploadRole}
                onChange={(e) => setUploadRole(e.target.value)}
                className="w-full glass-white rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleUpload}
                className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm"
              >
                Add {activeTab === "characters" ? "Character" : "Object"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold gradient-brand-text">Assets</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="glass-white rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
        >
          <Upload className="w-4 h-4 text-brand-orange" />
          Upload
        </button>
      </div>

      {/* Search */}
      <div className="px-5 pb-4">
        <div className="glass-card rounded-xl flex items-center gap-2.5 px-4 py-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pb-4">
        <div className="glass-card rounded-2xl p-1.5 flex gap-1">
          {assetTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 flex-1 justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? `${tab.gradient} text-white shadow`
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 scrollbar-hide">
        {activeTab === "characters" && (
          <div className="grid grid-cols-3 gap-3">
            {filteredChars.map((char, i) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden group hover:border-white/20 transition-all relative"
              >
                <div className="relative aspect-square">
                  {char.imageUrl ? (
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <User className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <button
                    onClick={() => setMenuOpen(menuOpen === char.id ? null : char.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full glass-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4 text-white" />
                  </button>
                  {menuOpen === char.id && !char.id.startsWith("def") && (
                    <div className="absolute top-8 right-1 z-20 glass-card-strong rounded-lg p-1 min-w-[100px]">
                      <button
                        onClick={() => handleDelete(char.id)}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-destructive/20 text-xs text-destructive"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-foreground truncate">{char.name}</p>
                  {char.role && <p className="text-xs text-brand-teal mt-0.5 truncate">{char.role}</p>}
                  <p className="text-xs text-muted-foreground mt-0.5">Used in {char.usedIn} stories</p>
                </div>
              </motion.div>
            ))}
            {/* Add new button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowUpload(true)}
              className="glass-card rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 hover:border-brand-teal/30 transition-colors"
            >
              <Plus className="w-6 h-6 text-brand-teal" />
              <span className="text-xs text-muted-foreground">Add New</span>
            </motion.button>
          </div>
        )}

        {activeTab === "objects" && (
          <>
            {filteredObjs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 flex items-center justify-center mb-3">
                  <Box className="w-8 h-8 text-brand-orange/40" />
                </div>
                <p className="text-sm text-foreground/70">No objects yet</p>
                <p className="text-xs text-muted-foreground mt-1">Upload objects to get started</p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="mt-4 glass-white rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-brand-orange hover:bg-white/10 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Object
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {filteredObjs.map((obj, i) => (
                  <motion.div
                    key={obj.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-2xl overflow-hidden group hover:border-white/20 transition-all relative"
                  >
                    <div className="relative aspect-square">
                      {obj.imageUrl ? (
                        <img src={obj.imageUrl} alt={obj.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <Box className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <button
                        onClick={() => setMenuOpen(menuOpen === obj.id ? null : obj.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full glass-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4 text-white" />
                      </button>
                      {menuOpen === obj.id && (
                        <div className="absolute top-8 right-1 z-20 glass-card-strong rounded-lg p-1 min-w-[100px]">
                          <button
                            onClick={() => handleDelete(obj.id)}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-destructive/20 text-xs text-destructive"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-foreground truncate">{obj.name}</p>
                      {obj.role && <p className="text-xs text-brand-orange mt-0.5 truncate">{obj.role}</p>}
                    </div>
                  </motion.div>
                ))}
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setShowUpload(true)}
                  className="glass-card rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 hover:border-brand-orange/30 transition-colors"
                >
                  <Plus className="w-6 h-6 text-brand-orange" />
                  <span className="text-xs text-muted-foreground">Add New</span>
                </motion.button>
              </div>
            )}
          </>
        )}

        {activeTab === "templates" && (
          <div className="space-y-2.5">
            {mockTemplates.map((tmpl, i) => (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-4 flex items-center justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <p className="text-sm font-display font-semibold text-foreground">{tmpl.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tmpl.style} • {tmpl.frames} frames • <span className={tmpl.color}>{tmpl.format}</span>
                  </p>
                </div>
                <button className="px-4 py-2 rounded-xl glass-white text-sm text-brand-teal font-medium hover:bg-white/10 transition-colors">
                  Use
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsPage;
