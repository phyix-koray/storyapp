import { motion } from "framer-motion";
import { Crown, Zap, Image, Film, Clock, ChevronRight, Settings, LogOut, Star, Gift } from "lucide-react";

const usageStats = [
  { label: "Stories Created", value: "24", icon: Film, color: "text-brand-teal", bg: "bg-brand-teal/15" },
  { label: "Images Generated", value: "186", icon: Image, color: "text-brand-orange", bg: "bg-brand-orange/15" },
  { label: "Credits Used", value: "1,240", icon: Zap, color: "text-brand-yellow", bg: "bg-brand-yellow/15" },
];

const ProfilePage = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold gradient-brand-text">My Space</h1>
        <button className="glass-white rounded-full p-2.5 hover:bg-white/10 transition-colors">
          <Settings className="w-5 h-5 text-foreground/70" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="mx-5 mt-2 glass-card rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-brand-orange/10 animate-pulse-glow pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-brand-teal/10 animate-pulse-glow pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 min-w-[4rem] rounded-2xl gradient-warm flex items-center justify-center text-2xl font-bold text-white font-display shadow-lg">
            A
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-foreground">Alex Creator</h2>
            <p className="text-sm text-muted-foreground">@alexcreator</p>
            <span className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full glass-white text-xs text-brand-yellow font-semibold">
              <Star className="w-3.5 h-3.5" /> Free Plan
            </span>
          </div>
        </div>
      </div>

      {/* Upgrade Card */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="mx-5 mt-3 rounded-2xl p-4 gradient-sunset relative overflow-hidden cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-3 relative">
          <Crown className="w-8 h-8 text-white" />
          <div className="flex-1">
            <h3 className="font-display text-base font-bold text-white">Upgrade to Pro</h3>
            <p className="text-sm text-white/80">Unlimited stories, HD exports & more</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/70" />
        </div>
      </motion.div>

      {/* Usage Stats */}
      <div className="px-5 mt-5">
        <h3 className="font-display text-sm font-semibold text-foreground mb-3">Usage</h3>
        <div className="grid grid-cols-3 gap-2.5">
          {usageStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-3 text-center"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground leading-tight mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Credit Bar */}
      <div className="px-5 mt-4">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Monthly Credits</span>
            <span className="text-sm text-brand-yellow font-semibold">1,240 / 2,000</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "62%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full gradient-warm"
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Resets in 12 days</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mt-5 pb-6 space-y-2">
        {[
          { label: "Account Settings", icon: Settings, color: "text-brand-teal" },
          { label: "Rewards", icon: Gift, color: "text-brand-orange" },
          { label: "Sign Out", icon: LogOut, color: "text-destructive" },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full glass-card rounded-2xl p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-sm text-foreground">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
