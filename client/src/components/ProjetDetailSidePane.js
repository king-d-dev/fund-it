import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Feed, Progress, Button } from 'semantic-ui-react';

const FeedItem = ({ imgSrc, createdAt, content }) => {
  return (
    <Feed.Event>
      <Feed.Label image={imgSrc} />
      <Feed.Content>
        <Feed.Date content={createdAt} />
        <Feed.Summary>
          <a> {content} </a>
        </Feed.Summary>
      </Feed.Content>
    </Feed.Event>
  );
};

const imgSrc = require('../images/user.jpg');
const imgSrc1 = require('../images/user-1.png');
const imgSrc2 = require('../images/user-2.png');

const ProjectDetailSidePane = props => {
  let [randomColor, setRandomColor] = useState('purple');
  const reactHistory = useHistory();

  function getRandomColor() {
    if (props.disableFundNow) return 'purple';
    const pos = parseInt(Math.random() * 4);

    return 'green yellow purple blue violet'.split(' ')[pos];
  }

  const navigate = () =>
    reactHistory.push({
      pathname: '/projects/123/fund-now'
    });

  randomColor = getRandomColor();

  useEffect(() => {
    const handle = setInterval(function() {
      setRandomColor(getRandomColor());
    }, 1000);

    return () => {
      clearInterval(handle);
    };
  });

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          <Progress color="green" percent={80} size="tiny">
            <span className="progress-content">
              <span className="raised-amt">GH₵1500 </span>
              raised of GH₵4000
            </span>
          </Progress>
          <div className="ui two buttons" style={{ marginTop: 20 }}>
            <Button
              disabled={props.disableFundNow}
              color={randomColor}
              onClick={navigate}
            >
              Fund Now
            </Button>
          </div>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <Feed>
          <FeedItem
            imgSrc={imgSrc}
            createdAt="2 days ago"
            content="Jim Hoskins invested GH₵300"
          />
          <FeedItem
            imgSrc={imgSrc1}
            createdAt="8 days ago"
            content="Craige Dennis invested GH₵100"
          />
          <FeedItem
            imgSrc={imgSrc2}
            createdAt="12 months ago"
            content="Alena Mills invested GH₵500"
          />
        </Feed>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button basic color="green">
            see all investors
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ProjectDetailSidePane;
