// Guard protected routes: redirect to login if not authenticated
(function(){
  try{
    const current = window.location.pathname.split('/').pop() || 'index.html';
    // pages that do not require auth
    const publicPages = ['login.html', 'signup.html'];
    if (publicPages.includes(current)) return;

    const user = JSON.parse(localStorage.getItem('cc_current_user'));
    if (!user) {
      // preserve attempted page in 'next' param
      const next = encodeURIComponent(current);
      window.location.href = `login.html?next=${next}`;
    }
  }catch(e){ /* ignore errors */ }
})();
