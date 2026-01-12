import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { AppData } from '../../../context/AppContext.jsx';
import { PMTiles, Protocol } from "pmtiles";

const LabelLayer = ({map}) => {
  
  // Refs
  const initializedRef = useRef(false);

  // Context
  const { setSelectedAreaPostcode, setIsSidebarVisible } = AppData();
  
  let hoveredId = null;

  // Hooks
  useEffect(() => {
    if (!map || initializedRef.current) return;
    initializedRef.current = true;
    initializeLayer();
    
    return () => {
      if (map && map.isStyleLoaded()) {

      }
    }

  }, [map]);

  // Methods
  const initializeLayer = () => {
    console.log('Initializing label layer');

    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile); 

      // Define value based styling rules
    if(typeof map.getSource("postcodes-src") === "undefined") {
      map.addSource("postcodes-src", {"type": "vector", "url": `pmtiles://${import.meta.env.VITE_AREA_PMTILES_URL}`});     
    }

    map.addLayer({
      "id": "postcodes-points",
      "type": "symbol",
      "source": "postcodes-src",
      "source-layer": "postcodes_points",
      "minzoom": 3,
      "layout": {
        "text-allow-overlap": false,
        "text-field": ["get", "pc"],
        "text-font": ["Open Sans Regular"],
        "text-letter-spacing": 0.1,
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 7,    // at zoom level 5 → font size 10
          8, 14,    // at zoom level 8 → font size 14
          12, 20    // at zoom level 12 → font size 20
        ]
      },
      "paint": {
        "text-color": "#000",
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 2          
      }
    });
  }  

  return null;
}

export default LabelLayer;