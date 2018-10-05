/*
 * Copyright 2017 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { host } from 'storybook-host';
import { withReadme } from 'storybook-readme';

import { WidgetHeader } from './widgetHeader';
import README from './README.md';

const testData = Object.freeze({
  intl: 'Test ID',
  userId: '123456',
  data: {
    name: 'Jane Testing',
    description: 'Test Description for Component',
    shared: false,
    owner: '987654',
    type: 'statistic_trend',
    meta: 'lineChart',
  },
});

const testDataSharedNotSameOwner = Object.freeze({
  intl: 'Test ID',
  userId: '123456',
  data: {
    name: 'Jane Testing',
    description: 'Test Description for Component',
    shared: true,
    owner: '852951',
    type: 'statistic_trend',
    meta: 'lineChart',
  },
});

const testDataSharedSameOwner = Object.freeze({
  intl: 'Test ID',
  userId: '123456',
  data: {
    name: 'Jane Testing',
    description: 'Test Description for Component',
    shared: true,
    owner: '123456',
    type: 'statistic_trend',
    meta: 'lineChart',
  },
});

storiesOf('Pages/Inside/DashboardItemPage/WidgetsGrid/Widget/WidgetHeader', module)
  .addDecorator(
    host({
      title: 'WidgetGrid WidgetHeader component',
      align: 'center middle',
      backdrop: 'rgba(70, 69, 71, 0.2)',
      background: '#fff',
      height: 60,
      width: '100%',
    }),
  )
  .addDecorator(withReadme(README))
  .add('default state', () => <WidgetHeader />)
  .add('with basic data', () => (
    <WidgetHeader
      intl={testData.intl}
      userId={testData.userId}
      data={testData.data}
      onRefresh={action('onRefresh')}
      onDelete={action('onDelete')}
    />
  ))
  .add('shared, user is owner', () => (
    <WidgetHeader
      intl={testDataSharedSameOwner.intl}
      userId={testDataSharedSameOwner.userId}
      data={testDataSharedSameOwner.data}
      onRefresh={action('onRefresh')}
      onDelete={action('onDelete')}
    />
  ))
  .add('shared, uesr in not the owner)', () => (
    <WidgetHeader
      intl={testDataSharedNotSameOwner.intl}
      userId={testDataSharedNotSameOwner.userId}
      data={testDataSharedNotSameOwner.data}
      onRefresh={action('onRefresh')}
      onDelete={action('onDelete')}
    />
  ));
