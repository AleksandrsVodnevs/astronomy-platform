export const timeAgo = (dateStr, lang = 'lv') => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const lv = {
    justNow: 'Tikko',
    minAgo: (n) => n === 1 ? '1 min. atpakaļ' : `${n} min. atpakaļ`,
    hourAgo: (n) => n === 1 ? '1 st. atpakaļ' : `${n} st. atpakaļ`,
    yesterday: 'Vakar',
    at: 'plkst.',
  };
  const en = {
    justNow: 'Just now',
    minAgo: (n) => n === 1 ? '1 min ago' : `${n} min ago`,
    hourAgo: (n) => n === 1 ? '1 hour ago' : `${n} hours ago`,
    yesterday: 'Yesterday',
    at: 'at',
  };
  const t = lang === 'en' ? en : lv;
  const locale = lang === 'en' ? 'en-GB' : 'lv-LV';

  if (diffSec < 60) return t.justNow;
  if (diffMin < 60) return t.minAgo(diffMin);
  if (diffHour < 24) return t.hourAgo(diffHour);

  // Same week — show day name + time
  const dayOfWeek = date.getDay();
  const nowDayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((nowDayOfWeek + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  const timeStr = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  if (date >= startOfWeek && diffDay < 7) {
    if (diffDay === 1) return `${t.yesterday} ${t.at} ${timeStr}`;
    const dayName = date.toLocaleDateString(locale, { weekday: 'long' });
    const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    return `${capitalized} ${t.at} ${timeStr}`;
  }

  // Same year — show month + day
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  }

  // Different year — show full date
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
};
