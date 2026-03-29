import MobileLayout from "@/components/MobileLayout";
import BottomNav from "@/components/BottomNav";
import ProfilePage from "@/pages/ProfilePage";

const ProfileRoute = () => (
  <MobileLayout>
    <div className="flex-1 overflow-hidden">
      <ProfilePage />
    </div>
    <BottomNav />
  </MobileLayout>
);

export default ProfileRoute;
