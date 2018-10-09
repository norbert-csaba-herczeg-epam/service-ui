import classNames from 'classnames/bind';
import d3 from 'd3';
import { duration } from 'moment';

import { isValueInterrupted, transformCategoryLabel, getLaunchAxisTicks } from './chartUtils';
import styles from './launchesDurationChart.scss';
import { prepareChartData } from './prepareChartData';
import { DURATION } from './constants';
import { COLOR_CHART_DURATION, COLOR_FAILED } from '../../../common/constants/colors';

const cx = classNames.bind(styles);

export const getInitialChartConfig = (data, isPreview = false) => {
  const { timeType, chartData, itemData } = prepareChartData(data);

  return {
    data: {
      columns: [chartData],
      type: 'bar',
      colors: {
        [DURATION]: COLOR_CHART_DURATION,
      },
      groups: [[DURATION]],
      color: (color, d) => {
        if (itemData[d.index] && isValueInterrupted(itemData[d.index])) {
          return COLOR_FAILED;
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
        const el = document.querySelector(`.${cx('launches-duration-chart')}:hover`);
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
