import React from 'react';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { EndpointDefinitionList, Code } from 'components';

import styles from '../../styles.module.scss';
import { EndpointOutputUIType } from '../../types';

export const EndpointOutput = (props: EndpointOutputUIType) => {
  const { output, result } = props;

  if (!output || output.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles?.endpointOutput, globalStyles?.panel)}>
      <div className={classNames(globalStyles?.panelMode)}>Output</div>
      <div className={classNames(globalStyles?.panelContentWrapper)}>
        <div className={classNames(globalStyles?.panelContentWrapperRow)}>
          <div className={classNames(globalStyles?.panelContent)}>
            <EndpointDefinitionList definitions={output} />

            {result?.parsedResponse?.values &&
              result.parsedResponse.values.length > 0 && (
                <div className={classNames(styles?.endpointOutputResults)}>
                  <span
                    className={classNames(styles?.endpointOutputResultsTitle)}
                  >
                    Query Result:{' '}
                  </span>
                  {result.parsedResponse?.values.map((value, index) => {
                    const displayValue = value?.valueOf();
                    if (
                      displayValue !== null &&
                      (typeof displayValue === 'object' ||
                        Array.isArray(displayValue))
                    ) {
                      return (
                        <Code
                          className={classNames(
                            styles?.endpointOutputResultsCode
                          )}
                          key={index}
                          code={JSON.stringify(displayValue, null, 2)}
                          showLineNumbers={false}
                          language='properties'
                        />
                      );
                    } else {
                      return (
                        <code
                          key={index}
                          className={classNames(
                            styles?.endpointOutputResultsString
                          )}
                        >
                          {displayValue === ''
                            ? '<empty string>'
                            : String(displayValue)}
                        </code>
                      );
                    }
                  })}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
