import React, { useState } from 'react';
import _ from 'lodash';
import faker from 'faker';
import { Search, Grid } from 'semantic-ui-react';

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.image.avatar(),
  price: faker.finance.amount(0, 100, 2, '$')
}));

function SearchBar(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');

  const handleResultSelect = (e, { result }) => setValue(result.title);

  const handleSearchChange = (e, { value }) => {
    setIsLoading(true);
    setValue(value);

    setTimeout(() => {
      const re = new RegExp(_.escapeRegExp(value), 'i');
      const isMatch = result => re.test(result.title);

      setIsLoading(false);
      setResults(_.filter(source, isMatch));
    }, 300);
  };

  return (
    <div id="SearchBar">
      <Grid>
        <Grid.Column>
          <Grid.Row width={10}>
            <Search
              placeholder="try searching by title, category or description"
              loading={isLoading}
              onResultSelect={handleResultSelect}
              onSearchChange={_.debounce(handleSearchChange, 500, {
                leading: true
              })}
              results={results}
              value={value}
              {...props}
            />
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default SearchBar;
