import HeroBanner from '../components/Home/HeroBanner';
import FeaturedCollections from '../components/Home/FeaturedCollections';
import FlashSales from '../components/Home/FlashSales';
import TrendingProducts from '../components/Home/TrendingProducts';
import BestSellers from '../components/Home/BestSellers';
import Recommendations from '../components/Home/Recommendations';
import BlogPreview from '../components/Home/BlogPreview';
import TrustBadges from '../components/Home/TrustBadges';

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <FeaturedCollections />
      <FlashSales />
      <TrendingProducts />
      <BestSellers />
      <Recommendations />
      <BlogPreview />
      <TrustBadges />
    </main>
  );
}
