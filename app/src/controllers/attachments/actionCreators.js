import { URLS } from '../../common/urls';
import { fetch } from '../../common/utils';
import { showModalAction } from '../../controllers/modal';
import { GET_LOG_ITEM_ATTACHMENT } from './constants';

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
      fetch(URLS.getFileById(projectId, binaryId)).then((harData) => {
        dispatch(showModalAction({ id, data: { harData } }));
      });
      break;
    default:
      fetch(URLS.getFileById(projectId, binaryId)).then((jsonContent) => {
        const content = jsonContent ? JSON.stringify(jsonContent) : jsonContent;
        dispatch(showModalAction({ id, data: { language, content } }));
      });
  }
};
