import React from 'react';
import BannerAnim from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import 'assets/css/index.css';

import { css, jsx } from '@emotion/core';
// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

const { Element } = BannerAnim;
const BgElement = Element.BgElement;

function SliderElement() {
  return (
    <Element key="aaa" prefixCls="banner-user-elem">
      <BgElement key="bg" className="bg" css={styles.element} />
      <QueueAnim name="QueueAnim">
        <h1 key="h1">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        </h1>
        <p key="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
      </QueueAnim>
      <TweenOne
        animation={{ y: 50, opacity: 0, type: 'from', delay: 200 }}
        name="TweenOne"
      >
        Ant Motion Demo.Ant Motion Demo
      </TweenOne>
    </Element>
  );
}

export default SliderElement;

const styles = {
  element: css`
    background: url('https://i.imgur.com/C05wCJp.jpg') center center no-repeat;
    /* background-image: url(https://os.alipayobjects.com/rmsportal/IhCNTqPpLeTNnwr.jpg);
            background-size: cover;
            background-position: center; */
  `,
};
