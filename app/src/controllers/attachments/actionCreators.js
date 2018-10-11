import { GET_LOG_ITEM_ATTACHMENT } from './constants';
import { URLS } from '../../common/urls';
import { showModalAction } from '../../controllers/modal';

export const getLogItemAttachmentAction = (attachment) => ({
  type: GET_LOG_ITEM_ATTACHMENT,
  payload: attachment,
});

export const openFileModal = ({ id, data }) => (dispatch) => {
  const { projectId, binaryId, language } = data;
  switch (id) {
    case 'attachmentImageModal':
      dispatch(
        showModalAction({
          id,
          data: {
            image: URLS.getFileById(projectId, binaryId),
          },
        }),
      );
      break;
    case 'attachmentHarFileModal':
      fetch(URLS.getFileById(projectId, binaryId)).then(({ data: harData }) => {
        dispatch(showModalAction({ id, data: { harData } }));
      });
      break;
    default:
      fetch(URLS.getFileById(projectId, binaryId), {
        headers: {
          Accept: 'text/plain, */*; q=0.01',
        },
      }).then(({ data: content }) => {
        dispatch(showModalAction({ id, data: { language, content } }));
      });
  }
};
