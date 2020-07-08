import React from 'react';
import DashBoardLayout from '../components/DashBoardLayout';
import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

function ManageProjectPage() {
  return (
    <DashBoardLayout>
      <h1>Hello</h1>
    </DashBoardLayout>
  );
}

export default ManageProjectPage;
