import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen font-sans bg-white text-black">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

