import React from 'react'

export default function Cart({items, onRemove, onClear, onChangeQty, onClose}){
  const total = items.reduce((s,i)=>s + (i.price||0)*i.qty,0)
  // compute simple group-based offers (buy 3 get 1, buy 5 get 2, buy 10 get 5)
  function computeOffers(){
    const counts = {}
    for(const it of items){ counts[it.id] = (counts[it.id]||0) + (it.qty||1) }
    const res = []
    for(const id of Object.keys(counts)){
      const cnt = counts[id]
      if(cnt >= 10) res.push({id, free: Math.floor(cnt/10)*5})
      else if(cnt >= 5) res.push({id, free: Math.floor(cnt/5)*2})
      else if(cnt >= 3) res.push({id, free: Math.floor(cnt/3)*1})
    }
    return res
  }

  const offers = computeOffers()

  return (
    <aside className="cart" id="cart">
      <div className="cart-header">
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{fontWeight:800}}>Cart</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{color:'var(--muted)', fontWeight:700}}>{items.length} items</div>
          <button id="cart-close-btn" onClick={onClose} className="sidebar-close">✕</button>
        </div>
      </div>
      <div className="cart-body">
        {items.length===0 && <div className="empty">Your cart is empty — add some posters!</div>}
        {items.map(it => (
          <div key={it.id + (it.size||'')} style={{display:'flex',alignItems:'center',gap:8,padding:8,borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
            <img src={it.image || `https://via.placeholder.com/80x80?text=${it.id}`} alt="thumb" style={{width:60,height:60,objectFit:'cover',borderRadius:6}} />
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{it.name}</div>
              <div style={{color:'var(--muted)'}}>Size: {it.size || 'A4'} • ₹{it.price}</div>
              <div style={{marginTop:6, display:'flex', gap:8, alignItems:'center'}}>
                <button onClick={()=>onChangeQty(it.id, it.size, (it.qty||1)-1)} style={{padding:'6px 8px',borderRadius:6}}>−</button>
                <div style={{minWidth:28,textAlign:'center',fontWeight:700}}>{it.qty}</div>
                <button onClick={()=>onChangeQty(it.id, it.size, (it.qty||1)+1)} style={{padding:'6px 8px',borderRadius:6}}>+</button>
              </div>
            </div>
            <button onClick={()=>onRemove(it.id, it.size)} style={{background:'transparent',border:'1px solid var(--muted)',padding:'6px 8px',borderRadius:8}}>Remove</button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        {offers.length>0 && (
          <div style={{marginBottom:12}}>
            <div style={{fontWeight:800}}>Offers Applied</div>
            {offers.map(o=> (
              <div key={o.id} style={{color:'var(--muted)'}}>- {o.free} free for {o.id}</div>
            ))}
          </div>
        )}
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
          <div style={{color:'var(--muted)'}}>Total</div>
          <div className="total">₹{total}</div>
        </div>
        <button onClick={()=>{
          const text = items.map(i=>`${i.name} (${i.size||'A4'}) x${i.qty} - ₹${i.price * (i.qty||1)}`).join('%0A')
          const url = `https://wa.me/?text=${encodeURIComponent('Hi, I want to buy:\n'+text+'\nTotal: ₹'+total)}`
          window.open(url,'_blank')
        }} className="checkout">Checkout via WhatsApp</button>
        <button onClick={()=>onClear()} style={{marginTop:8,width:'100%',padding:10,border:'1px solid var(--muted)',background:'transparent',borderRadius:8}}>Clear Cart</button>
      </div>
    </aside>
  )
}
