import React from 'react';
import { faFileAlt, faLink, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import classNames from 'classnames';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import androidstudio from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';

import globalStyles from 'assets/styles/globals.module.scss';
import { CollapsibleCard } from 'components';
import { useSCExplorerContext } from 'contexts';
import { ContractFileUIType } from '../types';

SyntaxHighlighter.registerLanguage('rust', rust);

export const ContractFile = (props: ContractFileUIType) => {
  const { icons } = useSCExplorerContext();
  const { file, title, entryNumber, totalEntries, className } = props;
  const { content, path } = file;
  const {
    contractFileIcon = faFileAlt,
    copyIcon = faCopy,
    linkIcon = faLink
  } = icons ?? {};

  const fullPath = window.location.href;

  const base64Buffer = Buffer.from(content, 'base64');
  const codeString = base64Buffer.toString();

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
            copyIcon={copyIcon as any} // TODO fix fontawesome typing issue
          />
          <CopyButton
            text={`${fullPath}#${path}`}
            className={classNames(globalStyles?.linkButton)}
            copyIcon={linkIcon as any} // TODO fix fontawesome typing issue
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
