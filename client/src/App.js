import React from 'react';

import 'sweetalert/dist/sweetalert.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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
import FundNowPage from './Pages/FundNowPage';
import PaymentPage from './Pages/PaymentPage';
import ManageProjectPage from './Pages/ManageProjectPage';
import ManageInvestmentsPage from './Pages/ManageInvestmentsPage';

import './styles/App.css';

const stripePromise = loadStripe('pk_test_AZLJ6GOzlzvtcrxBWn8WAqLh');

function App() {
  return (
    <Elements stripe={stripePromise}>
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

                <Route path="/me/manage-project/:projectId">
                  <ManageProjectPage />
                </Route>

                <Route path="/me/investments">
                  <ManageInvestmentsPage />
                </Route>

                <Route path="/settings">
                  <SettingsPage />
                </Route>

                <Route path="/create-project">
                  <CreateProjectPage />
                </Route>

                <Route path="/projects/:projectId/fund-now">
                  <FundNowPage />
                </Route>

                <Route path="/projects/:projectId/pay">
                  <PaymentPage />
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
    </Elements>
  );
}

export default App;
