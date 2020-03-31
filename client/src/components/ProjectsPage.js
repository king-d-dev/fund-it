import React, { useContext, useState, useEffect } from 'react';
import { Grid, Select, Checkbox } from 'semantic-ui-react';
import { Context as ProjectContext } from '../context/projectsContext';

import SearchBar from './SearchBar';
import Project from './Project';
import '../styles/ProjectsPage.css';

const sortOptions = [
  { key: 'a', value: 'title', text: 'Title' },
  { key: 'b', value: 'category', text: 'Category' }
];

function ProjectsPage() {
  const {
    state: { projects, categories }
  } = useContext(ProjectContext);

  const [filters, setFilters] = useState([]);
  const [localProjects, setLocalProjects] = useState(projects);

  const sortProjects = key => {
    const sortedProjects = Array.from(localProjects).sort((a, b) => {
      if (a[key] > b[key]) return 1;
      else if (a[key] < b[key]) return -1;
      else return 0;
    });

    setLocalProjects(sortedProjects);
  };

  useEffect(() => {
    if (filters.length)
      setLocalProjects(projects.filter(i => filters.includes(i.category)));
  }, [filters, projects]);

  const runFilters = (e, data) => {
    if (data.checked) setFilters([...filters, data.label]);
    else setFilters(filters.filter(i => i !== data.label));
  };

  return (
    <div id="ProjectsPage">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 25
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
      <div className="projects-wrapper">
        <div className="filters">
          <h3 style={{ textTransform: 'capitalize', color: '#979faf' }}>
            categories
          </h3>
          <div className="categories">
            {categories.map(i => (
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
  );
}

export default ProjectsPage;
