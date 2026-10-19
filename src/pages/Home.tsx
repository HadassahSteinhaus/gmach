import { useEffect, useMemo, useState } from 'react';
import { Filter, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { supabase, type Item } from '@/lib/supabase';

interface HomeProps {
  onSelectItem: (item: Item) => void;
  refreshKey?: number;
}

export default function Home({ onSelectItem, refreshKey = 0 }: HomeProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('הכל');

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: true });
      if (!active) return;
      if (error) setError('שגיאה בטעינת הפריטים');
      else setItems(data as Item[]);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ['הכל', ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(
    () => (category === 'הכל' ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-slate-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <p className="text-slate-700 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          קטלוג הציוד להשאלה
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm sm:text-base">
          בחרו פריט מהרשימה ומלאו טופס בקשת השאלה. הכל בחינם, לטובת הכלל.
        </p>
      </div>

      {categories.length > 2 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-medium">סינון</span>
          </div>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-3.5 h-8 rounded-full text-sm font-medium transition-all ${
                category === c
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((item) => {
          const available = item.status === 'available';
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group text-right bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 hover:border-emerald-200 transition-all duration-200"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={item.image_url}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 h-7 rounded-full text-xs font-bold shadow-sm ${
                    available
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-500/90 text-white'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      available ? 'bg-white animate-pulse' : 'bg-white/70'
                    }`}
                  />
                  {available ? 'זמין' : 'מושאל'}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 leading-snug">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    פרטים
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">אין פריטים בקטגוריה זו.</p>
        </div>
      )}
    </div>
  );
}
