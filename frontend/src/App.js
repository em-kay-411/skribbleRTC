import Lobby from './components/Lobby.jsx'
import {
  BrowserRouter as Router, 
  Routes, 
  Route} from "react-router-dom"

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" Component={Lobby}>
          </Route>
        </Routes> 
    </Router>   
  );
}

export default App;
