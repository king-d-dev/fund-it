import React, { useContext, useEffect, useState } from 'react';
import { Grid, Image } from 'semantic-ui-react';
import SweetAlert from 'sweetalert-react';
import fundItApi from '../api/fundIt';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

import Project from './Project';
import { Context as AuthContext } from '../context/authContext';
import DashBoardLayout from './DashBoardLayout';

function DashBoardPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoadingTo] = useState(false);
  const [projects, setProjects] = useState(null);
  const {
    state: { user },
  } = useContext(AuthContext);

  useEffect(() => {
    setLoadingTo(true);

    fundItApi
      .get(`/user/${user._id}/projects`)
      .then(({ data }) => {
        setProjects(data.data);
      })
      .catch(({ response }) => {
        if (typeof response.data === 'string') setErrorMessage(response.data);
        else
          setErrorMessage(
            response?.data.data.error ||
              'something went wrong fetching the data'
          );
      })
      .finally(() => {
        setLoadingTo(false);
      });
  }, []);

  console.log(projects);

  return (
    <DashBoardLayout>
      <SweetAlert
        show={!!errorMessage}
        type="error"
        title="Error"
        text={errorMessage}
        onConfirm={() => setErrorMessage('')}
      />

      <div id="user-projects-wrapper" css={styles.projectsContainer}>
        <h2>My Projects</h2>
        <div className="projects">
          {projects ? (
            <React.Fragment>
              {projects.length === 0 ? (
                <Image
                  size="large"
                  src={require('../assets/images/empty.png')}
                />
              ) : null}

              <Grid>
                <Grid.Row columns={2}>
                  {projects.map((proj, i) => (
                    <Grid.Column key={i.toString()}>
                      <Project data={proj} />
                    </Grid.Column>
                  ))}
                </Grid.Row>
              </Grid>
            </React.Fragment>
          ) : null}

          {loading ? <h3>loading...</h3> : null}
        </div>
      </div>
    </DashBoardLayout>
  );
}

export default DashBoardPage;

const styles = {
  projectsContainer: css`
    padding: 20px;
    width: 100%;
    padding-left: 80px;
  `,
  projects: css`
    /* display: flex; */
  `,
  emptyContent: css`
    align-self: center;
    text-align: center;
    margin-left: 20%;
  `,
};
