import React from 'react';
import classNames from 'classnames';

import { EndpointDefinitionList, Code } from 'components';
import { formatOutputDisplayValue } from 'helpers';
import { withStyles } from 'hocs/withStyles';
import { MvxCopyButton } from 'lib';
import { EndpointOutputUIType } from 'types';

export const EndpointOutputComponent = (props: EndpointOutputUIType) => {
  const { output, result, globalStyles, styles } = props;

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

            {result?.parsedResponse && result.parsedResponse.length > 0 && (
              <div className={classNames(styles?.endpointOutputResults)}>
                <span
                  className={classNames(styles?.endpointOutputResultsTitle)}
                >
                  Query Result:{' '}
                </span>
                {result.parsedResponse.map((value, index) => {
                  const displayResponse = value?.valueOf();
                  let output = displayResponse;
                  if (
                    displayResponse !== null &&
                    (typeof displayResponse === 'object' ||
                      Array.isArray(displayResponse))
                  ) {
                    output = JSON.stringify(
                      displayResponse,
                      (key, val) => formatOutputDisplayValue(val),
                      2
                    );
                  } else {
                    try {
                      output = formatOutputDisplayValue(displayResponse);
                    } catch {}
                  }

                  return (
                    <div
                      className={classNames(globalStyles?.codeBlock)}
                      key={index}
                    >
                      <div className={classNames(globalStyles?.buttonHolder)}>
                        <MvxCopyButton
                          text={String(output)}
                          className={classNames(globalStyles?.copyButton)}
                        />
                      </div>
                      {output === '' ? (
                        '<empty string>'
                      ) : (
                        <Code
                          className={classNames(
                            globalStyles?.endpointOutputResultsCode
                          )}
                          code={String(output)}
                          showLineNumbers={false}
                          language='properties'
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EndpointOutput = withStyles(EndpointOutputComponent, {
  ssrStyles: () => import('components/Forms/EndpointForm/styles.module.scss'),
  clientStyles: () =>
    require('components/Forms/EndpointForm/styles.module.scss').default
});
