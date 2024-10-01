import React from 'react';
import { faFileAlt, faLink, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import classNames from 'classnames';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import androidstudio from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';

import { CollapsibleCard } from 'components';
import { useSCExplorerContext } from 'contexts';
import { getContractFileContent } from 'helpers';
import { withStyles } from 'hocs/withStyles';

import { ContractFileUIType } from '../types';

SyntaxHighlighter.registerLanguage('rust', rust);

export const ContractFileComponent = (props: ContractFileUIType) => {
  const { icons } = useSCExplorerContext();
  const { file, title, entryNumber, totalEntries, className, globalStyles } =
    props;
  const { path } = file;
  const {
    contractFileIcon = faFileAlt,
    copyIcon = faCopy,
    linkIcon = faLink
  } = icons ?? {};

  const fullPath = window.location.href;
  const codeString = getContractFileContent(file);

  const TitleContent = () => (
    <>
      <span className={classNames(globalStyles?.cardHeaderTitle)}>
        <FontAwesomeIcon icon={contractFileIcon} />
        {String(path)}
      </span>
      {entryNumber !== undefined && totalEntries !== undefined && (
        <span>
          {entryNumber + 1}/{totalEntries}{' '}
        </span>
      )}
    </>
  );

  return (
    <CollapsibleCard
      {...props}
      title={title ?? path}
      titleContent={<TitleContent />}
      className={classNames(className)}
    >
      <div className={classNames(globalStyles?.codeBlock)}>
        <div className={classNames(globalStyles?.buttonHolder)}>
          <CopyButton
            text={codeString}
            className={classNames(globalStyles?.copyButton)}
            copyIcon={copyIcon}
          />
          <CopyButton
            text={`${fullPath}#${path}`}
            className={classNames(globalStyles?.linkButton)}
            copyIcon={linkIcon}
          />
        </div>
        <SyntaxHighlighter
          language='rust'
          style={androidstudio}
          showLineNumbers
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </CollapsibleCard>
  );
};

export const ContractFile = withStyles(ContractFileComponent, {});
