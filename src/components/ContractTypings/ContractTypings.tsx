import React, { useState } from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { PanelHeader } from 'components';
import { useScContext } from 'context';
import { useSupport } from 'hooks';

import { ContractType } from './ContractType';
import styles from './styles.module.scss';
import type { ContractTypingsUIType } from './types';

export const ContractTypings = ({ customInterface }: ContractTypingsUIType) => {
  const { abiRegistry } = useScContext();
  const { hasTypes } = useSupport();
  const [allExpanded, setAllExpanded] = useState(false);

  if (!hasTypes) {
    return null;
  }

  const customTypes = abiRegistry?.customTypes ?? [];

  return (
    <div
      className={classNames(
        styles?.contractTypings,
        globalStyles?.panelWrapper,
        customInterface?.customClassNames?.wrapperClassName
      )}
    >
      <PanelHeader
        showButtons={customTypes.length > 1}
        onAllExpanded={setAllExpanded}
        customInterface={customInterface}
      >
        Types
      </PanelHeader>
      <div
        className={classNames(
          styles?.contractTypingsList,
          globalStyles?.list,
          customInterface?.customClassNames?.listClassName
        )}
      >
        {customTypes.map((customType, index) => (
          <ContractType
            key={`${customType?.getName()}-${index}`}
            type={customType}
            className={classNames(
              styles?.contractTypingsListItem,
              globalStyles?.listItem,
              customInterface?.customClassNames?.listItemClassName
            )}
            customInterface={customInterface}
            isOpen={customTypes.length === 1 || allExpanded}
          />
        ))}
      </div>
    </div>
  );
};
