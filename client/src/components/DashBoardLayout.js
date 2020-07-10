import React, { useContext } from 'react';
import { Image, Button, Icon } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { Context as AuthContext } from '../context/authContext';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

function DashBoardPage({ children }) {
  const reactHistory = useHistory();
  const {
    state: { user },
  } = useContext(AuthContext);

  return (
    <div css={styles.container}>
      <div id="user-details" css={styles.userDetails}>
        <Image
          src={user.photo || require('../assets/images/user-1.png')}
          size="small"
          style={{ borderRadius: '50%' }}
        />
        <h1> {user.fullName} </h1>

        <div
          css={css`
            display: flex;
            flex-direction: column;
            height: 200px;
            padding: 10px;
            justify-content: space-around;
          `}
        >
          {user?.userType === 'solicitor' ? (
            <Button
              basic
              color="green"
              icon
              labelPosition="left"
              onClick={() => reactHistory.push('/create-project')}
            >
              <Icon name="add" />
              Create Project
            </Button>
          ) : null}

          <Button
            color="red"
            icon
            labelPosition="left"
            onClick={() => reactHistory.push('/sign-out')}
          >
            <Icon name="power" />
            Sign Out
          </Button>
        </div>
      </div>

      {children}
    </div>
  );
}

export default DashBoardPage;

const styles = {
  container: css`
    display: flex;
    background-color: #fdfdfd4d;
  `,
  userDetails: css`
    position: sticky;
    color: #fff;
    width: 25%;
    background-color: #011b33;
    display: flex;
    padding: 20px 0;
    flex-direction: column;
    align-items: center;
    height: calc(100vh - ${window.headerHeight});
    border-right: 1px solid #eee;
  `,
};
