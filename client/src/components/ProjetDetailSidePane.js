import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Feed, Progress, Button } from 'semantic-ui-react';

const FeedItem = ({ imgSrc, createdAt, content }) => {
  return (
    <Feed.Event>
      <Feed.Label image={imgSrc} />
      <Feed.Content>
        <Feed.Date content={createdAt} />
        <Feed.Summary>
          <label style={{ color: '#4183c4' }}> {content} </label>
        </Feed.Summary>
      </Feed.Content>
    </Feed.Event>
  );
};

const imgSrc = require('../assets/images/user.jpg');
const imgSrc1 = require('../assets/images/user-1.png');
const imgSrc2 = require('../assets/images/user-2.png');

const ProjectDetailSidePane = (props) => {
  let [randomColor, setRandomColor] = useState('purple');
  const reactHistory = useHistory();

  function getRandomColor() {
    if (props.disableFundNow) return 'purple';
    const pos = parseInt(Math.random() * 4);

    return 'green yellow purple blue violet'.split(' ')[pos];
  }

  randomColor = getRandomColor();

  useEffect(() => {
    const handle = setInterval(function () {
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
              title={
                props.disableFundNow
                  ? 'Only Investors are allowed to fund projects'
                  : 'Fund Now'
              }
              disabled={props.disableFundNow}
              color={randomColor}
              onClick={() => {
                if (!props.currentUser) {
                  alert('Please login to fund this project');
                  return;
                }

                window.open('https://paystack.com/pay/fund-it', '_self');
              }}
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
