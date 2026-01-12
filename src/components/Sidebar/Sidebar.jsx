import { useEffect, useState } from "react";
import { AppData } from "../../context/AppContext.jsx";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import parse from "html-react-parser";

const Sidebar = () => {
  // Global state
  const { isSidebarVisible, setIsSidebarVisible, agents, selectedAreaPostcode, setSelectedAreaPostcode } = AppData();

  // Local state
  const [filteredAgents, setFilteredAgents] = useState([]);

  // Handlers
  const sidebarClosedHandler = () => {
    setIsSidebarVisible(false);
  }

  // Hooks
  useEffect(() => {
    if(selectedAreaPostcode === null) { return }

    let filteredValues = agents.filter((agent) => {
      if(agent.agent_postcode.toLowerCase().trim().match(new RegExp(`^${selectedAreaPostcode}\\d{0,3}(?:\\s|$)`, "i")) !== null) {
        return true;
      }     
      else if (agent.agent_country.toLowerCase() === selectedAreaPostcode.toLowerCase()) {
        return true;
      }
      else if (agent.agent_city.toLowerCase() === selectedAreaPostcode.toLowerCase()) {
        return true;
      }      
      else
      {
        return false;
      }

    });

    setFilteredAgents(filteredValues)
  }, [selectedAreaPostcode]);



  return (
    <AnimatePresence>
      {isSidebarVisible && (
        <motion.div
          key="filterbox"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="z-30 absolute left-0 top-2 md:top-13 lg:top-20 md:pt-5 w-full md:w-1/2 lg:w-1/4 h-full 
          md:h-[calc(100%-5.5rem)] lg:h-[calc(100%-6rem)]"
        >        
          <div className="relative left-0 w-full md:w-full h-[calc(100%-2rem)] px-2 py-0 ">
            <div className="relative w-full h-full bg-white rounded-xl shadow-md border border-gray-300 flex flex-col z-10">
                
                {/* Header row */}
                <div className="flex items-center justify-between pl-4 pr-2 py-2 border-b border-gray-200">
                  <h2 className="tracking-wide text-sm font-medium font-semibold text-gray-500">{filteredAgents.length} Agent(s) in postcode area <strong>{selectedAreaPostcode}</strong></h2>
                  <button
                    onClick={sidebarClosedHandler}
                    className="py-1 text-gray-500 hover:text-red-500 cursor-pointer"
                    aria-label="Close filters"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
  
                {/* Main filter content */}
                <div className="rounded-br-xl rounded-bl-xl flex-1 w-full scrollbar-hide overflow-y-scroll px-0 py-0">
                  {
                  filteredAgents.length > 0 ? 
                    <ul className="list-none flex flex-col gap-y-0">
                      {
                        filteredAgents.map((agent) => (
                          <li className="cursor-pointer px-4 py-2 w-full flex flex-col odd:bg-gray-100 even:bg-white gap-y-1">
                            <h3 className="mb-2 font-semibold text-xl flex justify-between items-center">{agent.agent_name}
                              <span className="!text-lg">£{agent.agent_price}</span></h3>

                            <div className="flex flex-row items-center gap-x-2">
                              <span className="w-4 h-4">
                                <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                              </span>
                              <span className="text-sm">{agent.agent_address} {agent.agent_city} {agent.agent_postcode}</span>
                            </div>
                            <div className="flex flex-row items-center gap-x-2">
                              <span className="w-4 h-4">
                                <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                              </span>
                              <a className="text-sm" href={`mailto:${agent.agent_email}`}>{agent.agent_email}</a>
                            </div>
                            <div className="flex flex-row items-center gap-x-2">
                              <span className="w-4 h-4">
                                <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                              </span>                            
                              <a className="text-sm" href={`tel:${agent.agent_phone}`}>{agent.agent_phone}</a>
                            </div>
                            <hr class="border-gray-300 my-1" />
                            <div className="flex flex-row items-center gap-x-2">
                              <span className="w-4 h-4">
                              <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" stroke-linecap="round" stroke-linejoin="round"></path>
                              </svg>
                              </span>                            
                              <p className="text-sm">{parse(agent.agent_notes)}</p>
                            </div>                            
                          </li>
                        ))
                      }
                    </ul>
                  :
                  <ul className="h-full list-none flex items-center">
                    <li className="cursor-pointer px-4 py-2 w-full flex flex-col gap-y-1">
                      <div className="flex flex-col justify-center text-center">
                        <span className="h-12 w-12 m-auto mb-2">
                          <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" stroke-linecap="round" stroke-linejoin="round"></path>
                          </svg>
                        </span>
                        <p className="italic">No agents are located in this postcode</p>
                      </div>
                    </li>
                  </ul>
                  }
                  
                </div>
  


  
            </div>
          </div>      
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;