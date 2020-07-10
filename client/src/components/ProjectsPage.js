import React, { useContext, useState, useEffect } from 'react';
import SweetAlert from 'sweetalert-react';
import { Grid, Select, Checkbox, Image } from 'semantic-ui-react';
import { Context as ProjectContext } from '../context/projectsContext';
import fundItApi from '../api/fundIt';
import SearchBar from './SearchBar';
import Project from './Project';
import '../styles/ProjectsPage.css';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

const sortOptions = [
  { key: 'a', value: 'title', text: 'Title' },
  { key: 'b', value: 'category', text: 'Category' },
];

function ProjectsPage() {
  const {
    state: { projects, categories, loading },
    getProjects,
  } = useContext(ProjectContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [filters, setFilters] = useState([]);
  const [localProjects, setLocalProjects] = useState(projects);

  // useEffect(() => {
  //   const params = new URL(document.location).searchParams;
  //   const reference = params.get('reference');
  //   console.log('ref', reference);

  //   if (reference) {
  //     fundItApi
  //       .get('/verify-transaction')
  //       .then((res) => {
  //         createProjectInvestment();
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, []);

  // function createProjectInvestment() {
  //   fundItApi
  //     .post(`projects/${state._id}/invest`)
  //     .then((res) => {})
  //     .catch((error) => {});
  // }

  useEffect(() => {
    getProjects(null, (error) => {
      if (error) setErrorMessage(error);
    });
  }, []);

  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  useEffect(() => {
    if (filters.length)
      setLocalProjects(projects.filter((i) => filters.includes(i.category)));
  }, [filters, projects]);

  const sortProjects = (key) => {
    const sortedProjects = Array.from(localProjects).sort((a, b) => {
      if (a[key] > b[key]) return 1;
      else if (a[key] < b[key]) return -1;
      else return 0;
    });

    setLocalProjects(sortedProjects);
  };

  const runFilters = (e, data) => {
    if (data.checked) setFilters([...filters, data.label]);
    else setFilters(filters.filter((i) => i !== data.label));
  };

  return (
    <React.Fragment>
      <SweetAlert
        show={!!errorMessage}
        type="error"
        title="Error"
        text={errorMessage}
        onConfirm={() => setErrorMessage('')}
      />

      <div id="ProjectsPage" css={styles.container}>
        <div css={styles.headContainer}>
          <SearchBar />
          <span style={{ marginRight: 50 }} />
          <Select
            placeholder="Sort By"
            options={sortOptions}
            onChange={(e, data) => sortProjects(data.value)}
          />
        </div>
        <div className="projects-wrapper" css={styles.projectsWrapper}>
          <div className="filters" css={styles.filtersContainer}>
            <h3 style={{ textTransform: 'capitalize', color: '#979faf' }}>
              categories
            </h3>
            <div className="categories">
              {categories.map((i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <Checkbox label={i} onChange={runFilters} />
                </div>
              ))}
            </div>
          </div>
          <div className="projects" css={styles.projects}>
            {projects.length === 0 ? (
              <Image size="large" src={require('../assets/images/empty.png')} />
            ) : null}

            <Grid>
              <Grid.Row columns={4}>
                {localProjects.map((proj, i) => (
                  <Grid.Column key={i.toString()}>
                    <Project data={proj} />
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>

            {/* {loading ? <h3>loading...</h3> : null} */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProjectsPage;

const styles = {
  container: css`
    padding: 20px 20px;
    background-color: #fdfdfd4d;
    display: flex;
    flex-direction: column;
  `,
  projectsWrapper: css`
    display: flex;
    margin-top: 20px;
  `,
  filtersContainer: css`
    padding: 20px;
    border-right: 1px solid #eee;
    height: calc(100vh - 200px);
  `,
  headContainer: css`
    display: flex;
    justify-content: center;
    padding: 25;
  `,
  projects: css`
    flex-grow: 2;
    padding-left: 20px;
    /* background-color: red; */
  `,
};
