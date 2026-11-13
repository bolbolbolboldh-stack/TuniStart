import type { L10n } from '../domain/types'

/** The 24 governorates of Tunisia. Delegation/locality is kept as free text. */
export const governorates: { id: string; name: L10n }[] = [
  { id: 'ariana', name: { fr: 'Ariana', en: 'Ariana', ar: 'أريانة' } },
  { id: 'beja', name: { fr: 'Béja', en: 'Béja', ar: 'باجة' } },
  { id: 'ben-arous', name: { fr: 'Ben Arous', en: 'Ben Arous', ar: 'بن عروس' } },
  { id: 'bizerte', name: { fr: 'Bizerte', en: 'Bizerte', ar: 'بنزرت' } },
  { id: 'gabes', name: { fr: 'Gabès', en: 'Gabès', ar: 'قابس' } },
  { id: 'gafsa', name: { fr: 'Gafsa', en: 'Gafsa', ar: 'قفصة' } },
  { id: 'jendouba', name: { fr: 'Jendouba', en: 'Jendouba', ar: 'جندوبة' } },
  { id: 'kairouan', name: { fr: 'Kairouan', en: 'Kairouan', ar: 'القيروان' } },
  { id: 'kasserine', name: { fr: 'Kasserine', en: 'Kasserine', ar: 'القصرين' } },
  { id: 'kebili', name: { fr: 'Kébili', en: 'Kebili', ar: 'قبلي' } },
  { id: 'kef', name: { fr: 'Le Kef', en: 'Le Kef', ar: 'الكاف' } },
  { id: 'mahdia', name: { fr: 'Mahdia', en: 'Mahdia', ar: 'المهدية' } },
  { id: 'manouba', name: { fr: 'La Manouba', en: 'Manouba', ar: 'منوبة' } },
  { id: 'medenine', name: { fr: 'Médenine', en: 'Medenine', ar: 'مدنين' } },
  { id: 'monastir', name: { fr: 'Monastir', en: 'Monastir', ar: 'المنستير' } },
  { id: 'nabeul', name: { fr: 'Nabeul', en: 'Nabeul', ar: 'نابل' } },
  { id: 'sfax', name: { fr: 'Sfax', en: 'Sfax', ar: 'صفاقس' } },
  { id: 'sidi-bouzid', name: { fr: 'Sidi Bouzid', en: 'Sidi Bouzid', ar: 'سيدي بوزيد' } },
  { id: 'siliana', name: { fr: 'Siliana', en: 'Siliana', ar: 'سليانة' } },
  { id: 'sousse', name: { fr: 'Sousse', en: 'Sousse', ar: 'سوسة' } },
  { id: 'tataouine', name: { fr: 'Tataouine', en: 'Tataouine', ar: 'تطاوين' } },
  { id: 'tozeur', name: { fr: 'Tozeur', en: 'Tozeur', ar: 'توزر' } },
  { id: 'tunis', name: { fr: 'Tunis', en: 'Tunis', ar: 'تونس' } },
  { id: 'zaghouan', name: { fr: 'Zaghouan', en: 'Zaghouan', ar: 'زغوان' } },
]

export const getGovernorate = (id: string) => governorates.find((g) => g.id === id) ?? null
