import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import { redirect } from 'redux-first-router';
import classNames from 'classnames/bind';
import { C3Chart } from 'components/widgets/charts/common/c3chart';
import { PROJECT_LAUNCHES_PAGE } from 'controllers/pages';
import { activeProjectSelector } from 'controllers/user';
import { createFilterAction, updateFilterEntitiesAction } from 'controllers/filter';
import {
  CONDITION_CNT,
  CONDITION_HAS,
  ENTITY_NAME,
  ENTITY_TAGS,
} from 'components/filterEntities/constants';

import styles from './cumulativeTrendChart.scss';
import { CumulativeTrendTooltip } from './tooltip';
import { generateChartDataParams, generateChartColors, getColorForKey } from './generateConfig';

const cx = classNames.bind(styles);

const TAG_NAVIGATION_FILTER_ID = '-1';

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
  }),
  {
    redirect,
    createFilter: createFilterAction,
    updateFilterEntities: updateFilterEntitiesAction,
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
    createFilter: PropTypes.func,
    updateFilterEntities: PropTypes.func,
  };

  static defaultProps = {
    preview: false,
    height: 0,
    createFilter: () => {},
    updateFilterEntities: () => {},
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
    const { project, widget, createFilter, updateFilterEntities } = this.props;
    const tagName = Object.keys(widget.content.result)[d.index];

    // TODO: continue with click handler, logic below may not be thebest solution, possibly need a dedicated saga for navigation!
    // createFilter();
    // updateFilterEntities(TAG_NAVIGATION_FILTER_ID, [
    //   {
    //     value: tagName,
    //     condition: CONDITION_HAS,
    //     filtering_field: ENTITY_TAGS,
    //   },
    //   {
    //     value: '',
    //     condition: CONDITION_CNT,
    //     filtering_field: ENTITY_NAME,
    //   },
    // ]);

    // this.props.redirect({
    //   type: PROJECT_LAUNCHES_PAGE,
    //   payload: {
    //     projectId: project,
    //     filterId: TAG_NAVIGATION_FILTER_ID,
    //   },
    // });
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
            const prefix = widget.content_parameters.widgetOptions.prefix;
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

  renderContents = (d) => {
    const groupName = this.dataGroupNames[d[0].index];
    const itemsData = [];
    d.forEach((item) => {
      const messageKey = item.name.substr(0, item.name.lastIndexOf('$'));
      itemsData.push({
        id: item.id,
        color: getColorForKey(item.id),
        name: this.props.intl.formatMessage(messages[messageKey]),
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
