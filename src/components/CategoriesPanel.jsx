import React from 'react'

export default function CategoriesPanel({categories = [], onSelect}){
  return (
    <div className="categories-body">
      <h3 style={{margin:0}}>Categories</h3>
      <ul style={{listStyle:'none',padding:0,marginTop:12}}>
        {categories.map(c => (
          <li key={c} style={{padding:'8px 10px',cursor:'pointer'}} onClick={()=>onSelect(c)}>{c}</li>
        ))}
      </ul>
    </div>
  )
}
