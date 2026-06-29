
// Dark Mode Toggle

  (function() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeBtn').textContent = saved === 'dark' ? '🌙 ' : '☀️';
    console.log('Theme set to', saved);
  })();


  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    console.log('Toggling theme from', current, 'to', next);
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    document.getElementById('themeBtn').textContent = next === 'dark' ? '🌙 ' : '☀️';
  }






