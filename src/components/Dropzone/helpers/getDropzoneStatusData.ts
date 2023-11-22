import {
  faFileArrowUp,
  faFileCircleXmark,
  faFileCircleCheck
} from '@fortawesome/free-solid-svg-icons';

export interface GetDropzoneStatusDataType {
  filesUploadedSuccessfully: boolean;
  errorsExist: boolean;
  successMessage: string;
}

export const getDropzoneStatusData = ({
  errorsExist,
  filesUploadedSuccessfully,
  successMessage
}: GetDropzoneStatusDataType) => {
  if (errorsExist) {
    return {
      statusIcon: faFileCircleXmark,
      statusLabel: 'Please check below for file errors.'
    };
  }

  if (filesUploadedSuccessfully) {
    return {
      statusIcon: faFileCircleCheck,
      statusLabel: successMessage
    };
  }

  return {
    statusIcon: faFileArrowUp,
    statusLabel: 'Drag and drop your file here or'
  };
};
