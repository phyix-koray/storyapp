import { BookOpen, Compass, FolderOpen, UserCircle, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { id: "stories", icon: BookOpen, label: "Stories", path: "/", color: "text-brand-teal" },
  { id: "explore", icon: Compass, label: "Explore", path: "/explore", color: "text-brand-cyan" },
  { id: "create", icon: Plus, label: "", path: "/create", color: "" },
  { id: "assets", icon: FolderOpen, label: "Assets", path: "/assets", color: "text-brand-yellow" },
  { id: "profile", icon: UserCircle, label: "My Space", path: "/profile", color: "text-brand-orange" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative flex-shrink-0">
      <nav className="mx-2 mb-2 rounded-2xl glass-card-strong px-1 py-1">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const isCreate = tab.id === "create";

            if (isCreate) {
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className="relative -mt-5 flex items-center justify-center"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 rounded-full gradient-brand flex items-center justify-center shadow-lg glow-orange"
                  >
                    <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </motion.div>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center gap-0.5 py-1.5 px-2 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full gradient-warm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon
                  className={`w-[18px] h-[18px] transition-colors ${
                    isActive ? tab.color : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.5}
                />
                <span
                  className={`text-[9px] font-body transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
