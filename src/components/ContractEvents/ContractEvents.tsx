import React, { useState } from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { PanelHeader } from 'components';
import { useScContext } from 'context';
import { useSupport } from 'hooks';

import { ContractEvent } from './ContractEvent';
import styles from './styles.module.scss';
import type { ContractEventsUIType } from './types';

export const ContractEvents = ({ customInterface }: ContractEventsUIType) => {
  const { rawAbi } = useScContext();
  const { hasEvents } = useSupport();
  const [allExpanded, setAllExpanded] = useState(false);

  if (!hasEvents) {
    return null;
  }

  const events = rawAbi?.events ?? [];

  return (
    <div
      className={classNames(
        styles?.contractEvents,
        globalStyles?.panelWrapper,
        customInterface?.customClassNames?.wrapperClassName
      )}
    >
      <PanelHeader
        showButtons={events.length > 1}
        onAllExpanded={setAllExpanded}
        customInterface={customInterface}
      >
        Events
      </PanelHeader>
      <div
        className={classNames(
          styles?.contractEventsList,
          globalStyles?.list,
          customInterface?.customClassNames?.listClassName
        )}
      >
        {events.map((event, index) => (
          <ContractEvent
            event={event}
            key={`${event.identifier}-${index}`}
            className={classNames(
              styles?.contractEventsListItem,
              globalStyles?.listItem,
              customInterface?.customClassNames?.listItemClassName
            )}
            customInterface={customInterface}
            isOpen={events.length === 1 || allExpanded}
          />
        ))}
      </div>
    </div>
  );
};
