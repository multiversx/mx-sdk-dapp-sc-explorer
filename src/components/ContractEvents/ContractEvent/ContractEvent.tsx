import React from 'react';
import classNames from 'classnames';

import { CollapsibleCard, FieldList } from 'components';
import { formatEventFields } from 'helpers';

import { ContractEventUIType } from '../types';

export const ContractEvent = (props: ContractEventUIType) => {
  const { event, title, className } = props;
  const { inputs, outputs } = event;
  const formattedFields = formatEventFields({ inputs, outputs });

  return (
    <CollapsibleCard
      {...props}
      title={title ?? event.identifier}
      className={classNames(className)}
    >
      <FieldList fields={formattedFields} />
    </CollapsibleCard>
  );
};
