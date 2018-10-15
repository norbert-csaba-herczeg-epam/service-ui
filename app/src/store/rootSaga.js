import { all } from 'redux-saga/effects';
import { notificationSagas } from 'controllers/notification';
import { attachmentSagas } from 'controllers/attachments/sagas';
import { authSagas } from 'controllers/auth/sagas';
import { fetchSagas } from 'controllers/fetch';
import { launchSagas } from 'controllers/launch';
import { groupOperationsSagas } from 'controllers/groupOperations';
import { suiteSagas } from 'controllers/suite';
import { filterSagas } from 'controllers/filter';
import { testSagas } from 'controllers/test';
import { membersSagas } from 'controllers/members';
import { testItemsSaga } from 'controllers/testItem';
import { filterEntitiesSagas } from 'controllers/filterEntities';
import { logSagas } from 'controllers/log';

export function* rootSagas() {
  yield all([
    notificationSagas(),
    authSagas(),
    fetchSagas(),
    launchSagas(),
    groupOperationsSagas(),
    suiteSagas(),
    filterSagas(),
    testSagas(),
    membersSagas(),
    testItemsSaga(),
    filterEntitiesSagas(),
    logSagas(),
    attachmentSagas(),
  ]);
}
