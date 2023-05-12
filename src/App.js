import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HjemmesideView from './Views/HjemmesideView';
import NavBar from './components/NavBar/NavBar';
import GjøremålslisteView from './Views/GjøremålslisteView';
import ProfilView from './Views/ProfilView';
import LagprosjektView from './Views/LagprosjektView';
import MittprosjektView from './Views/MittprosjektView';
import ChatView from './Views/ChatView';
import MedlemmerView from './Views/MedlemmerView';
function App() {
  return (
    <BrowserRouter>
       <div className="App">
       <NavBar />
            { <Routes>
              <Route path="/" element={ <HjemmesideView />}/>
              <Route path="/Gjøremålsliste" element={ <GjøremålslisteView />}/>
              <Route path="/MittProsjekt" element={ <MittprosjektView />}/>
              <Route path="/Chat" element={ <ChatView />}/>
              <Route path="/Medlemmer" element={ <MedlemmerView/>}/>
              <Route path="/Lagprosjekt" element={ <LagprosjektView />}/>
              <Route path="/Profil" element={ <ProfilView />}/>
            </Routes> }
        </div>
    </BrowserRouter>
        );
      }
export default App;
