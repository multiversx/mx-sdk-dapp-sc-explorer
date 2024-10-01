import React from 'react';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { Code, Overlay, EndpointDefinitionList } from 'components';
import { DOCUMENTED_TYPES } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import { formatDefinitionsForDisplay } from 'helpers';
import { withStyles } from 'hocs/withStyles';
import { ContractTypingsTypeEnum } from 'types';

import { DefinitionsTooltipUIType } from './types';

export const DefinitionsTooltipComponent = (
  props: DefinitionsTooltipUIType
) => {
  const { smartContract, icons } = useSCExplorerContext();
  const { abiRegistry, rawAbi } = smartContract;
  const { typeName, globalStyles, styles, ...rest } = props;
  const { hintIcon = faQuestionCircle } = icons ?? {};
  let docs: React.ReactNode = null;

  if (!typeName) {
    return null;
  }

  const existingDocs = DOCUMENTED_TYPES?.[typeName];
  if (existingDocs) {
    docs = (
      <>
        {existingDocs?.type && <div>Type: {existingDocs.type}</div>}
        {existingDocs?.docs && <div>About: {existingDocs.docs}</div>}
        {existingDocs?.example && <div>Example: {existingDocs.example}</div>}
      </>
    );
  } else {
    const customType = abiRegistry?.customTypes?.find(
      (type) => type?.getName() === typeName
    );

    if (customType) {
      try {
        const rawType = rawAbi?.types[typeName]?.type;

        const struct =
          rawType === ContractTypingsTypeEnum.struct
            ? abiRegistry?.getStruct(typeName)
            : undefined;

        const enums =
          rawType === ContractTypingsTypeEnum.enum ||
          rawType === ContractTypingsTypeEnum.explicitEnum
            ? abiRegistry?.getEnum(typeName)
            : undefined;

        if (struct) {
          const formattedCustomDefinitions = formatDefinitionsForDisplay(
            struct?.getFieldsDefinitions()
          );
          if (formattedCustomDefinitions.length > 0) {
            docs = (
              <Code
                code={formattedCustomDefinitions}
                showLineNumbers={false}
                language='properties'
              />
            );
          }
        }
        if (enums) {
          docs = (
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
          );
        }
      } catch (error) {}
    }
  }

  if (!docs) {
    return null;
  }

  return (
    <Overlay
      {...rest}
      title={docs}
      className={classNames(styles?.definitionsTooltip)}
    >
      <FontAwesomeIcon
        icon={hintIcon}
        className={classNames(styles?.definitionsTooltipIcon)}
      />
    </Overlay>
  );
};

export const DefinitionsTooltip = withStyles(DefinitionsTooltipComponent, {
  ssrStyles: () => import('components/DefinitionsTooltip/styles.module.scss'),
  clientStyles: () =>
    require('components/DefinitionsTooltip/styles.module.scss').default
});
