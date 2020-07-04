import React from 'react';

import 'sweetalert/dist/sweetalert.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Provider as AuthProvider } from './context/authContext';
import { Provider as ProjectsProvider } from './context/projectsContext';

import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ContactUs from './components/ContactUs';
import AboutUs from './components/AboutUs';
import ProjectsPage from './components/ProjectsPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import CreateProjectPage from './components/CreateProjectPage';
import SignOutPage from './components/SignOutPage';
import DashBoardPage from './components/DashBoardPage';
import SettingsPage from './components/SettingsPage';

import './styles/App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ProjectsProvider>
          <Router>
            <Header></Header>

            <Switch>
              <Route path="/sign-out">
                <SignOutPage />
              </Route>

              <Route path="/dashboard">
                <DashBoardPage />
              </Route>

              <Route path="/settings">
                <SettingsPage />
              </Route>

              <Route path="/create-project">
                <CreateProjectPage />
              </Route>

              <Route path="/projects/:projectId/fund-now">
                <div>Hello world</div>
              </Route>

              <Route path="/projects/:projectId">
                <ProjectDetailPage />
              </Route>

              <Route path="/projects">
                <ProjectsPage />
              </Route>

              <Route path="/about-us">
                <AboutUs />
              </Route>

              <Route path="/contact-us">
                <ContactUs />
              </Route>

              <Route path="/" exact>
                <LandingPage />
              </Route>
            </Switch>
          </Router>
        </ProjectsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
