import React, { useContext, useEffect } from 'react';

import { Image, Grid, Divider } from 'semantic-ui-react';
import Project from './Project';
import { Context as AuthContext } from '../context/authContext';
import { Context as ProjectsContext } from '../context/projectsContext';

function DashBoardPage() {
  const {
    state: { user },
  } = useContext(AuthContext);
  const {
    state: { projects },
    getProjects,
  } = useContext(ProjectsContext);

  useEffect(() => {
    getProjects(null, (error) => {});
  });

  return (
    <div style={styles.container}>
      <div id="user-details" style={{ width: '50%', paddingRight: 25 }}>
        <Image
          src={require('../assets/images/user-1.png')}
          size="small"
          style={{ borderRadius: 4 }}
        />
        <h1> {user.fullName} </h1>
        <Divider />
      </div>

      <div id="user-projects-wrapper">
        <h2>My Projects</h2>
        <div className="projects">
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

export default DashBoardPage;

const styles = {
  container: {
    display: 'flex',
    padding: 25,
    backgroundColor: '#fdfdfd4d',
  },
};
