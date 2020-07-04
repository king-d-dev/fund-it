import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Header, Divider, Image } from 'semantic-ui-react';
import { Context as authContext } from '../context/authContext';
import ProjetDetailSidePane from './ProjetDetailSidePane';
import fundItApi from '../api/fundIt';

import '../styles/ProjectDetail.css';

function ProjectDetailPage(props) {
  const { state } = useLocation();
  const { state: authState } = useContext(authContext);

  useEffect(() => {
    const params = new URL(document.location).searchParams;
    console.log('params', params);
    const reference = params.get('reference');
    console.log('ref', reference);

    if (reference) {
      fundItApi
        .get('/verify-transaction')
        .then((res) => {
          createProjectInvestment();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  function createProjectInvestment() {
    fundItApi
      .post(`projects/${state._id}/invest`)
      .then((res) => {})
      .catch((error) => {});
  }

  const disableFundNow = () => {
    if (authState.user) return authState.user.userType === 'solicitor';

    return false;
  };

  return (
    <div id="ProjetDetail">
      <h2> {state.title} </h2>
      <div id="content">
        <div id="left-pane">
          <img
            className="project-img"
            alt="this is something nice"
            src={state.imgSrc}
          />
          {/* <div className="solicitor-info"></div> */}
          <div className="wrapper">
            <div className="meta-info">
              <span style={{ marginRight: 10 }}>
                <strong>Created By</strong>
              </span>
              <Image src={require('../images/user.jpg')} avatar />
              <span
                style={{ borderRight: '2px solid #dadada', paddingRight: 15 }}
              >
                Steven Grider
              </span>
              <label className="created-at" style={{ paddingLeft: 15 }}>
                <span> {state.createdAt} </span>
              </label>
              <label className="category">
                <strong> Category:</strong> <span> {state.category} </span>
              </label>
            </div>
            <Container text>
              <Header>Description</Header>
              <Divider />
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.5,
                }}
              >
                {state.description}
              </p>
            </Container>
          </div>
        </div>
        <div id="right-pane">
          <ProjetDetailSidePane
            currentUser={authState.user}
            project={state}
            disableFundNow={disableFundNow()}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
