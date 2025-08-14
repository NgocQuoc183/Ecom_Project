import HeroSection from "../components/home/HeroSection";
import CategorySection from "../components/home/CategorySection";
import TwoImageSection from "../components/home/TwoImageSection";
import NewestProductsSection from "../components/home/NewestProductsSection";
import TipsSection from "../components/home/TipsSection";
import ReuzelTVSection from "../components/home/ReuzelTVSection";



const Home = () => {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <NewestProductsSection />
      <TwoImageSection />
      <TipsSection />
      <ReuzelTVSection />
    </div>
  );
};

export default Home;
