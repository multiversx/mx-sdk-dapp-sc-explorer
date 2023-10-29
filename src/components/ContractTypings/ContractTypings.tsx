import React, { memo, useState } from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { PanelHeader } from 'components';
import { useSCExplorerContext } from 'contexts';
import { ContractType } from './ContractType';
import styles from './styles.module.scss';

export const ContractTypingsComponent = () => {
  const { smartContract, support, customClassNames } = useSCExplorerContext();
  const { abiRegistry } = smartContract;
  const { hasTypes } = support;
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
        customClassNames?.wrapperClassName
      )}
    >
      <PanelHeader
        showButtons={customTypes.length > 1}
        onAllExpanded={setAllExpanded}
      >
        Types
      </PanelHeader>
      <div
        className={classNames(
          styles?.contractTypingsList,
          globalStyles?.list,
          customClassNames?.listClassName
        )}
      >
        {customTypes.map((customType, index) => (
          <ContractType
            key={`${customType?.getName()}-${index}`}
            type={customType}
            className={classNames(
              styles?.contractTypingsListItem,
              globalStyles?.listItem,
              customClassNames?.listItemClassName
            )}
            isOpen={customTypes.length === 1 || allExpanded}
          />
        ))}
      </div>
    </div>
  );
};

export const ContractTypings = memo(ContractTypingsComponent);
