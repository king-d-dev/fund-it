import React, { useEffect, useState } from 'react';
import { Table, Button } from 'semantic-ui-react';
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
        console.log('data', data.data);
        if (data.error) setErrorTo(data.error);
        else setInvestmentsTo(data.data);
      })
      .catch((error) => {
        setErrorTo(String(error));
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
          {loading ? <h3>Loading... </h3> : null}

          {investments ? (
            <Table color="green" key="green" size="large">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Project Title</Table.HeaderCell>
                  <Table.HeaderCell>Amount Invested</Table.HeaderCell>
                  <Table.HeaderCell>Project Owner</Table.HeaderCell>
                  <Table.HeaderCell>Date of Payment</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {investments.map((i) => (
                  <Table.Row key={i._id}>
                    <Table.Cell>{i._project.title}</Table.Cell>
                    <Table.Cell>{i.transactionDetails.amount}</Table.Cell>
                    <Table.Cell>{i._project._owner.fullName}</Table.Cell>
                    <Table.Cell>
                      {new Date(i.createdAt).toDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      {/* <Button basic color="blue">
                        View
                      </Button> */}
                      <div
                        css={css`
                          border-radius: 4px;
                          border: 1px solid blue;
                          text-align: center;
                          padding: 10px;
                        `}
                      >
                        <a href="">Show Investment Returns</a>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : null}
        </div>
      </div>
    </DashBoardLayout>
  );
}

export default ManageInvestmentsPage;

const styles = {
  container: css`
    flex-grow: 2;
    display: flex;
    flex-direction: column;
    padding: 20px;
  `,
  contentContainer: css`
    /* height: calc(100vh - ${window.headerHeight}); */
    /* background-color: blue; */
  `,
};
