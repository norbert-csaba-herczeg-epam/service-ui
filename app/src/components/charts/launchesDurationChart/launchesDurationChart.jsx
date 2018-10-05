import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import C3Chart from 'react-c3js';
import d3 from 'd3';
import { duration } from 'moment';

import {
  isValueInterrupted,
  validItemsFilter,
  getTimeType,
  transformCategoryLabel,
  getLaunchAxisTicks,
  getListAverage,
} from '../chartUtils';
import styles from './launchesDurationChart.scss';

const cx = classNames.bind(styles);

const DURATION = 'duration';
const barColor = '#557FD3';
const interruptedColor = '#f36c4a';

const prepareChartData = (data) => {
  const chartData = [DURATION];
  const itemData = [];
  let max = 0;
  const average = getListAverage(data.content.result);
  data.content.result.filter(validItemsFilter).forEach((item) => {
    const durationData = parseInt(item.values.duration, 10);
    const { id, name, number } = item;
    const { status, start_time, end_time } = item.values;
    max = durationData > max ? durationData : max;
    itemData.push({
      id,
      name,
      number,
      status,
      start_time,
      end_time,
      duration: durationData,
    });
    chartData.push(isValueInterrupted(item.values) ? average : durationData);
  });
  return {
    timeType: getTimeType(max),
    chartData,
    itemData,
  };
};

const getInitialChartConfig = (data, isPreview = false) => {
  const { timeType, chartData, itemData } = prepareChartData(data);

  return {
    data: {
      columns: [chartData],
      type: 'bar',
      colors: {
        [DURATION]: barColor,
      },
      groups: [[DURATION]],
      color: (color, d) => {
        if (itemData[d.index] && isValueInterrupted(itemData[d.index])) {
          return interruptedColor; // TODO: get value from scss!
        }
        return color;
      },
    },
    grid: {
      y: {
        show: !isPreview,
      },
    },
    axis: {
      rotated: true,
      x: {
        show: !isPreview,
        type: 'category',
        categories: itemData.map(transformCategoryLabel),
        tick: {
          values: getLaunchAxisTicks(itemData.length),
          width: 60,
          centered: true,
          inner: true,
          multiline: false,
          outer: false,
        },
      },
      y: {
        show: !isPreview,
        tick: {
          format: (d) => (parseInt(d, 10) / timeType.value).toFixed(2),
        },
        padding: {
          top: 0,
          bottom: 0,
        },
        label: {
          text: 'seconds',
          position: 'outer-center',
        },
      },
    },
    interaction: {
      enabled: !isPreview,
    },
    padding: {
      top: isPreview ? 0 : 20,
      left: isPreview ? 0 : 40,
      right: isPreview ? 0 : 20,
      bottom: isPreview ? 0 : 10,
    },
    legend: {
      show: false, // we use custom legend
    },
    tooltip: {
      grouped: true,
      position: (d, width, height) => {
        const el = document.querySelector(`.${cx('launches-duration-chart')}`);
        const position = d3.mouse(el);
        const left = position[0] - width / 2;
        const top = position[1] - height;
        return {
          top: top - 8, // 8 - offset for tooltip arrow
          left,
        };
      },
      contents: (tooltipData) => {
        const launchData = itemData[tooltipData[0].index];
        const abs = Math.abs(launchData.duration / timeType.value);
        const humanDuration = duration(abs, timeType.type).humanize(true);
        return `
          <div class="launch-name">${launchData.name} #${launchData.number}</div>
          <div class="launch-duration">${
            isValueInterrupted(launchData)
              ? launchData.text.widgets.launchInterrupted
              : humanDuration
          }</div>
        `;
      },
    },
  };
};

export class LaunchesDurationChart extends Component {
  static propTypes = {
    data: PropTypes.object,
    isPreview: PropTypes.bool,
  };

  static defaultProps = {
    data: {},
    isPreview: false,
  };

  constructor(props) {
    super(props);
    this.chartConfig = getInitialChartConfig(this.props.data);
  }

  render() {
    const classes = cx('launches-duration-chart', {
      'preview-view': this.props.isPreview,
    });
    return (
      <div className={classes}>
        <C3Chart {...this.chartConfig} />
      </div>
    );
  }
}
