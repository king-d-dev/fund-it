import React from 'react';
import BannerAnim from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import '../assets/css/index.css';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

const { Element } = BannerAnim;
const BgElement = Element.BgElement;

function Slider() {
  return (
    <BannerAnim autoPlay autoPlaySpeed={3000} autoPlayEffect={false}>
      <Element key="aaa" prefixCls="banner-user-elem">
        <BgElement key="bg" className="bg" css={styles.element} />
        <div css={styles.elementContentWrapper}>
          <div css={styles.textWrapper}>
            <QueueAnim name="QueueAnim">
              <h1 key="h1" css={styles.headingText}>
                Make a Difference
              </h1>
              <p key="p" css={styles.smallText}>
                Big things start small. A new way to raise capital for your
                business idea.
              </p>
            </QueueAnim>
            <TweenOne
              animation={{ y: 50, opacity: 0, type: 'from', delay: 300 }}
              name="TweenOne"
            >
              <span css={styles.smallText}>
                As an investor, a new way to keep your money busy for more
                returns.
              </span>
            </TweenOne>
          </div>
          <div>
            <img
              css={css`
                width: 600px;
                height: 600px;
              `}
              src={require('../assets/images/illustration.svg')}
            />
          </div>
        </div>
      </Element>

      <Element key="bbb" prefixCls="banner-user-elem">
        <BgElement key="bg" className="bg" css={styles.element} />
        <div css={styles.elementContentWrapper}>
          <div css={styles.textWrapper}>
            <QueueAnim name="QueueAnim">
              <h1 key="h1" css={styles.headingText}>
                Create Projects & receive funding.
              </h1>
              <p key="p" css={styles.smallText}>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris
              </p>
            </QueueAnim>
            <TweenOne
              animation={{
                y: 50,
                opacity: 0,
                type: 'from',
                delay: 300,
              }}
              name="TweenOne"
            >
              <span css={styles.smallText}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum
              </span>
            </TweenOne>
          </div>
          <img
            css={styles.image}
            src={require('../assets/images/illustration2.svg')}
          />
        </div>
      </Element>
    </BannerAnim>
  );
}

export default Slider;

const styles = {
  element: css`
    background: url('https://i.imgur.com/C05wCJp.jpg') center center no-repeat;
    display: none;
    /* background-image: url(https://os.alipayobjects.com/rmsportal/IhCNTqPpLeTNnwr.jpg);
            background-size: cover;
            background-position: center; */
  `,
  headingText: css`
    font-size: 80px;
    font-weight: 900;
    color: #fff;
  `,
  textWrapper: css`
    color: #fff;
    width: 50%;
    padding: 60px;
  `,
  smallText: css`
    font-size: 20px;
  `,
  image: css`
    width: 600px;
    height: 600px;
  `,
  elementContentWrapper: css`
    display: flex;
    flex-direction: row;
  `,
};
