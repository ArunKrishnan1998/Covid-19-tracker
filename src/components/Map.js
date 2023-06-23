import React from 'react';
import './Map.css';
import {MapContainer, TileLayer} from 'react-leaflet';
import ChangeView from './../ChangeView';
import {showDataOnMap} from './../util.js';
function map({countries, caseType, center, zoom}) {
  return (
    <div className='map'>
            {console.log("map.... ", center, zoom)}

        <MapContainer center={center} zoom={zoom}>
            <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>Contributors'
            />
            {showDataOnMap(countries, caseType)}
        </MapContainer >
    </div>
  ) 
}

export default map