import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import { AppData } from '../../context/AppContext.jsx';
import AreaLayer from '../Layers/AreaLayer/AreaLayer.jsx';
import LabelLayer from '../Layers/LabelLayer/LabelLayer.jsx';


const Map = () => {
  
  // Refs
  const mapContainer = useRef(null);
  const mapRef = useRef(null);  

  // Context
  const { map, setMap, mapReady, setMapReady, setIsSidebarVisible, isDataLoaded } = AppData();

  // Handlers
  const mapLoadHandler = () => {
    setMap(mapRef.current);
    setMapReady(true); 
    
    console.log("Zooming in on the UK...");
    
    mapRef.current.fitBounds([
      [import.meta.env.VITE_UKBNDS_LOWER_LEFT_LNG, import.meta.env.VITE_UKBNDS_LOWER_LEFT_LAT], 
      [import.meta.env.VITE_UKBNDS_UPPER_RIGHT_LNG, import.meta.env.VITE_UKBNDS_UPPER_RIGHT_LAT]
    ], 
    {
      "padding": 20
    });

    setTimeout(() => {
      mapRef.current.setMinZoom(mapRef.current.getZoom());
    }, 1000); 
  
  }

  const mapClickHandler = () => {
    setIsSidebarVisible(false);
  }

  // Hooks
  useEffect(() => {
    if (mapRef.current) return;

    const style = {
      version: 8,
      name: "Postcodes",
      glyphs: import.meta.env.VITE_MAP_GLYPH_URL,
      sources: {},
      layers: []
    };

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: [-2.5, 54.3],
      zoom: 5
    });  

    mapRef.current.addControl(new maplibregl.NavigationControl({showCompass: false}), "top-right");
    
    mapRef.current.on("load", mapLoadHandler);
    mapRef.current.on("click", mapClickHandler);

    return () => {
      if (mapRef.current && mapRef.current.isStyleLoaded()) {
        mapRef.current.off("load", mapLoadHandler);
        mapRef.current.on("click", mapClickHandler);
      }
    }

  }, []);
  
  return (
    <div className="absolute top-0 left-0 h-full map-wrap w-full mb-40 md:flex-1 md:mb-0 md:h-full ">
      <div ref={mapContainer} className="map h-full w-full absolute rounded-xl">
        {map && mapReady && isDataLoaded && <AreaLayer map={map} />}
        {map && mapReady && isDataLoaded && <LabelLayer map={map} />}
      </div>
    </div>    
  );


}

export default Map;