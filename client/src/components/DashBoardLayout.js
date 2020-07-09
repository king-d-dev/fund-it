import React, { useContext } from 'react';
import { Image } from 'semantic-ui-react';
import { Context as AuthContext } from '../context/authContext';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

function DashBoardPage({ children }) {
  const {
    state: { user },
  } = useContext(AuthContext);

  return (
    <div css={styles.container}>
      <div id="user-details" css={styles.userDetails}>
        <Image
          src={require('../assets/images/user-1.png')}
          size="small"
          style={{ borderRadius: '50%' }}
        />
        <h1> {user.fullName} </h1>
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
    width: 20%;
    background-color: #011b33;
    display: flex;
    padding: 20px 0;
    flex-direction: column;
    align-items: center;
    height: calc(100vh - ${window.headerHeight});
    border-right: 1px solid #eee;
  `,
};
