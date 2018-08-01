import React from 'react';
import { browserHistory } from 'react-router'

const goToProducts = (name, onSelect) => {
    console.log('On Offering Store Double Click', name)

    onSelect(name)

    var currentLocation = browserHistory.getCurrentLocation()

    if ('redirect' in currentLocation.query) {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    }

    browserHistory.push('/offerings')
}
// {/* <tr onDoubleClick={() => goToProducts(name, onSelect)}> */}
const Shop = ({name, src, logo, onSelect=f=>f }) =>  (
    <div className="card">
        <img src={src} alt={name} onDoubleClick={() => goToProducts(name, onSelect)} />
        <div className="card-title">
          <h2>{name}</h2> 
        </div>
        <div class="card-flap flap1">
            <div class="card-description">
                {logo}
            </div>
        </div>
    </div>
);
 
export default Shop;
