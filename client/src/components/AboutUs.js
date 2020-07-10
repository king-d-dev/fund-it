import React from 'react';
import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

function AboutUs() {
  return (
    <div css={styles.container}>
      <p>about us</p>
    </div>
  );
}

export default AboutUs;

const styles = {
  container: css`
    display: flex;
  `,
};
