import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { useScContext } from 'context';

import { ContractType } from './ContractType';
import styles from './styles.module.scss';
import type { ContractTypingsUIType } from './types';

export const ContractTypings = ({ customInterface }: ContractTypingsUIType) => {
  const { abiRegistry } = useScContext();
  const customTypes = abiRegistry?.customTypes;

  if (!(customTypes && customTypes.length > 0)) {
    return null;
  }

  return (
    <div
      className={classNames(
        styles.contractTypings,
        globalStyles?.wrapper,
        customInterface?.customClassNames?.wrapperClassName
      )}
    >
      <div
        className={classNames(
          styles.contractTypingsList,
          globalStyles.list,
          customInterface?.customClassNames?.listClassName
        )}
      >
        {customTypes.map((customType, index) => (
          <ContractType
            key={`${customType?.getName()}-${index}`}
            type={customType}
            className={classNames(
              styles.contractTypingsListItem,
              globalStyles.listItem,
              customInterface?.customClassNames?.listItemClassName
            )}
            customInterface={customInterface}
          />
        ))}
      </div>
    </div>
  );
};
