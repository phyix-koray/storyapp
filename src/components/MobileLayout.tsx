import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative w-full max-w-[430px] h-screen max-h-[932px] overflow-hidden bg-background bg-mesh flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;
