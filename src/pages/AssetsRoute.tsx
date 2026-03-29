import MobileLayout from "@/components/MobileLayout";
import BottomNav from "@/components/BottomNav";
import AssetsPage from "@/pages/AssetsPage";

const AssetsRoute = () => (
  <MobileLayout>
    <div className="flex-1 overflow-hidden">
      <AssetsPage />
    </div>
    <BottomNav />
  </MobileLayout>
);

export default AssetsRoute;
