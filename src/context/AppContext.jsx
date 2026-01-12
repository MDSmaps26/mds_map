import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from "papaparse";

let areaConfigURL = `https://docs.google.com/spreadsheets/d/e/${import.meta.env.VITE_MASTER_SHEET}/pub?output=csv&gid=${import.meta.env.VITE_AREAS_GSHEET_ID}`;
let agentDataURL = `https://docs.google.com/spreadsheets/d/e/${import.meta.env.VITE_MASTER_SHEET}/pub?output=csv&gid=${import.meta.env.VITE_AGENTS_GSHEET_ID}`;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [mapReady, setMapReady] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [agents, setAgents] = useState([]);
  const [areas, setAreas] = useState(null);
  const [selectedAreaPostcode, setSelectedAreaPostcode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const areasRaw = await fetch(areaConfigURL);
      const agentsRaw = await fetch(agentDataURL);

      const areasText = await areasRaw.text();
      const agentsText = await agentsRaw.text();

      // Parse CSV text into array of objects
      const parsedAreas = Papa.parse(areasText, { "header": true, "skipEmptyLines": true });
      const parsedAgents = Papa.parse(agentsText, { "header": true, "skipEmptyLines": true });   

      if(areas === null) {
        const areaDefs = {};
        parsedAreas.data.forEach((def) => {
          areaDefs[def.postcode_area] = {
            ...def
          };
          areaDefs[def.postcode_area].fillopacity = parseFloat(areaDefs[def.postcode_area].fillopacity);
          areaDefs[def.postcode_area].hoveropacity = parseFloat(areaDefs[def.postcode_area].hoveropacity);
        });

        setAreas(areaDefs);
      }

      if(agents.length === 0) {
        setAgents(parsedAgents.data);
      }
      setIsDataLoaded(true);
    }

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ 
      isLoading, setIsLoading,
      map, setMap,
      mapReady, setMapReady,
      isSidebarVisible, setIsSidebarVisible,
      areas, setAreas,
      agents, setAgents,
      selectedAreaPostcode, setSelectedAreaPostcode,
      isDataLoaded, setIsDataLoaded
    }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const AppData = () => useContext(AppContext);