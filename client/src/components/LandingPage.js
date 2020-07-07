import React, { useContext, useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import SweetAlert from 'sweetalert-react';
import { Context as ProjectContext } from '../context/projectsContext';
import Project from './Project';
import fundItApi from '../api/fundIt';
import '../styles/LandingPage.css';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

function LandingPage() {
  // const {
  //   state: { projects, getProjects },
  // } = useContext(ProjectContext);
  const [error, setError] = useState('');
  const [loading, setLoadingTo] = useState(false);
  const [data, setDataTo] = useState(null);

  useEffect(() => {
    setLoadingTo(true);
    fundItApi
      .get('/featured-projects')
      .then(({ data }) => {
        setDataTo(data.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoadingTo(false);
      });
  }, []);

  return (
    <>
      <SweetAlert
        show={!!error}
        type="error"
        title="Error"
        text={error}
        onConfirm={() => setError('')}
      />

      <div id="LandingPage">
        <div className="main-content">
          <div className="marketing-text-wrapper">
            <div className="marketng_text">
              <h3>Make a difference</h3>
              <label style={styles.label}>
                <span style={{ opacity: 100 }}>
                  Big things start small. A new way to raise capital for your
                  business idea. As an investor, a new way to keep your money
                  busy for more returns.
                </span>
              </label>
            </div>
          </div>
          <div className="featured-projects-wrapper">
            <h2 style={styles.featredProjectsHeader}>Featured Projects</h2>

            {data ? (
              <Grid>
                <Grid.Row columns={3}>
                  {data.map((proj, i) => (
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

export default LandingPage;

const styles = {
  label: {
    textAlign: 'center',
    backgroundColor: '#0000007d',
    padding: 8,
    borderRadius: 5,
    lineHeight: 1.3,
  },
  featredProjectsHeader: {
    textAlign: 'center',
    fontSize: '35px',
    marginBottom: 40,
  },
};
