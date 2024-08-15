import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      LeftSidebar
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
