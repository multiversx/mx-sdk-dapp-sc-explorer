import React from 'react';
import classNames from 'classnames';

import { CollapsibleCard, FieldList } from 'components';
import { ContractEventType } from 'types';
import { ContractEventUIType } from '../types';

const formatEventFields = ({
  inputs,
  outputs
}: {
  inputs?: ContractEventType['inputs'];
  outputs?: ContractEventType['outputs'];
}) => {
  if (inputs && inputs.length > 0) {
    return inputs.map(({ name, type }) => {
      return { name, value: type };
    });
  }
  if (outputs && outputs.length > 0) {
    return outputs.map(({ type }) => {
      return { name: type };
    });
  }

  return [];
};

export const ContractEvent = (props: ContractEventUIType) => {
  const { event, title, className, customInterface } = props;
  const { inputs, outputs } = event;
  const formattedFields = formatEventFields({ inputs, outputs });

  return (
    <CollapsibleCard
      {...props}
      title={title ?? event.identifier}
      className={classNames(className)}
      customInterface={customInterface}
    >
      <FieldList fields={formattedFields} />
    </CollapsibleCard>
  );
};
