import React from 'react'

function ProductCard({p, onAdd, onImageClick}){
  const [size, setSize] = React.useState('A4');
  // determine if this item should show size options (posters)
  const catUpper = String(p.category||'').toUpperCase();
  const showSizes = !(catUpper === 'BOOKMARK' || catUpper === 'SINGLE STICKERS' || catUpper === 'FULLPAGE');

  function getPriceForSize(){
    let price = Number(p.price || 39);
    if(showSizes){
      if(size === 'A3') price = 69;
      else if(size === 'A5') price = 25;
      else if(size === 'Pocket') price = 10;
      else if(size === '4x6') price = 19;
      else price = Number(p.price || 39);
    }
    return price;
  }

  function handleAdd(){
    const price = getPriceForSize();
    onAdd(p, size, price);
  }

  return (
    <div className="card product-card" style={{boxShadow:'0 2px 8px rgba(0,0,0,0.04)', border:'1px solid #eee', borderRadius:12, padding:0, overflow:'hidden', minHeight:380}}>
      <div className="product-image" style={{height:260, background:'#f4f4f4', borderRadius:'12px 12px 0 0', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', cursor:'zoom-in'}} onClick={()=>onImageClick(p)}>
        <img src={p.image || `https://via.placeholder.com/320x240?text=${encodeURIComponent(p.id)}`} alt={p.name} style={{width:'100%', height:'100%', objectFit:'contain', display:'block'}} />
      </div>
      <div style={{padding:'12px 14px 10px'}}>
        <div style={{fontWeight:800, fontSize:16, marginBottom:2}}>{p.name} <small style={{color:'#666', fontWeight:600, fontSize:12}}>• {p.id}</small></div>
        <div style={{color:'var(--muted)', fontWeight:600, fontSize:15}}>₹{getPriceForSize()}</div>
        {showSizes && (
          <div style={{marginTop:8}}>
            <select value={size} onChange={e=>setSize(e.target.value)} style={{padding:6,borderRadius:8, fontWeight:600, fontSize:14}}>
              <option value="A4">A4 - ₹39</option>
              <option value="A3">A3 - ₹69</option>
              <option value="A5">A5 - ₹25</option>
              <option value="Pocket">Pocket - ₹10</option>
              <option value="4x6">4x6 - ₹19</option>
            </select>
          </div>
        )}
        <div style={{marginTop:12}}>
          <button className="buy-btn" style={{width:'100%', fontWeight:700, fontSize:15, padding:'10px 0'}} onClick={handleAdd}>Buy now</button>
        </div>
      </div>
    </div>
  )
}

export default function ProductGrid({products, onAdd}){
  const [zoomed, setZoomed] = React.useState(null);
  if(!products || products.length===0) return <div style={{padding:20}}>No products found.</div>;
  return (
    <>
      <div className="grid">
        {products.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} onImageClick={setZoomed} />)}
      </div>
      {zoomed && (
        <div style={{position:'fixed',zIndex:2000,top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setZoomed(null)}>
          <img src={zoomed.image || `https://via.placeholder.com/800x600?text=${encodeURIComponent(zoomed.id)}`} alt={zoomed.name} style={{maxWidth:'90vw',maxHeight:'90vh',borderRadius:16,boxShadow:'0 8px 32px rgba(0,0,0,0.4)',background:'#fff',padding:8}} />
        </div>
      )}
    </>
  );
}
