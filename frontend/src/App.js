import Lobby from './components/Lobby.jsx'
import {
  BrowserRouter as Router, 
  Routes, 
  Route} from "react-router-dom"
import Room from './components/Room.jsx';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" Component={Lobby}>
          </Route>
          <Route path="/room/:roomID" Component={Room}>
          </Route>
        </Routes> 
    </Router>   
  );
}

export default App;
