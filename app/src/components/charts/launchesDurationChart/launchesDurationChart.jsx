import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import C3Chart from 'react-c3js';

import styles from './launchesDurationChart.scss';
import { getInitialChartConfig } from './chartConfig';

const cx = classNames.bind(styles);

export const LaunchesDurationChart = ({ data, isPreview }) => {
  const chartConfig = getInitialChartConfig(data, isPreview);
  const classes = cx('launches-duration-chart', {
    'preview-view': isPreview,
  });
  return (
    <div className={classes}>
      <C3Chart {...chartConfig} />
    </div>
  );
};

LaunchesDurationChart.propTypes = {
  data: PropTypes.object,
  isPreview: PropTypes.bool,
};

LaunchesDurationChart.defaultProps = {
  data: {},
  isPreview: false,
};
