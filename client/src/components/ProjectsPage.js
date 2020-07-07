import React, { useContext, useState, useEffect } from 'react';
import SweetAlert from 'sweetalert-react';
import { Grid, Select, Checkbox } from 'semantic-ui-react';
import { Context as ProjectContext } from '../context/projectsContext';
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
    state: { projects, categories },
    getProjects,
  } = useContext(ProjectContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [filters, setFilters] = useState([]);
  const [localProjects, setLocalProjects] = useState(projects);

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

    console.log(projects);
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
    <>
      <SweetAlert
        show={!!errorMessage}
        type="error"
        title="Error"
        text={errorMessage}
        onConfirm={() => setErrorMessage('')}
      />

      <div id="ProjectsPage" css={styles.container}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: 25,
          }}
        >
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
          <div className="projects">
            <Grid>
              <Grid.Row columns={3}>
                {localProjects.map((proj, i) => (
                  <Grid.Column key={i.toString()}>
                    <Project data={proj} />
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectsPage;

const styles = {
  container: css`
    background-color: #fdfdfd4d;
    display: flex;
    flex-direction: column;
  `,
  projectsWrapper: css`
    display: flex;
    flex: 2px;
    margin-top: 20px;
    justify-content: center;
  `,
  filtersContainer: css`
    width: 600px;
    padding: 20px;
  `,
};
