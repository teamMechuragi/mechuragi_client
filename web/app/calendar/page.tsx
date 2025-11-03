import Header from '../common/Header';
import Footer from '../common/Footer';
import CalendarGrid from './components/CalendarGrid';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 기존 Header 그대로 사용 */}
      <Header title="2024년 12월" backLink="/" />
      
      <CalendarGrid />
      
      {/* 기존 Footer 그대로 사용 */}
      <Footer type="nav" />
    </div>
  );
}