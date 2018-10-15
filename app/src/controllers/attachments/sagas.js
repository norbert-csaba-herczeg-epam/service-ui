import { takeLatest, call, put, all } from 'redux-saga/effects';
import { URLS } from 'common/urls';
import { fetch } from 'common/utils';

import { showModalAction } from '../../controllers/modal';
import {
  GET_ATTACHMENT_HAR,
  ATTACHMENT_HAR_FETCH_ERROR,
  GET_ATTACHMENT_BINARY,
  ATTACHMENT_BINARY_FETCH_ERROR,
  GET_ATTACHMENT_IMAGE,
  ATTACHMENT_IMAGE_FETCH_ERROR,
} from './constants';

function fetchImageData({ projectId, binaryId }) {
  return new Promise(() => ({
    image: URLS.getFileById(projectId, binaryId),
  }));
}

function fetchRealData({ projectId, binaryId }) {
  return fetch(URLS.getFileById(projectId, binaryId));
}

/* IMAGE */

function* openImageModalsWorker({ data: { projectId, binaryId } }) {
  try {
    const data = yield call(fetchImageData, { projectId, binaryId });
    yield put(showModalAction({ id: 'attachmentImageModal', data }));
  } catch (error) {
    yield put({ type: ATTACHMENT_IMAGE_FETCH_ERROR, error });
  }
}

function* openImageModalWatcher() {
  yield takeLatest(GET_ATTACHMENT_IMAGE, openImageModalsWorker);
}

/* HAR */

function* openHarModalsWorker({ data: actionData }) {
  try {
    const harData = yield call(fetchRealData, actionData);
    yield put(showModalAction({ id: 'attachmentHarFileModal', data: { harData } }));
  } catch (error) {
    yield put({ type: ATTACHMENT_HAR_FETCH_ERROR, error });
  }
}

function* openHarModalWatcher() {
  yield takeLatest(GET_ATTACHMENT_HAR, openHarModalsWorker);
}

/* BINARY */

function* openBinaryModalsWorker({ data: actionData }) {
  try {
    const jsonContent = yield call(fetchRealData, actionData);
    const content = jsonContent ? JSON.stringify(jsonContent) : jsonContent;
    yield put(
      showModalAction({
        id: 'attachmentCodeModal',
        data: { language: actionData.language, content },
      }),
    );
  } catch (error) {
    yield put({ type: ATTACHMENT_BINARY_FETCH_ERROR, error });
  }
}

function* openBinaryModalWatcher() {
  yield takeLatest(GET_ATTACHMENT_BINARY, openBinaryModalsWorker);
}

export function* attachmentSagas() {
  yield all([openImageModalWatcher(), openHarModalWatcher(), openBinaryModalWatcher()]);
}
