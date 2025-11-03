import Header from '../common/Header';
import Footer from '../common/Footer';
import ProfileSection from './components/ProfileSection';
import MenuList from './components/MenuList';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <ProfileSection />
      <MenuList />
      <Footer type="nav" />
    </div>
  );
}