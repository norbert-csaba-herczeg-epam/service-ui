// @ts-check
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Carousel } from 'react-responsive-carousel';
import { connect } from 'react-redux';
import { attachmentsSelector } from 'controllers/attachments';
import 'react-responsive-carousel/lib/styles/carousel.css';

import styles from './attachments.scss';

const cx = classNames.bind(styles);

@connect((state) => ({
  attachments: attachmentsSelector(state),
}))
export default class Attachments extends React.Component {
  static defaultProps = {
    onClickItem: () => {},
  };
  static propTypes = {
    onClickItem: PropTypes.func,
    attachments: PropTypes.array.isRequired,
  };

  state = {
    mainAreaVisible: false,
  };

  onClickItem(itemIndex) {
    const selectedItem = this.props.attachments[itemIndex];
    this.props.onClickItem(selectedItem);
  }

  onClickThumb() {
    if (!this.state.mainAreaVisible) {
      this.setState({ mainAreaVisible: true });
    }
  }

  render = () => (
    <div
      className={cx({
        logAttachments: true,
        hideMainArea: !this.state.mainAreaVisible,
      })}
    >
      <Carousel
        emulateTouch
        showStatus={false}
        showIndicators={false}
        showArrows
        onClickThumb={() => this.onClickThumb()}
        onClickItem={(itemIndex) => this.onClickItem(itemIndex)}
      >
        {this.props.attachments.map((attachment) => (
          <div key={attachment.id} className={cx({ preview: true })}>
            <img className={cx({ preview: true })} src={attachment.src} alt={attachment.alt} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
