(function () {
  try {
    var t = localStorage.getItem('tunistart-theme') || 'system';
    var d = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', d);
    var l = localStorage.getItem('tunistart-lang') || 'fr';
    if (l !== 'fr' && l !== 'en' && l !== 'ar') l = 'fr';
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  } catch (e) {}
})();
