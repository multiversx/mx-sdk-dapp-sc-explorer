import React from 'react';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { CollapsibleCard, EndpointDefinitionList } from 'components';
import { useSCExplorerContext } from 'contexts';
import { ContractTypingsTypeEnum } from 'types';
import { ContractTypingUIType } from '../types';

export const ContractType = (props: ContractTypingUIType) => {
  const { type, className } = props;
  const { smartContract, customClassNames, icons } = useSCExplorerContext();
  const { abiRegistry, rawAbi } = smartContract;
  const { structTypeIcon, enumTypeIcon } = icons ?? {};

  if (!type) {
    return null;
  }

  const typeName = type?.getName();
  const rawType = rawAbi?.types[typeName]?.type;

  const struct =
    rawType === ContractTypingsTypeEnum.struct
      ? abiRegistry?.getStruct(typeName)
      : undefined;

  const enums =
    rawType === ContractTypingsTypeEnum.enum
      ? abiRegistry?.getEnum(typeName)
      : undefined;

  const badgeIcon =
    rawType === ContractTypingsTypeEnum.enum ? enumTypeIcon : structTypeIcon;

  return (
    <CollapsibleCard
      {...props}
      title={typeName}
      badgeValue={rawType}
      badgeIcon={badgeIcon ?? faKeyboard}
      className={classNames(className)}
      badgeClassName={classNames(
        customClassNames?.badgeClassName,
        customClassNames?.badgePrimaryClassName
      )}
    >
      <div className={classNames(globalStyles?.fieldWrapper)}>
        {struct && (
          <EndpointDefinitionList
            definitions={struct?.getFieldsDefinitions()}
          />
        )}
        {enums && (
          <div className={classNames(globalStyles?.fieldWrapper)}>
            {enums?.variants?.map((variant, index) => {
              const fieldsDefinitions = variant?.getFieldsDefinitions() ?? [];
              return (
                <div
                  className={classNames(globalStyles?.field)}
                  key={`${variant?.name}-${index}`}
                >
                  <code className={classNames(globalStyles?.fieldName)}>
                    {variant?.name}
                  </code>
                  {fieldsDefinitions.length > 0 && (
                    <EndpointDefinitionList
                      definitions={variant?.getFieldsDefinitions()}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};
