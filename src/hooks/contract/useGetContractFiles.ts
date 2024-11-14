import React, { memo, Fragment, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { PanelHeader } from 'components';
import {
  CONTRACT_FILE_EXTENSION,
  CONTRACT_FILE_TEST_PATH
} from 'constants/general';
import { useSCExplorerContext } from 'contexts';

export const useGetContractFiles = () => {
  const { smartContract, support } = useSCExplorerContext();
  const { verifiedContract } = smartContract;
  const { hasSourceCode } = support;

  if (!hasSourceCode) {
    return [];
  }

  const files = verifiedContract?.source?.contract?.entries ?? [];

  const filteredEntries = files.filter(
    ({ path, isTestFile }) =>
      path.endsWith(CONTRACT_FILE_EXTENSION) &&
      !path.includes(CONTRACT_FILE_TEST_PATH) &&
      !isTestFile
  );

  return filteredEntries;
};
