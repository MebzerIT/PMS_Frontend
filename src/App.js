import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HjemmesideView from './Views/HjemmesideView';
import NavBar from './components/NavBar/NavBar';
import GjøremålslisteView from './Views/GjøremålslisteView';
import ProfilView from './Views/ProfilView';
function App() {
  return (
    <BrowserRouter>
       <div className="App">
       <NavBar />
            { <Routes>
              <Route path="/" element={ <HjemmesideView />}/>
              <Route path="/Gjøremålsliste" element={ <GjøremålslisteView />}/>
              <Route path="/Profil" element={ <ProfilView />}/>
            </Routes> }
        </div>
    </BrowserRouter>
        );
      }
export default App;
