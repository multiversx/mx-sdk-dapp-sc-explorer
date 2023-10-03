import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { useScContext } from 'context';

import { ContractEvent } from './ContractEvent';
import styles from './styles.module.scss';
import type { ContractEventsUIType } from './types';

export const ContractEvents = ({ customInterface }: ContractEventsUIType) => {
  const { rawAbi } = useScContext();

  if (!(rawAbi?.events && rawAbi.events.length > 0)) {
    return null;
  }

  return (
    <div
      className={classNames(
        styles.contractEvents,
        globalStyles?.wrapper,
        customInterface?.customClassNames?.wrapperClassName
      )}
    >
      <div
        className={classNames(
          styles.contractEventsList,
          globalStyles.list,
          customInterface?.customClassNames?.listClassName
        )}
      >
        {rawAbi.events.map((event, index) => (
          <ContractEvent
            event={event}
            key={`${event.identifier}-${index}`}
            className={classNames(
              styles.contractEventsListItem,
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
