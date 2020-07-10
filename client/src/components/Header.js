import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Image, Icon } from 'semantic-ui-react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { Context as authContext } from '../context/authContext';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import '../styles/Header.css';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

let history;
window.headerHeight = '60px';

let options = [
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
  const [optionsState, setOptionsState] = useState(options);
  const { state: authState } = useContext(authContext);
  history = useHistory();

  useEffect(() => {
    if (authState.user?.userType === 'investor') {
      let o = options.filter((i) => i.key !== 'create project');

      o = o.map((i) => {
        if (i.key === 'dashboard') return { ...i, route: '/me/investments' };
        else return i;
      });

      setOptionsState(o);
    } else if (authState.user?.userType === 'solicitor') {
      setOptionsState(options);
    }
  }, [authState.user]);

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
          <Image
            avatar
            src={authState.user.photo || require('../assets/images/user.jpg')}
          />{' '}
          {authState.user.fullName}
        </span>
      );

      return (
        <div>
          <Dropdown
            onChange={handleClick}
            trigger={trigger}
            options={[defaultOption, ...optionsState]}
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
      <Link id="logo" to="/">
        <Image size="small" src={require('../assets/images/funditt.png')} />
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
          {/* <NavLink to="contact-us" exact>
            Contact Us
          </NavLink> */}
        </div>

        {renderAuthStatus()}
      </div>
    </div>
  );
}

export default Header;
