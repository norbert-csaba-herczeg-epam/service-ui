// @ts-check
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Carousel } from 'react-responsive-carousel';
import { connect } from 'react-redux';
import { attachmentsSelector } from 'controllers/attachments';
import 'react-responsive-carousel/lib/styles/carousel.css';
import { activeProjectSelector } from 'controllers/user';
import { URLS } from 'common/urls';
import {
  GET_ATTACHMENT_IMAGE,
  GET_ATTACHMENT_HAR,
  GET_ATTACHMENT_BINARY,
} from 'controllers/attachments/constants';

import styles from './attachments.scss';

const cx = classNames.bind(styles);
const supportedLanguages = ['xml', 'javascript', 'json', 'css', 'php', 'har'];
const getModalId = (isImage, language) => {
  if (isImage) {
    return 'attachmentImageModal';
  } else if (language === 'har') {
    return 'attachmentHarFileModal';
  }
  return 'attachmentCodeModal';
};

@connect(
  (state) => ({
    attachments: attachmentsSelector(state),
    projectId: activeProjectSelector(state),
  }),
  (dispatch) => ({
    openImageModal: (data) => dispatch({ type: GET_ATTACHMENT_IMAGE, data }),
    openHarModal: (data) => dispatch({ type: GET_ATTACHMENT_HAR, data }),
    openBinaryModal: (data) => dispatch({ type: GET_ATTACHMENT_BINARY, data }),
  }),
)
export default class Attachments extends React.Component {
  static defaultProps = {
    openImageModal: () => {},
    openHarModal: () => {},
    openBinaryModal: () => {},
  };

  static propTypes = {
    attachments: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
    openImageModal: PropTypes.func,
    openHarModal: PropTypes.func,
    openBinaryModal: PropTypes.func,
  };

  state = {
    mainAreaVisible: false,
  };

  onClickItem(itemIndex) {
    const { attachments, projectId } = this.props;
    const selectedItem = attachments[itemIndex];
    const contentType = selectedItem.attachment.content_type;
    const binaryId = selectedItem.id;
    const language = contentType.split('/')[1];
    const isImage = contentType.indexOf('image/') > -1;
    const isValidForModal = supportedLanguages.indexOf(language) > -1 || isImage;
    const modalId = getModalId(isImage, language);

    if (isValidForModal) {
      const data = { projectId, binaryId, language };
      switch (modalId) {
        case 'attachmentImageModal':
          this.props.openImageModal(data);
          break;
        case 'attachmentHarFileModal':
          this.props.openHarModal(data);
          break;
        default:
          this.props.openBinaryModal(data);
      }
    } else {
      window.open(URLS.getFileById(projectId, binaryId));
    }
  }

  onClickThumb() {
    if (!this.state.mainAreaVisible) {
      this.setState({ mainAreaVisible: true });
    }
  }

  render = () => (
    <div className={cx('attachments-wrap')}>
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
    </div>
  );
}
