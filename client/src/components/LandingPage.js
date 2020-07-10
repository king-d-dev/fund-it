import React, { useContext, useState, useEffect } from 'react';
import { Grid, Image } from 'semantic-ui-react';
import SweetAlert from 'sweetalert-react';
import Project from './Project';
import fundItApi from '../api/fundIt';
import Slider from './Slider';
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
    <React.Fragment>
      <SweetAlert
        show={!!error}
        type="error"
        title="Error"
        text={error}
        onConfirm={() => setError('')}
      />

      <div id="LandingPage">
        <div className="main-content">
          <div css={styles.sliderWrapper}>
            <Slider />
          </div>

          <div className="featured-projects-wrapper">
            <h2 style={styles.featredProjectsHeader}>Featured Projects</h2>

            {data ? (
              <React.Fragment>
                {data.length === 0 ? (
                  <div style={{ marginLeft: 300 }}>
                    <Image
                      size="large"
                      src={require('../assets/images/empty.png')}
                    />
                    <h3 style={{ marginLeft: 150 }}>
                      Nothing here at the moment
                    </h3>
                  </div>
                ) : null}

                <Grid>
                  <Grid.Row columns={4}>
                    {data.map((proj, i) => (
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
      </div>

      <footer css={styles.footerWrapper}>
        <img
          css={css`
            height: 300px;
            width: 300px;
            padding: 0;
            margin: 0;
          `}
          src={require('../assets/images/funditt.png')}
        />

        <h3
          css={css`
            width: 40%;
            text-align: center;
            color: #fff;
            opacity: 0.5;
          `}
        >
          Fundit is a crowd funding investment website to get investments for
          your ideas. Bring your ideas to fruition by creating Projects and get
          people to fund it. Are you an investor? Make money by investing in
          good ideas.
        </h3>
      </footer>
    </React.Fragment>
  );
}

export default LandingPage;

const styles = {
  sliderWrapper: css`
    width: 100vw;
    height: calc(100vh - ${window.headerHeight});
    background: linear-gradient(45.34deg, #ea52f8 5.66%, #0066ff 94.35%);
  `,
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
  footerWrapper: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;
    padding-bottom: 140px;
    background-color: #1b1b1b;
  `,
};
