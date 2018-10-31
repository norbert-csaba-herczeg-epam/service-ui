import { generateChartDataParams, generateChartColors } from './generateConfig';
import testData from './testData';

describe('generateConfig', () => {
  describe('generateChartDataParams', () => {
    test('generates params for chart data', () => {
      const expected = {
        chartDataColumns: [
          ['statistics$defects$automation_bug$AB001', 41, 79],
          ['statistics$defects$product_bug$PB001', 27, 38],
          ['statistics$defects$system_issue$SI001', 71, 56],
          ['statistics$defects$no_defect$ND001', 51, 60],
          ['statistics$defects$to_investigate$TI001', 49, 19],
        ],
        dataGroupNames: ['build:3.10.2', 'build:3.10.3'],
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
      };
      expect(generateChartColors(testData)).toEqual(expected);
    });
  });
});
