import * as COLORS from 'common/constants/colors';

export const generateChartDataParams = (widget) => {
  const chartDataColumns = [];
  const dataGroupNames = [];

  const passed = ['statistics$executions$passed'];
  const failed = ['statistics$executions$failed'];
  const skipped = ['statistics$executions$skipped'];
  const pb = ['statistics$defects$product_bug$total'];
  const ab = ['statistics$defects$automation_bug$total'];
  const si = ['statistics$defects$system_issue$total'];
  const nd = ['statistics$defects$no_defect$total'];
  const ti = ['statistics$defects$to_investigate$total'];

  widget.content.result.forEach((item) => {
    dataGroupNames.push(item.id); // .id ?
    Object.keys(item.values).forEach((key) => {
      const value = item.values[key];
      switch (key) {
        case passed[0]:
          passed.push(value);
          break;
        case failed[0]:
          failed.push(value);
          break;
        case skipped[0]:
          skipped.push(value);
          break;
        case pb[0]:
          pb.push(value);
          break;
        case ab[0]:
          ab.push(value);
          break;
        case si[0]:
          si.push(value);
          break;
        case nd[0]:
          nd.push(value);
          break;
        case ti[0]:
          ti.push(value);
          break;
        default:
          break;
      }
    });
  });

  // pushing data in correct order
  widget.content.result[0].values.statistics$executions$passed && chartDataColumns.push(passed);
  widget.content.result[0].values.statistics$executions$failed && chartDataColumns.push(failed);
  widget.content.result[0].values.statistics$executions$skipped && chartDataColumns.push(skipped);
  widget.content.result[0].values.statistics$defects$product_bug$total && chartDataColumns.push(pb);
  widget.content.result[0].values.statistics$defects$automation_bug$total &&
    chartDataColumns.push(ab);
  widget.content.result[0].values.statistics$defects$system_issue$total &&
    chartDataColumns.push(si);
  widget.content.result[0].values.statistics$defects$no_defect$total && chartDataColumns.push(nd);
  widget.content.result[0].values.statistics$defects$to_investigate$total &&
    chartDataColumns.push(ti);

  return {
    chartDataColumns,
    dataGroupNames,
  };
};

export const generateChartColors = (widget) => {
  const colors = {};
  Object.keys(widget.content.result[0].values).forEach((key) => {
    // gets colors for items
    colors[key] = COLORS[`COLOR_${key.split('$')[2].toUpperCase()}`];
  });
  return colors;
};
