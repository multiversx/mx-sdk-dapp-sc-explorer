import React from 'react';
import classNames from 'classnames';

import { DefinitionsTooltip } from 'components';
import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';
import { withStyles } from 'hocs/withStyles';

import { EndpointDefinitionListType } from './types';

export const EndpointDefinitionListComponent = ({
  definitions,
  globalStyles
}: EndpointDefinitionListType) => {
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
            <DefinitionsTooltip typeName={definition?.type?.toString()} />
          </div>
        );
      })}
    </div>
  );
};

export const EndpointDefinitionList = withStyles(
  EndpointDefinitionListComponent,
  {}
);
