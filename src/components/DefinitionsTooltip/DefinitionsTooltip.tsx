import React from 'react';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FieldDefinition, StructType } from '@multiversx/sdk-core/out';
import classNames from 'classnames';

import { Code, Overlay } from 'components';
import { DOCUMENTED_TYPES } from 'constants/general';
import { useSCExplorerContext } from 'contexts';
import styles from './styles.module.scss';
import { DefinitionsTooltipUIType } from './types';

const formatDefinitionsForDisplay = (definitions: FieldDefinition[]) => {
  if (definitions.length === 0) {
    return '';
  }

  const formattedDefinitions =
    Object.fromEntries(
      definitions.map((definition) => [
        definition?.name,
        definition?.type?.getName()
      ])
    ) ?? {};

  return JSON.stringify(formattedDefinitions, null, 2)
    .replaceAll(': ""', '')
    .replaceAll('"', '')
    .replaceAll(': ,', ',');
};

export const DefinitionsTooltip = (props: DefinitionsTooltipUIType) => {
  const { smartContract, icons } = useSCExplorerContext();
  const { abiRegistry } = smartContract;
  const { typeName, ...rest } = props;
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
        const formattedCustomDefinitions = formatDefinitionsForDisplay(
          (customType as StructType)?.getFieldsDefinitions()
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
      } catch {}
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
