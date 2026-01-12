import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { AppData } from '../../../context/AppContext.jsx';
import { Protocol } from "pmtiles";

const AreaLayer = ({map}) => {
  
  // Refs
  const initializedRef = useRef(false);

  // Context
  const { areas, setSelectedAreaPostcode, setIsSidebarVisible, setIsLoading } = AppData();
  
  let hoveredId = null;

  // Hooks
  useEffect(() => {
    if (!map || initializedRef.current) return;
    initializedRef.current = true;
    initializeLayer();
    
    return () => {
      if (map && map.isStyleLoaded()) {
        map.off("click", "postcodes-fill", clickHandler);
        map.off("mousemove", "postcodes-fill", mouseMoveHandler);
        map.off("mouseout", "postcodes-fill", mouseLeaveHandler);
      }
    }

  }, [map, areas]);

  // Handlers

  const mouseMoveHandler = (e) => {
    map.getCanvas().style.cursor = "pointer";
    if (e.features.length > 0) {
      // reset previous hover
      if (hoveredId !== null) {
        map.setFeatureState(
          { source: "postcodes-src", sourceLayer: "postcodes", id: hoveredId },
          { hover: false }
        );
      }

      // set new hover
      hoveredId = e.features[0].id ?? e.features[0].properties.id;
      map.setFeatureState(
        { source: "postcodes-src", sourceLayer: "postcodes", id: hoveredId },
        { hover: true }
      );
    }
  }

  const mouseLeaveHandler = (e) => {
    if (hoveredId !== null) {
      map.setFeatureState(
        { 
          "source": "postcodes-src",
          "sourceLayer": "postcodes",
          "id": hoveredId 
        },
        { "hover": false }
      );
    }
    hoveredId = null;
  }

  const clickHandler = (e) => {
    let areaFirstTwoLetters = e.features[0].properties.pc_area;
    setSelectedAreaPostcode(areaFirstTwoLetters);
    setIsSidebarVisible(true);
  }

  // Methods
  const initializeLayer = () => {
    console.log('Initializing area layer');
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile); 

      // Define value based styling rules
    map.addSource("postcodes-src", {"type": "vector", "url": `pmtiles://${import.meta.env.VITE_AREA_PMTILES_URL}`});     

    console.log(Object.keys(areas).flatMap(k => [k, areas[k].fillcolor]));

    map.addLayer({
      "id": "postcodes-fill",
      "type": "fill",
      "source": "postcodes-src",
      "source-layer": "postcodes",
      "paint": {
        "fill-opacity": [
          "case", 
          ["boolean", ["feature-state", "hover"], false],    
          [
            "match",
            ["get", "pc_area"], 
            ...Object.keys(areas).flatMap(k => [k, areas[k].hoveropacity]),
            1 // fallback hover
          ],             
          [
            "match",
            ["get", "pc_area"],
            ...Object.keys(areas).flatMap(k => [k, areas[k].fillopacity]),
            1 // fallback default
          ]           
        ],
        "fill-color": [
          "case", 
          ["boolean", ["feature-state", "hover"], false],    
          [
            "match",
            ["get", "pc_area"], 
            ...Object.keys(areas).flatMap(k => [k, areas[k].hovercolor]),
            "#ffcc00" // fallback hover
          ],             
          [
            "match",
            ["get", "pc_area"],
            ...Object.keys(areas).flatMap(k => [k, areas[k].fillcolor]),
            "#000" // fallback default
          ]           
        ]             
      }
    });
    map.addLayer({
      "id": "postcodes-outline",
      "type": "line",
      "source": "postcodes-src",
      "source-layer": "postcodes",
      "paint": {
        "line-color": "#808080",
        "line-width": 1,
      }
    });
         

    map.on("mousemove", "postcodes-fill", mouseMoveHandler);
    map.on("mouseleave", "postcodes-fill", mouseLeaveHandler);   
    map.on("click", "postcodes-fill", clickHandler);

    setIsLoading(false);

  }  

  return null;
}

export default AreaLayer;