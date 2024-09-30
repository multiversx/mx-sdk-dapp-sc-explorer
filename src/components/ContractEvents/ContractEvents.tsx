import React, { memo, useState } from 'react';
import classNames from 'classnames';

import { PanelHeader } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';

import { ContractEvent } from './ContractEvent';

export const ContractEventsComponent = ({
  globalStyles,
  styles
}: WithStylesImportType) => {
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

export const MemoizedContractEvents = memo(ContractEventsComponent);

export const ContractEvents = withStyles(MemoizedContractEvents, {
  ssrStyles: () => import('components/ContractEvents/styles.module.scss'),
  clientStyles: () =>
    require('components/ContractEvents/styles.module.scss').default
});
