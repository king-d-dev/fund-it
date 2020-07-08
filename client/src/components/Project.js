import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Image, Button } from 'semantic-ui-react';
import { Context as authContext } from '../context/authContext';

function Project({ data }) {
  const reactHistory = useHistory();
  const { state: authState } = useContext(authContext);

  const disableFundNow = () => {
    if (authState.user) return authState.user.userType === 'solicitor';

    return false;
  };

  return (
    <div className="Project" style={{ marginBottom: 40 }}>
      <div className="featured-projects">
        <Card>
          <Image src={data.photo} wrapped ui={false} />
          <Card.Content>
            <Card.Header>{data.title}</Card.Header>
            <Card.Meta>
              <span className="target">
                Amount Raised: GH₵{data.amountRaised}
              </span>
            </Card.Meta>
            <span className="target">
              Target:{' '}
              <strong>
                <span style={{ color: '#5fc9f8', fontSize: 16 }}>
                  GH₵ {data.fundTarget}
                </span>
              </strong>
            </span>
            <Card.Description>{data.desscription}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            {data._owner === authState.user?._id ? (
              <div className="ui two buttons">
                <Button
                  basic
                  color="green"
                  onClick={() =>
                    reactHistory.push({
                      pathname: `/me/manage-project/${data._id}`,
                      state: data,
                    })
                  }
                >
                  View
                </Button>
              </div>
            ) : (
              <div className="ui two buttons">
                <Button
                  basic
                  color="green"
                  disabled={disableFundNow()}
                  onClick={() => {
                    if (!authState.user) {
                      alert('Please login to fund this project');
                      return;
                    }

                    window.open('https://paystack.com/pay/fund-it', '_self');
                  }}
                >
                  Fund Now
                </Button>
                <Button
                  basic
                  color="blue"
                  onClick={() =>
                    reactHistory.push({
                      pathname: '/projects/123',
                      state: data,
                    })
                  }
                >
                  View
                </Button>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

export default Project;
