import React from 'react';
import { FieldDefinition } from '@multiversx/sdk-core/out';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { DefinitionsTooltip } from 'components';
import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';

export const EndpointDefinitionList = ({
  definitions
}: {
  definitions: FieldDefinition[];
}) => {
  return (
    <div className={classNames(globalStyles?.fieldWrapper)}>
      {definitions.map((definition, index) => {
        return (
          <div
            key={`${definition?.name}-${index}`}
            className={classNames(globalStyles?.field)}
          >
            <code className={classNames(globalStyles?.fieldName)}>
              {definition?.name !== INTERFACE_NAME_PLACEHOLDER
                ? definition.name
                : null}
            </code>
            <code className={classNames(globalStyles?.fieldValue)}>
              {definition?.type?.toString()}
            </code>
            <DefinitionsTooltip
              typeName={
                definition?.type?.isGenericType()
                  ? definition?.type?.getFirstTypeParameter()?.getName()
                  : definition?.type?.toString()
              }
            />
          </div>
        );
      })}
    </div>
  );
};
