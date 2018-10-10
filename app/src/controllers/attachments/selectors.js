import { getIcon } from 'common/img/launch/attachments';

export const attachmentsSelector = (state) => {
  let contents = [];
  if (state.log && state.log.logItems) {
    contents = state.log.logItems
      .filter((item) => item.binary_content)
      .map((item) => item.binary_content)
      .map((attachment) => ({
        id: attachment.id,
        src: getIcon(attachment.content_type),
        alt: attachment.content_type,
      }));
  }
  return contents;
};
