import React, { useContext, useEffect, useState } from 'react';
import { Image, Grid, Divider } from 'semantic-ui-react';
import SweetAlert from 'sweetalert-react';
import fundItApi from '../api/fundIt';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

import Project from './Project';
import { Context as AuthContext } from '../context/authContext';
import { Context as ProjectsContext } from '../context/projectsContext';

function DashBoardPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoadingTo] = useState(false);
  const [projects, setProjects] = useState(null);
  const {
    state: { user },
  } = useContext(AuthContext);
  // const {
  //   state: { projects },
  //   getUserProjects,
  // } = useContext(ProjectsContext);

  useEffect(() => {
    setLoadingTo(true);

    fundItApi
      .get(`/user/${user._id}/projects`)
      .then(({ data }) => {
        // dispatch({ type: SET_PROJECTS, payload: data.projects });
        setProjects(data.data);
      })
      .catch(({ response }) => {
        console.log(response.data);
        setErrorMessage(
          response?.data.data.error || 'something went wrong fetching the data'
        );
      })
      .finally(() => {
        setLoadingTo(false);
      });
  }, []);

  return (
    <>
      <SweetAlert
        show={!!errorMessage}
        type="error"
        title="Error"
        text={errorMessage}
        onConfirm={() => setErrorMessage('')}
      />

      <div css={styles.container}>
        <div id="user-details" css={styles.userDetails}>
          <Image
            src={require('../assets/images/user-1.png')}
            size="small"
            style={{ borderRadius: '50%' }}
          />
          <h1> {user.fullName} </h1>
        </div>

        <div id="user-projects-wrapper" css={styles.projectsContainer}>
          <h2>My Projects</h2>
          <div className="projects">
            {projects ? (
              <Grid>
                <Grid.Row columns={2}>
                  {projects.map((proj, i) => (
                    <Grid.Column key={i.toString()}>
                      <Project data={proj} />
                    </Grid.Column>
                  ))}
                </Grid.Row>
              </Grid>
            ) : (
              <h3>loading...</h3>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoardPage;

const styles = {
  container: css`
    display: flex;
    background-color: #fdfdfd4d;
  `,
  userDetails: css`
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
  projectsContainer: css`
    padding: 20px;
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
