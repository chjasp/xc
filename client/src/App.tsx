import "./App.css";
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import Tasks from "./pages/Tasks/Tasks";
import SensorDetails from "./pages/SensorDetails/SensorDetails";
import Sensors from "./pages/Sensors/Sensors";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Reports from "./pages/Reports/Reports";
import Profile from "./pages/Profile/Profile";
import { AuthProvider } from "./context/AuthContext";


const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
          <Switch>
            <Route exact path="/" component={Login} />
            <div className="app-inner">
              <Navbar />
              <Route exact path="/Tasks" component={Tasks} />
              <Route exact path="/Sensors" component={Sensors} />
              <Route exact path="/Reports" component={Reports} />
              <Route exact path="/Contact" component={Contact} />
              <Route exact path="/Profile" component={Profile} />
              <Route exact path="/SensorDetails/:id" component={SensorDetails} />
            </div>
          </Switch>
      </AuthProvider>
    </Router>
  );
};

export default App;
