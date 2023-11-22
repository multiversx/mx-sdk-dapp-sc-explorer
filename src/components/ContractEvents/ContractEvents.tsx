import React, { memo, useState } from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { PanelHeader } from 'components';
import { useSCExplorerContext } from 'contexts';
import { ContractEvent } from './ContractEvent';
import styles from './styles.module.scss';

export const ContractEventsComponent = () => {
  const { smartContract, support, customClassNames } = useSCExplorerContext();
  const { rawAbi } = smartContract;
  const { hasEvents } = support;
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
        customClassNames?.wrapperClassName
      )}
    >
      <PanelHeader
        showButtons={events.length > 1}
        onAllExpanded={setAllExpanded}
      >
        Events
      </PanelHeader>
      <div
        className={classNames(
          styles?.contractEventsList,
          globalStyles?.list,
          customClassNames?.listClassName
        )}
      >
        {events.map((event, index) => (
          <ContractEvent
            event={event}
            key={`${event.identifier}-${index}`}
            className={classNames(
              styles?.contractEventsListItem,
              globalStyles?.listItem,
              customClassNames?.listItemClassName
            )}
            isOpen={events.length === 1 || allExpanded}
          />
        ))}
      </div>
    </div>
  );
};

export const ContractEvents = memo(ContractEventsComponent);
