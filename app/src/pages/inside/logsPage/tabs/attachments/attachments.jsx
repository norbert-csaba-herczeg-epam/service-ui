// @ts-check
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Carousel } from 'react-responsive-carousel';
import { connect } from 'react-redux';
import { attachmentsSelector } from 'controllers/attachments';
import 'react-responsive-carousel/lib/styles/carousel.css';

import { activeProjectSelector } from 'controllers/user';
import { openFileModal } from 'controllers/attachments/actionCreators';
import { URLS } from 'common/urls';
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
}

@connect(
  (state) => ({
    attachments: attachmentsSelector(state),
    projectId: activeProjectSelector(state),
  }),
  {
    openFileModal,
  },
)
export default class Attachments extends React.Component {
  static defaultProps = {
    openFileModal: () => {},
  };

  static propTypes = {
    attachments: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
    openFileModal: PropTypes.func,
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
      this.props.openFileModal({
        id: modalId,
        data: { projectId, binaryId, language },
      });
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
