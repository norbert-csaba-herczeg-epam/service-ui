import { generateChartDataParams, generateChartColors } from './generateConfig';
import testData from './testData';

describe('generateConfig', () => {
  describe('generateChartDataParams', () => {
    test('generates params for chart data', () => {
      const expected = {
        chartDataColumns: [
          ['statistics$executions$passed', '1101', '54', '111'],
          ['statistics$executions$failed', '496', '966', '631'],
          ['statistics$executions$skipped', '275', '0', '144'],
        ],
        dataGroupNames: ['test1', 'prefx:test2', 'prefx:test3'],
      };
      expect(generateChartDataParams(testData)).toEqual(expected);
    });
  });

  describe('generateChartColors', () => {
    test('generates colors for chart data', () => {
      const expected = {
        statistics$defects$automation_bug$AB001: '#f7d63e',
        statistics$defects$no_defect$ND001: '#777777',
        statistics$defects$product_bug$PB001: '#ec3900',
        statistics$defects$system_issue$SI001: '#0274d1',
        statistics$defects$to_investigate$TI001: '#ffb743',
        statistics$executions$failed: '#f36c4a',
        statistics$executions$passed: '#87b77b',
        statistics$executions$skipped: '#bdc7cc',
        statistics$executions$total: undefined,
      };
      expect(generateChartColors(testData)).toEqual(expected);
    });
  });
});
