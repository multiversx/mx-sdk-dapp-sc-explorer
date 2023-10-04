import React from 'react';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { CollapsibleCard, EndpointDefinitionList } from 'components';
import { useScContext } from 'context';
import { ContractTypingsTypeEnum } from 'types';

import { ContractTypingUIType } from '../types';

export const ContractType = (props: ContractTypingUIType) => {
  const { type, className, customInterface } = props;
  const { structTypeIcon, enumTypeIcon } = customInterface?.icons ?? {};
  const { abiRegistry, rawAbi } = useScContext();

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
        customInterface?.customClassNames?.badgeClassName,
        customInterface?.customClassNames?.badgePrimaryClassName
      )}
    >
      <div className={classNames(globalStyles.fieldWrapper)}>
        {struct && (
          <EndpointDefinitionList
            definitions={struct?.getFieldsDefinitions()}
          />
        )}
        {enums && (
          <>
            {enums?.variants?.map((variant, index) => {
              return (
                <div
                  className={classNames(globalStyles.fieldGroup)}
                  key={`${variant?.name}-${index}`}
                >
                  <code className={classNames(globalStyles.fieldName)}>
                    {variant?.name}
                  </code>
                  <EndpointDefinitionList
                    definitions={variant?.getFieldsDefinitions()}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </CollapsibleCard>
  );
};
