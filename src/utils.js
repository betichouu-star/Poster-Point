export function formatINR(n){ return '₹' + (Number(n)||0).toFixed(2); }

// Offers: group sizes and free counts (larger groups first)
const OFFERS = [
  { group: 15, free: 5 },
  { group: 7, free: 2 },
  { group: 4, free: 1 }
];

function mapCategoryToType(cat){
  const c = String(cat||'').toUpperCase();
  if(c === 'SPLIT POSTERS') return 'SPLIT_POSTERS';
  if(c === 'BOOKMARK' || c === 'BOOKMARKS') return 'BOOKMARKS';
  if(c === 'FULLPAGE' || c === 'SINGLE STICKERS' || c.includes('STICKER')) return 'STICKERS';
  return 'POSTERS';
}

export function computeOfferForEntries(entries){
  if(!entries || entries.length === 0) return { applied:false };
  const cats = new Set(entries.map(e => String(e.category||'').toUpperCase()));
  const typesFromEntries = new Set(entries.map(e => mapCategoryToType(e.category)));
  if(cats.size !== 1 && typesFromEntries.size !== 1) return { applied:false };

  const totalQty = entries.reduce((s,e)=>s + (Number(e.qty)||0),0);
  if(totalQty <= 0) return { applied:false };

  let remaining = totalQty;
  let freeCount = 0;
  for(const o of OFFERS){
    const groups = Math.floor(remaining / o.group);
    if(groups>0){ freeCount += groups * o.free; remaining -= groups * o.group; }
  }
  if(freeCount <= 0) return { applied:false };

  // compute discount by freeing the cheapest units
  const unitPrices = [];
  entries.forEach(it => { for(let i=0;i<(it.qty||0);i++) unitPrices.push(Number(it.price||0)); });
  unitPrices.sort((a,b)=>a-b);
  const freeUnits = Math.min(freeCount, unitPrices.length);
  const discount = unitPrices.slice(0, freeUnits).reduce((s,v)=>s+v,0);

  let message;
  if(cats.size === 1) message = `${Array.from(cats)[0]} offer applied`;
  else message = `${Array.from(typesFromEntries)[0]} offer applied`;

  return { applied:true, freeCount, discount, message };
}
