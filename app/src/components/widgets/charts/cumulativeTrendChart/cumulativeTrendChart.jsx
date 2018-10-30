import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import { redirect } from 'redux-first-router';
import classNames from 'classnames/bind';
import { C3Chart } from 'components/widgets/charts/common/c3chart';
import { chartConfigs } from 'common/constants/chartConfigs';
import { defectLinkSelector, statisticsLinkSelector } from 'controllers/testItem';
import { TEST_ITEM_PAGE } from 'controllers/pages';
import { activeProjectSelector } from 'controllers/user';

import styles from './cumulativeTrendChart.scss';
import { CumulativeTrendTooltip } from './tooltip';
import { generateChartDataParams, generateChartColors } from './generateConfig';

const cx = classNames.bind(styles);

// TODO: Possibly redundantmessage definition? See legend.jsx, launchesComparisonChart.jsx
const messages = defineMessages({
  statistics$executions$total: {
    id: 'FilterNameById.statistics$executions$total',
    defaultMessage: 'Total',
  },
  statistics$executions$passed: {
    id: 'FilterNameById.statistics$executions$passed',
    defaultMessage: 'Passed',
  },
  statistics$executions$failed: {
    id: 'FilterNameById.statistics$executions$failed',
    defaultMessage: 'Failed',
  },
  statistics$executions$skipped: {
    id: 'FilterNameById.statistics$executions$skipped',
    defaultMessage: 'Skipped',
  },
  statistics$defects$product_bug: {
    id: 'FilterNameById.statistics$defects$product_bug',
    defaultMessage: 'Product bug',
  },
  statistics$defects$automation_bug: {
    id: 'FilterNameById.statistics$defects$automation_bug',
    defaultMessage: 'Automation bug',
  },
  statistics$defects$system_issue: {
    id: 'FilterNameById.statistics$defects$system_issue',
    defaultMessage: 'System issue',
  },
  statistics$defects$no_defect: {
    id: 'FilterNameById.statistics$defects$no_defect',
    defaultMessage: 'No defect',
  },
  statistics$defects$to_investigate: {
    id: 'FilterNameById.statistics$defects$to_investigate',
    defaultMessage: 'To investigate',
  },
  ofTestCases: {
    id: 'Widgets.ofTestCases',
    defaultMessage: 'of test cases',
  },
});

@injectIntl
@connect(
  (state) => ({
    project: activeProjectSelector(state),
    getDefectLink: (params) => defectLinkSelector(state, params),
    getStatisticsLink: (name) => statisticsLinkSelector(state, { statuses: [name] }),
  }),
  {
    redirect,
  },
)
export class CumulativeTrendChart extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    widget: PropTypes.object.isRequired,
    preview: PropTypes.bool,
    height: PropTypes.number,
    container: PropTypes.instanceOf(Element).isRequired,
    observer: PropTypes.object.isRequired,
    project: PropTypes.string.isRequired,
    redirect: PropTypes.func.isRequired,
    getDefectLink: PropTypes.func.isRequired,
    getStatisticsLink: PropTypes.func.isRequired,
  };

  static defaultProps = {
    preview: false,
    height: 0,
  };

  state = {
    isConfigReady: false,
  };

  componentDidMount() {
    this.props.observer.subscribe('widgetResized', this.resizeChart);
    this.getConfig();
  }

  componentWillUnmount() {
    this.node.removeEventListener('mousemove', this.getCoords);
    this.props.observer.unsubscribe('widgetResized', this.resizeChart);
  }

  onChartCreated = (chart, element) => {
    this.chart = chart;
    this.node = element;

    if (!this.props.widget.content.result || this.props.preview) {
      return;
    }

    this.resizeChart();

    this.node.addEventListener('mousemove', this.getCoords);
  };

  onChartClick = (d) => {
    const { widget, getDefectLink, getStatisticsLink } = this.props;
    const name = d.id.split('$')[2];
    const id = widget.content.result[d.index].id;
    const defaultParams = this.getDefaultLinkParams(id);
    const defectLocator = chartConfigs.defectLocators[name];
    const link = defectLocator
      ? getDefectLink({ defects: [defectLocator], itemId: id })
      : getStatisticsLink(name);

    this.props.redirect(Object.assign(link, defaultParams));
  };

  getConfig = () => {
    const { widget, preview, container } = this.props;

    if (!widget || !widget.content || !widget.content.result) {
      return;
    }

    const { chartDataColumns, dataGroupNames } = generateChartDataParams(widget);
    const colors = generateChartColors(widget);

    this.dataGroupNames = dataGroupNames;
    this.height = container.offsetHeight;
    this.width = container.offsetWidth;

    this.config = {
      data: {
        columns: chartDataColumns,
        type: 'bar',
        onclick: this.onChartClick,
        colors,
      },
      axis: {
        x: {
          show: !preview,
          type: 'category',
          categories: this.dataGroupNames.map((category) => {
            const prefix = widget.content_parameters.widgetOptions.prefix[0];
            return category.indexOf(prefix) > -1 ? category.split(`${prefix}:`)[1] : category;
          }),
          tick: {
            centered: true,
            inner: true,
          },
        },
        y: {
          show: !preview,
        },
      },
      grid: {
        y: {
          show: !preview,
        },
      },
      size: {
        height: this.height,
      },
      interaction: {
        enabled: !preview,
      },
      padding: {
        top: preview ? 0 : 85,
      },
      legend: {
        show: false, // we use custom legend
      },
      tooltip: {
        grouped: false,
        position: this.getPosition,
        contents: this.renderContents,
      },
    };

    this.setState({
      isConfigReady: true,
    });
  };

  getPosition = (d, width, height) => {
    const rect = this.node.getBoundingClientRect();
    const left = this.x - rect.left - width / 2;
    const top = this.y - rect.top - height;

    return {
      top: top - 8,
      left,
    };
  };

  getDefaultLinkParams = (testItemIds) => ({
    payload: {
      projectId: this.props.project,
      filterId: 'all',
      testItemIds,
    },
    type: TEST_ITEM_PAGE,
  });

  getCoords = ({ pageX, pageY }) => {
    this.x = pageX;
    this.y = pageY;
  };

  resizeChart = () => {
    const newHeight = this.props.container.offsetHeight;
    const newWidth = this.props.container.offsetWidth;

    if (this.height !== newHeight) {
      this.chart.resize({
        height: newHeight,
      });
      this.height = newHeight;
    } else if (this.width !== newWidth) {
      this.chart.flush();
      this.width = newWidth;
    }
  };

  renderContents = (d, defaultTitleFormat, defaultValueFormat, color) => {
    const groupName = this.dataGroupNames[d[0].index];
    const itemsData = [];
    d.forEach((item) => {
      itemsData.push({
        id: item.id,
        color: color(item.id),
        name: this.props.intl.formatMessage(messages[item.name.split('$total')[0]]),
        value: item.value,
      });
    });
    return ReactDOMServer.renderToStaticMarkup(
      <CumulativeTrendTooltip groupName={groupName} itemsData={itemsData} />,
    );
  };

  render() {
    const { preview } = this.props;
    const classes = cx('cumulative-trend-chart', {
      'preview-view': preview,
    });
    return (
      <div className={classes}>
        {this.state.isConfigReady && (
          <C3Chart config={this.config} onChartCreated={this.onChartCreated} />
        )}
      </div>
    );
  }
}
