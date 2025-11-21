import React, {useEffect, useState, useCallback} from 'react'

import Header from './components/Header'
import ProductGrid from './components/ProductGrid'
import Cart from './components/Cart'
import CategoriesPanel from './components/CategoriesPanel'
import LegacyShopLayout from './components/LegacyShopLayout'
import ShopTypePanel from './components/ShopTypePanel'

export default function App(){
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState(() => {
    try{ return JSON.parse(localStorage.getItem('cart') || '[]') }catch(e){ return [] }
  })
  // Toggle for legacy layout
  const [showLegacy, setShowLegacy] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [showShopType, setShowShopType] = useState(false)
  const [showCart, setShowCart] = useState(false)

  useEffect(()=>{
    // Try to load products from the public manifest (converted from js/manifest.static.js)
    fetch('/data/products.json')
      .then(res => {
        if(!res.ok) throw new Error('manifest not found')
        return res.json()
      })
      .then(data => setProducts(data))
      .catch(() => {
        // If fetch fails, leave products empty — user can run the convert script to generate manifest
        setProducts([])
      })
  },[])

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart))
  },[cart])

  // update visible products when category or search changes
  const filteredProducts = products.filter(p => {
    if(activeCategory && p.category !== activeCategory) return false
    if(search && search.trim() !== ''){
      const q = search.trim().toLowerCase()
      const hay = `${p.name} ${p.id} ${p.category || ''} ${p.tags || ''}`.toLowerCase()
      if(!hay.includes(q)) return false
    }
    return true
  })

  // product: original product object
  // size: selected size string
  // price: per-item price (number)
  const addToCart = useCallback((product, size='A4', price=null) => {
    const unitPrice = price != null ? Number(price) : Number(product.price || 39)
    setCart(prev => {
      // find matching item by id + size
      const existingIdx = prev.findIndex(p => p.id === product.id && (p.size||'A4') === size)
      if(existingIdx !== -1){
        const copy = prev.slice();
        copy[existingIdx] = {...copy[existingIdx], qty: (copy[existingIdx].qty||1) + 1}
        return copy
      }
      return [...prev, {id: product.id, name: product.name, image: product.image, size, price: unitPrice, qty: 1}]
    })
  }, []);

  // remove one quantity of item with id+size; if qty>1 decrement, else remove
  function removeFromCart(id, size='A4'){
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === id && (p.size||'A4') === size)
      if(idx === -1) return prev
      const copy = prev.slice()
      if((copy[idx].qty||1) > 1){
        copy[idx] = {...copy[idx], qty: copy[idx].qty - 1}
      } else {
        copy.splice(idx,1)
      }
      return copy
    })
  }

  // set quantity of an item (by id+size) to a specific value; removes if qty<=0
  function changeQty(id, size='A4', qty){
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === id && (p.size||'A4') === size)
      if(idx === -1) return prev
      const copy = prev.slice()
      if(qty <= 0){
        copy.splice(idx,1)
      } else {
        copy[idx] = {...copy[idx], qty}
      }
      return copy
    })
  }

  function clearCart(){ setCart([]) }

  const categories = Array.from(new Set(products.map(p=>p.category))).filter(Boolean)
  const types = ["Posters", "Bookmarks", "Stickers"] // You can make this dynamic if needed
  const visible = filteredProducts

  return (
    <div className="app-root">
      <button style={{position:'fixed',top:8,right:8,zIndex:1000}} onClick={()=>setShowLegacy(v=>!v)}>
        {showLegacy ? 'Show Main App' : 'Show Legacy Layout'}
      </button>
      {showLegacy ? (
        <LegacyShopLayout />
      ) : (
        <>
          <Header
            onOpenCategories={()=>{ setShowCategories(true); setShowShopType(false); setShowCart(false); }}
            onOpenShopType={()=>{ setShowShopType(true); setShowCategories(false); setShowCart(false); }}
            onOpenCart={()=>{ setShowCart(true); setShowCategories(false); setShowShopType(false); }}
            cartCount={cart.reduce((s,i)=>s+i.qty,0)}
            search={search}
            onSearch={setSearch}
          />
          <div className="layout" style={{position:'relative', zIndex:1}}>
            {/* Overlay for sidebar panels */}
            {(showCategories || showShopType || showCart) && (
              <div id="sidebar-overlay" className="sidebar-overlay" aria-hidden="true" style={{zIndex:1199}} onClick={()=>{ setShowCategories(false); setShowShopType(false); setShowCart(false); }} />
            )}
            {/* Categories Panel */}
            {showCategories && (
              <aside className="categories-panel open">
                <div className="categories-header">
                  <div style={{ fontWeight: 800 }}>Categories</div>
                  <button aria-label="Close categories" style={{ background: "transparent", border: "none", color: "var(--muted)", fontSize: 18, cursor: "pointer" }} onClick={()=>setShowCategories(false)}>✕</button>
                </div>
                <div className="categories-body">
                  <CategoriesPanel categories={categories} onSelect={(c)=>{ setActiveCategory(c); setSearch(''); setShowCategories(false); }} />
                </div>
              </aside>
            )}
            {/* Shop Type Panel */}
            {showShopType && (
              <ShopTypePanel types={types} onSelect={()=>setShowShopType(false)} onClose={()=>setShowShopType(false)} />
            )}
            <main className="main-content">
              <div className="toolbar">
                <div id="offer-banner" style={{padding:'10px',background:'#fff',color:'#2b7a2b',borderRadius:8,fontWeight:700,fontSize:13,display:'inline-block',marginBottom:6,boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>Buy 3 Get 1 Free • Buy 5 Get 2 Free • Buy 10 Get 5 Free</div>
                <div className="summary" id="toolbar-summary">
                  {search && search.trim() !== '' ? `Search: "${search.trim()}" — ${visible.length} results` : (activeCategory? `Selected: ${activeCategory}` : 'Click a category to filter')}
                </div>
              </div>
              <section className="grid" id="product-grid">
                <ProductGrid products={visible.slice(0,100)} onAdd={addToCart} />
              </section>
            </main>
            {/* Cart Sidebar - render Cart component as sidebar when open */}
            {showCart && (
              <div style={{zIndex:2002, position:'fixed', top:0, right:0, bottom:0, left:'auto'}}>
                <Cart
                  items={cart}
                  onRemove={removeFromCart}
                  onClear={clearCart}
                  onChangeQty={changeQty}
                  onClose={()=>setShowCart(false)}
                />
              </div>
            )}
            {/* No floating hamburger/shop-type buttons; all actions are in header */}
          </div>
        </>
      )}
    </div>
  )
}
