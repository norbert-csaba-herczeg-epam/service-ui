export default {
  share: false,
  id: 19,
  name: 'cumulative test',
  content_parameters: {
    content_fields: [
      'statistics$defects$automation_bug$AB001',
      'statistics$defects$product_bug$PB001',
      'statistics$defects$system_issue$SI001',
      'statistics$defects$no_defect$ND001',
      'statistics$defects$to_investigate$TI001',
    ],
    itemsCount: 2,
    widgetOptions: {
      prefix: 'build',
    },
  },
  applied_filters: [
    {
      share: false,
      id: 1,
      name: 'launch name',
      conditions: [
        {
          filtering_field: 'project_id',
          condition: 'eq',
          value: '2',
        },
        {
          filtering_field: 'mode',
          condition: 'eq',
          value: 'DEFAULT',
        },
        {
          filtering_field: 'status',
          condition: 'ne',
          value: 'IN_PROGRESS',
        },
      ],
      orders: [
        {
          sorting_column: 'statistics$defects$no_defect$ND001',
          is_asc: false,
        },
      ],
      type: 'Launch',
    },
  ],
  content: {
    result: {
      'build:3.10.2': [
        {
          id: 4,
          number: 4,
          name: 'launch name test',
          start_time: 1540977815224,
          values: {
            statistics$defects$automation_bug$AB001: '2',
            statistics$defects$product_bug$PB001: '12',
            statistics$defects$system_issue$SI001: '24',
            statistics$defects$no_defect$ND001: '36',
            statistics$defects$to_investigate$TI001: '3',
          },
        },
        {
          id: 2,
          number: 2,
          name: 'launch name',
          start_time: 1540977815224,
          values: {
            statistics$defects$automation_bug$AB001: '11',
            statistics$defects$product_bug$PB001: '11',
            statistics$defects$system_issue$SI001: '13',
            statistics$defects$no_defect$ND001: '2',
            statistics$defects$to_investigate$TI001: '13',
          },
        },
        {
          id: 1,
          number: 1,
          name: 'launch name',
          start_time: 1540977815224,
          values: {
            statistics$defects$automation_bug$AB001: '7',
            statistics$defects$product_bug$PB001: '3',
            statistics$defects$system_issue$SI001: '18',
            statistics$defects$no_defect$ND001: '12',
            statistics$defects$to_investigate$TI001: '2',
          },
        },
        {
          id: 3,
          number: 3,
          name: 'launch name',
          start_time: 1540977815224,
          values: {
            statistics$defects$automation_bug$AB001: '21',
            statistics$defects$product_bug$PB001: '1',
            statistics$defects$system_issue$SI001: '16',
            statistics$defects$no_defect$ND001: '1',
            statistics$defects$to_investigate$TI001: '31',
          },
        },
      ],
      'build:3.10.3': [
        {
          id: 4,
          number: 4,
          name: 'launch name test',
          start_time: 1540977815224,
          values: {
            statistics$defects$automation_bug$AB001: '20',
            statistics$defects$product_bug$PB001: '2',
            statistics$defects$system_issue$SI001: '14',
            statistics$defects$no_defect$ND001: '16',
            statistics$defects$to_investigate$TI001: '13',
          },
        },
        {
          id: 2,
          number: 2,
          name: 'launch name',
          start_time: 1540977815224,
          values: {
            statistics$defects$automation_bug$AB001: '11',
            statistics$defects$product_bug$PB001: '11',
            statistics$defects$system_issue$SI001: '13',
            statistics$defects$no_defect$ND001: '2',
            statistics$defects$to_investigate$TI001: '3',
          },
        },
        {
          id: 1,
          number: 1,
          name: 'launch name',
          start_time: 1540977815224,
          values: {
            statistics$defects$automation_bug$AB001: '17',
            statistics$defects$product_bug$PB001: '13',
            statistics$defects$system_issue$SI001: '18',
            statistics$defects$no_defect$ND001: '21',
            statistics$defects$to_investigate$TI001: '2',
          },
        },
        {
          id: 3,
          number: 3,
          name: 'launch name',
          start_time: 1540977815224,
          values: {
            statistics$defects$automation_bug$AB001: '31',
            statistics$defects$product_bug$PB001: '12',
            statistics$defects$system_issue$SI001: '11',
            statistics$defects$no_defect$ND001: '21',
            statistics$defects$to_investigate$TI001: '1',
          },
        },
      ],
    },
  },
};
