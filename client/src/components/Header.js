import React, { useContext } from 'react';
import { Button, Dropdown, Image, Icon } from 'semantic-ui-react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { Context as authContext } from '../context/authContext';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import '../styles/Header.css';

let history;
window.headerHeight = '60px';

const options = [
  {
    key: 'dashboard',
    text: 'Dashboard',
    icon: 'dashboard',
    value: 'profile',
    route: '/dashboard',
  },
  {
    key: 'create project',
    text: 'Create Project',
    icon: 'add',
    value: 'create project',
    route: '/create-project',
  },
  {
    key: 'settings',
    text: 'Settings',
    icon: 'settings',
    value: 'settings',
    route: '/settings',
  },
  {
    key: 'sign-out',
    text: 'Sign Out',
    icon: 'sign out',
    value: 'sign-out',
    route: '/sign-out',
  },
];

const handleClick = (e, data) => {
  const option = data.options.find((i) => i.value === data.value);

  if (option) history.push(option.route);
};

function Header() {
  const { state: authState } = useContext(authContext);
  history = useHistory();

  const renderAuthStatus = () => {
    if (authState.token) {
      const defaultOption = {
        key: 'default',
        text: (
          <span>
            Signed in as <strong> {authState.user.fullName} </strong>
          </span>
        ),
        disabled: false,
      };

      const trigger = (
        <span style={{ fontWeight: 600 }}>
          <Image avatar src={require('../assets/images/user.jpg')} />{' '}
          {authState.user.fullName}
        </span>
      );

      return (
        <div>
          <Dropdown
            onChange={handleClick}
            trigger={trigger}
            options={[defaultOption, ...options]}
            pointing="top left"
            icon={<Icon name="dropdown" />}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Button.Group>
            <LoginPage />
            <Button.Or />
            <RegisterPage />
          </Button.Group>
        </div>
      );
    }
  };

  return (
    <div id="Header">
      <Link id="logo" to="/" style={{ color: '#000' }}>
        <h3>Fund it</h3>
      </Link>
      <div className="navs">
        <div className="nav-item">
          <NavLink to="/" exact>
            Home
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="/projects" exact>
            Projects
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="/about-us" exact>
            About Us
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="contact-us" exact>
            Contact Us
          </NavLink>
        </div>

        {renderAuthStatus()}
      </div>
    </div>
  );
}

export default Header;
