import React from 'react'

export default function Header({onOpenCategories, onOpenShopType, cartCount, onOpenCart, search, onSearch}){
  // Theme toggle: reflect document theme and persist to localStorage
  const [theme, setTheme] = React.useState(() => {
    try{
      const saved = localStorage.getItem('pp-theme');
      if(saved) return saved;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }catch(e){ return 'light' }
  });

  React.useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
    try{ localStorage.setItem('pp-theme', theme) }catch(e){}
  },[theme]);

  function toggleTheme(){ setTheme(t => t === 'dark' ? 'light' : 'dark') }

  return (
    <header className="app-header" style={{display:'flex',alignItems:'center',padding:'12px 18px',gap:16,maxWidth:1100,margin:'0 auto'}}>
      <div className="logo" style={{display:'flex',alignItems:'center',gap:12}}>
        <img src="/assets/logo-48.png" alt="Poster Point" className="site-logo" style={{width:48,height:48,borderRadius:'50%'}} />
        <div>
          <div className="title blinking-text" style={{fontWeight:800,fontSize:22}}>Poster Point</div>
          <div className="subtitle" style={{fontSize:15,color:'var(--muted)'}}>Anime posters • stickers • bookmarks</div>
        </div>
      </div>
      <div style={{flex:1}} />
      <div className="nav-actions" style={{display:'flex',gap:12,alignItems:'center',flex:1}}>
        <button id="categories-btn" onClick={onOpenCategories} title="Categories" style={{background:'transparent',border:'none',padding:8,cursor:'pointer',fontSize:18}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button id="shop-type-btn" onClick={onOpenShopType} title="Shop by type" style={{background:'transparent',border:'none',padding:8,cursor:'pointer',fontSize:18}}>🛍️</button>
        <div className="search" style={{flex:1, minWidth:120, maxWidth:320, margin:'0 8px'}}>
          <input id="search-input" placeholder="Search posters, bookmarks, stickers..." value={search} onChange={e=>onSearch(e.target.value)} style={{width:'100%',padding:'7px 12px',borderRadius:8,border:'1px solid #ddd',fontSize:15,background: theme==='dark' ? '#222' : '#fff',color: theme==='dark' ? '#fff' : '#222'}} />
        </div>
        <button id="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" style={{background:'transparent',border:'none',padding:8,cursor:'pointer',fontSize:18}}>{theme === 'dark' ? '☀️' : '🌙'}</button>
        <button id="nav-cart-btn" onClick={()=>window.open('/cart.html','_blank')} style={{padding:'8px 10px',display:'flex',alignItems:'center',gap:8,background:'white',border:'1px solid #ccc',borderRadius:8,cursor:'pointer',color:'#333',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M3 3h2l.4 2M7 13h10l3-8H6.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span id="nav-cart-count" style={{fontWeight:700}}>{cartCount} items</span>
        </button>
      </div>
    </header>
  )
}
