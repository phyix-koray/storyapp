import MobileLayout from "@/components/MobileLayout";
import BottomNav from "@/components/BottomNav";
import CreateStory from "@/pages/CreateStory";

const CreateRoute = () => (
  <MobileLayout>
    <div className="flex-1 overflow-hidden">
      <CreateStory />
    </div>
    <BottomNav />
  </MobileLayout>
);

export default CreateRoute;
