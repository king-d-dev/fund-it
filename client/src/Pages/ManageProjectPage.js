import React, { useEffect, useState } from 'react';
import DashBoardLayout from '../components/DashBoardLayout';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Table, Button } from 'semantic-ui-react';
import fundItApi from '../api/fundIt';
import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

function ManageProjectPage() {
  const [investments, setInvestmentsTo] = useState(null);
  const [loading, setLoadingTo] = useState(false);
  const [error, setErrorTo] = useState('');
  const params = useParams();
  const { state } = useLocation();

  useEffect(() => {
    setLoadingTo(true);

    fundItApi
      .get(`/projects/${params.projectId}/investors`)
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
        <h1>{state.title}</h1>

        <div css={styles.contentContainer}>
          {loading ? <h3>Loading... </h3> : null}

          {investments ? (
            <Table color="green" key="green" size="large">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Investor Name</Table.HeaderCell>
                  <Table.HeaderCell>Amount Invested</Table.HeaderCell>
                  <Table.HeaderCell>Date of Payment</Table.HeaderCell>
                  <Table.HeaderCell>Rate of Returns</Table.HeaderCell>
                  <Table.HeaderCell>Period of Returns Payment</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {investments.map((i) => (
                  <Table.Row key={i._id}>
                    <Table.Cell>{i._investor.fullName}</Table.Cell>
                    <Table.Cell>
                      GH₵ {i.transactionDetails.amount / 10}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(i.createdAt).toDateString()}
                    </Table.Cell>
                    <Table.Cell>{i._project.returnRate}%</Table.Cell>
                    <Table.Cell>{i._project.returnPeriod}</Table.Cell>
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

export default ManageProjectPage;

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
