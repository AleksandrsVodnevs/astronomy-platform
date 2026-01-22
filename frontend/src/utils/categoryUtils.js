export const CATEGORY_TRANSLATIONS = {
  'Planētas': 'Planets',
  'Galaktikas': 'Galaxies',
  'Kosmoss': 'Space',
  'Astrofizika': 'Astrophysics',
  'Novērojumi': 'Observations',
};

export const translateCategory = (cat, lang) => {
  if (lang === 'en') return CATEGORY_TRANSLATIONS[cat] || cat;
  return cat;
};

export const CATEGORIES_LV = ['Planētas', 'Galaktikas', 'Kosmoss', 'Astrofizika', 'Novērojumi'];
