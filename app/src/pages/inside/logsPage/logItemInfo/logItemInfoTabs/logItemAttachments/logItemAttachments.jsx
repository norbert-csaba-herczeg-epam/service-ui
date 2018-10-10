import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import classNames from 'classnames/bind';
import { ScrollWrapper } from 'components/main/scrollWrapper';

import { NoItemMessage } from '../noItemMessage';
import styles from './logItemAttachments.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  noAttachments: {
    id: 'Attachments.noAttachments',
    defaultMessage: 'No attachments to display',
  },
});

@injectIntl
export class LogItemAttachments extends Component {
  static propTypes = {
    logItem: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: false,
    };
  }

  renderAttachmentsGrid = (attachments) => (
    <div className={cx('attachments-grid')}>
      <div className={cx('header-row')}>
        <div className={cx('attachments-column')}>
          {this.props.intl.formatMessage(messages.keyHeader)}
        </div>
        <div className={cx('attachments-column')}>
          {this.props.intl.formatMessage(messages.valueHeader)}
        </div>
      </div>
      {attachments.map((item) => (
        <div key={item.key} className={cx('attachments-row')}>
          <div className={cx('attachments-column')}>{item.key}</div>
          <div className={cx('attachments-column')}>{item.value}</div>
        </div>
      ))}
    </div>
  );

  render() {
    return (
      <div className={cx('attachments')}>
        <ScrollWrapper autoHeight autoHeightMax={105} hideTracksWhenNotNeeded>
          {this.state.data && this.state.data.length ? (
            this.renderAttachmentsGrid(this.state.data)
          ) : (
            <NoItemMessage message={this.props.intl.formatMessage(messages.noAttachments)} />
          )}
        </ScrollWrapper>
      </div>
    );
  }
}
