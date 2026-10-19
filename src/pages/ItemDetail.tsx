import { useState } from 'react';
import { ArrowRight, CheckCircle2, Phone, User, CalendarDays, Loader2, AlertCircle } from 'lucide-react';
import { supabase, type Item } from '@/lib/supabase';

interface ItemDetailProps {
  item: Item;
  onBack: () => void;
  onSubmitted: () => void;
}

const israeliPhone = (p: string) => /^0\d{1,2}-?\d{7}$/.test(p.replace(/\s/g, ''));

export default function ItemDetail({ item, onBack, onSubmitted }: ItemDetailProps) {
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    start_date: '',
    end_date: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const available = item.status === 'available';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = 'יש להזין שם מלא';
    if (!form.phone.trim()) e.phone = 'יש להזין מספר טלפון';
    else if (!israeliPhone(form.phone)) e.phone = 'מספר טלפון ישראלי לא תקין';
    if (!form.start_date) e.start_date = 'יש לבחור תאריך התחלה';
    if (!form.end_date) e.end_date = 'יש לבחור תאריך החזרה';
    if (form.start_date && form.end_date && form.end_date <= form.start_date)
      e.end_date = 'תאריך ההחזרה חייב להיות אחרי תאריך ההתחלה';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    if (!validate()) return;
    setSubmitting(true);
    const { error } = await supabase.from('requests').insert({
      item_id: item.id,
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      start_date: form.start_date,
      end_date: form.end_date,
      status: 'pending',
    });
    setSubmitting(false);
    if (error) {
      setServerError('שגיאה בשליחת הבקשה. נסו שוב.');
      return;
    }
    setSuccess(true);
    onSubmitted();
  };

  const field = (key: keyof typeof form, label: string, type: string, icon: React.ReactNode) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className={`w-full h-11 pr-10 pl-3 rounded-xl border bg-white text-slate-800 text-right focus:outline-none focus:ring-2 transition ${
            errors[key]
              ? 'border-rose-300 focus:ring-rose-200'
              : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100'
          }`}
        />
      </div>
      {errors[key] && (
        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 mb-5 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        חזרה לרשימה
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="relative aspect-[4/3] bg-slate-100">
            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            <span
              className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 h-7 rounded-full text-xs font-bold shadow-sm ${
                available ? 'bg-emerald-500 text-white' : 'bg-slate-500/90 text-white'
              }`}
            >
              {available ? 'זמין' : 'מושאל'}
            </span>
          </div>
          <div className="p-5">
            <h1 className="text-xl font-extrabold text-slate-800">{item.name}</h1>
            <span className="inline-block mt-2 text-xs text-slate-600 font-medium bg-slate-100 px-2.5 py-1 rounded-md">
              {item.category}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 grid place-items-center mb-4">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">הבקשה נשלחה בהצלחה!</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                תיצור איתך קשר לאישור ההשאלה. תוכלי לעקוב אחר סטטוס הבקשה במסך הניהול.
              </p>
              <button
                onClick={onBack}
                className="mt-5 h-10 px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                חזרה לפריטים
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-800 mb-1">טופס בקשת השאלה</h2>
              <p className="text-sm text-slate-500 mb-5">מלאי את הפרטים וניצור איתך קשר.</p>
              {!available && (
                <div className="mb-4 flex items-center gap-2 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  הפריט כרגע מושאל. ניתן לשלוח בקשה ונצור קשר כשתתפנה.
                </div>
              )}
              {serverError && (
                <div className="mb-4 flex items-center gap-2 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {serverError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                {field('full_name', 'שם מלא', 'text', <User className="w-4 h-4" />)}
                {field('phone', 'טלפון', 'tel', <Phone className="w-4 h-4" />)}
                <div className="grid grid-cols-2 gap-3">
                  {field('start_date', 'תאריך התחלה', 'date', <CalendarDays className="w-4 h-4" />)}
                  {field('end_date', 'תאריך החזרה', 'date', <CalendarDays className="w-4 h-4" />)}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'שולח...' : 'שלחי בקשה'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
