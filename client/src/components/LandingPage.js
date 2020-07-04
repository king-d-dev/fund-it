import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';

import '../styles/LandingPage.css';
import { Context as ProjectContext } from '../context/projectsContext';
import Project from './Project';

function LandingPage() {
  const {
    state: { projects, getProjects },
  } = useContext(ProjectContext);

  return (
    <div id="LandingPage">
      <div className="main-content">
        <div className="marketing-text-wrapper">
          <div className="marketng_text">
            <h3>Make a difference</h3>
            <label style={styles.label}>
              <span style={{ opacity: 100 }}>
                Big things start small. A new way to raise capital for your
                business idea. As an investor, a new way to keep your money busy
                for more returns.
              </span>
            </label>
          </div>
        </div>
        <div className="featured-projects-wrapper">
          <h2 style={styles.featredProjectsHeader}>Featured Projects</h2>
          <Grid>
            <Grid.Row columns={3}>
              {projects.map((proj, i) => (
                <Grid.Column key={i.toString()}>
                  <Project data={proj} />
                </Grid.Column>
              ))}
            </Grid.Row>
          </Grid>
        </div>
      </div>
    </div>
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
