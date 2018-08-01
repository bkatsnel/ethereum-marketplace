
import React from 'react'

import Shop from './Shop'
// import './Shop-Pure.css'

const ShopList = ({ shops, loading, loaded, onWatch=f=>f, onSelect=f=>f }) => {

    console.log("ShopList Enter")

    if (!loading && !loaded) {
        console.log("Shoplist Watch")
        onWatch()
    }

    return (
        <div className="cards">
            {loading ? <p>Loading Owners...</p> : loaded ? 
                shops.map((shop, i) => {
                 let shopWithSrc = { ...shop, src: `shop${i+1}.jpg`}
                 return <Shop key={i} {...shopWithSrc} onSelect={onSelect}/> }) :
                null
            }
        </div>
    )

}

export default ShopList