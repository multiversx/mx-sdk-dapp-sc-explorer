import React from 'react';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import { CollapsibleCard, EndpointDefinitionList } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { ContractTypingsTypeEnum } from 'types';

import { ContractTypingUIType } from '../types';

export const ContractTypeComponent = (props: ContractTypingUIType) => {
  const { type, className, globalStyles } = props;
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

  const isEnum = rawType === ContractTypingsTypeEnum.enum;
  const isExplicitEnum = rawType === ContractTypingsTypeEnum.explicitEnum;

  const enums = isEnum ? abiRegistry?.getEnum(typeName) : undefined;
  const explicitEnums = isExplicitEnum
    ? abiRegistry?.getExplicitEnum(typeName)
    : undefined;

  const badgeIcon = isEnum || explicitEnums ? enumTypeIcon : structTypeIcon;

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
        {(enums || explicitEnums) && (
          <div className={classNames(globalStyles?.fieldWrapper)}>
            {(enums?.variants || []).map((variant, index) => {
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
            {(explicitEnums?.variants || []).map((variant, index) => {
              return (
                <div
                  className={classNames(globalStyles?.field)}
                  key={`${variant?.name}-${index}`}
                >
                  <code className={classNames(globalStyles?.fieldName)}>
                    {variant?.name}
                  </code>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
};

export const ContractType = withStyles(ContractTypeComponent, {});
