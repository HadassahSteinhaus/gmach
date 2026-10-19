import { useState } from 'react';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import ItemDetail from '@/pages/ItemDetail';
import Admin from '@/pages/Admin';
import type { Item } from '@/lib/supabase';

type Page = 'home' | 'admin';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [selected, setSelected] = useState<Item | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const goHome = () => {
    setSelected(null);
    setPage('home');
  };

  const handleNavigate = (p: Page) => {
    setSelected(null);
    setPage(p);
  };

  const handleSelectItem = (item: Item) => {
    setSelected(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitted = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header current={page} onNavigate={handleNavigate} />

      <main>
        {page === 'home' && !selected && <Home onSelectItem={handleSelectItem} refreshKey={refreshKey} />}
        {page === 'home' && selected && (
          <ItemDetail item={selected} onBack={goHome} onSubmitted={handleSubmitted} />
        )}
        {page === 'admin' && <Admin refreshKey={refreshKey} />}
      </main>

      <footer className="border-t border-slate-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-400">
          גמ"ח ציוד לאירועים וליולדות · לטובת הכלל
        </div>
      </footer>
    </div>
  );
}

export default App;
