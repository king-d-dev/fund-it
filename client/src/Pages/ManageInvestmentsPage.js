import React, { useEffect, useState } from 'react';
import { Table } from 'semantic-ui-react';
import DashBoardLayout from '../components/DashBoardLayout';
import fundItApi from '../api/fundIt';
import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

function ManageInvestmentsPage() {
  const [investments, setInvestmentsTo] = useState(null);
  const [loading, setLoadingTo] = useState(false);
  const [error, setErrorTo] = useState('');

  useEffect(() => {
    setLoadingTo(true);

    fundItApi
      .get('/me/investments')
      .then(({ data }) => {
        setInvestmentsTo(data);
      })
      .catch((error) => {
        setErrorTo(error);
      })
      .finally(() => {
        setLoadingTo(false);
      });
  }, []);

  return (
    <DashBoardLayout>
      <div css={styles.container}>
        <h1>My Investments</h1>

        <div css={styles.contentContainer}>
          <Table color="green" key="green" size="large">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Amount Invested</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                <Table.Row>
                  <Table.Cell>Apples</Table.Cell>
                  <Table.Cell>200</Table.Cell>
                  <Table.Cell>
                    <a href="">Show Investment Returns</a>
                  </Table.Cell>
                </Table.Row>
              }
            </Table.Body>
          </Table>
        </div>
      </div>
    </DashBoardLayout>
  );
}

export default ManageInvestmentsPage;

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    padding: 20px;
  `,
  contentContainer: css`
    width: 100%;
    background-color: blue;
  `,
};
