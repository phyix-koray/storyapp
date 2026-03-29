import MobileLayout from "@/components/MobileLayout";
import BottomNav from "@/components/BottomNav";
import MyStories from "@/pages/MyStories";

const Index = () => {
  return (
    <MobileLayout>
      <div className="flex-1 overflow-hidden">
        <MyStories />
      </div>
      <BottomNav />
    </MobileLayout>
  );
};

export default Index;
