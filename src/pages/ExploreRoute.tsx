import MobileLayout from "@/components/MobileLayout";
import BottomNav from "@/components/BottomNav";
import ExplorePage from "@/pages/ExplorePage";

const ExploreRoute = () => (
  <MobileLayout>
    <div className="flex-1 overflow-hidden">
      <ExplorePage />
    </div>
    <BottomNav />
  </MobileLayout>
);

export default ExploreRoute;
