import React from 'react';
import { faFileAlt, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import classNames from 'classnames';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import androidstudio from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';

import globalStyles from 'assets/styles/globals.module.scss';
import { CollapsibleCard } from 'components';
import styles from '../styles.module.scss';
import { ContractFileUIType } from '../types';

SyntaxHighlighter.registerLanguage('rust', rust);

export const ContractFile = (props: ContractFileUIType) => {
  const { file, title, entryNumber, totalEntries, className, customInterface } =
    props;
  const { content, path } = file;
  const { contractFileIcon = faFileAlt, linkIcon = faLink } =
    customInterface?.icons ?? {};

  const fullPath = window.location.href;

  const base64Buffer = Buffer.from(content, 'base64');
  const codeString = base64Buffer.toString();

  const TitleContent = () => (
    <>
      <FontAwesomeIcon icon={contractFileIcon} />
      <span className={classNames(globalStyles.cardHeaderTitle)}>
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
      <div className={classNames(styles.codeBlock)}>
        <div className={classNames(styles.btnHolder)}>
          <CopyButton
            text={codeString}
            className={classNames(styles.copyBtn)}
          />
          <CopyButton
            text={`${fullPath}#${path}`}
            className={classNames(styles.linkBtn)}
            copyIcon={linkIcon as any} // TODO fix fontawesome typing issue
          />
        </div>
        <SyntaxHighlighter
          language='rust'
          style={androidstudio}
          showLineNumbers
          wrapLongLines
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </CollapsibleCard>
  );
};
