import React, { useState } from 'react';
import { Input, Button } from 'semantic-ui-react';
import { useHistory, useParams } from 'react-router-dom';
import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

function FundNowPage() {
  const [amount, setAmountTo] = useState('');
  const reactHistory = useHistory();
  const { projectId } = useParams();

  return (
    <div css={styles.container}>
      <div css={styles.inputContainer}>
        <div className="ui right labeled input">
          <div className="ui basic label">GH₵</div>
          <input
            value={amount}
            onChange={(e) => setAmountTo(e.target.value)}
            size="huge"
            type="text"
            placeholder="Amount"
          />
          <div className="ui label">.00</div>
        </div>
        <Button
          color="blue"
          onClick={() => {
            if (!amount.trim() || isNaN(amount)) {
              alert('Please amount should be a number');
              return;
            }

            reactHistory.replace(`/projects/${projectId}/pay`, {
              amount: Number(amount),
            });
          }}
        >
          continue
        </Button>
      </div>
    </div>
  );
}

export default FundNowPage;

const styles = {
  container: css`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1b1b1b;
    height: calc(100vh - ${window.headerHeight});
  `,
  inputContainer: css`
    display: flex;
    justify-content: space-around;
    height: 50%;
    flex-direction: column;
    background-color: #fff;
    padding: 80px;
    border-radius: 5px;
  `,
};
