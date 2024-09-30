import React from 'react';
import classNames from 'classnames';

import { DefinitionsTooltip, DocsTooltip } from 'components';
import { withStyles } from 'hocs/withStyles';

import { FieldListUIType } from './types';

export const FieldListComponent = ({
  fields,
  globalStyles
}: FieldListUIType) => {
  return (
    <>
      {fields && fields.length > 0 && (
        <div className={classNames(globalStyles?.fieldWrapper)}>
          {fields.map(({ name, value, detail, docs }, index) => {
            return (
              <div
                key={`${name}-${index}`}
                className={classNames(globalStyles?.field)}
              >
                <code className={classNames(globalStyles?.fieldName)}>
                  {name}
                </code>
                {value && (
                  <code className={classNames(globalStyles?.fieldValue)}>
                    {value}
                  </code>
                )}
                {detail && (
                  <code className={classNames(globalStyles?.fieldDetail)}>
                    {detail}
                  </code>
                )}
                {docs && <DocsTooltip docs={docs} />}
                {value && <DefinitionsTooltip typeName={String(value)} />}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export const FieldList = withStyles(FieldListComponent, {});
