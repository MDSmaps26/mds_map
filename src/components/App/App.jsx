// App.jsx
import './App.css'
import Map from "../Map/Map.jsx"
import Sidebar from "../Sidebar/Sidebar.jsx"
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.jsx'

import { AppData } from '../../context/AppContext.jsx'

const App = () => {

  const { isLoading } = AppData();
  return (
    <div className="overflow-y-hidden relative h-full w-full flex">
      <Map></Map>
      <Sidebar />
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export default App;
