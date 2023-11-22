import React from 'react';
import classNames from 'classnames';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import properties from 'react-syntax-highlighter/dist/esm/languages/hljs/properties';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import androidstudio from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';

import styles from './styles.module.scss';
import type { CodeUIType } from './types';

SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('properties', properties);

export const Code = ({
  code,
  language = 'rust',
  showLineNumbers = false,
  wrapLongLines = true
}: CodeUIType) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={androidstudio}
      showLineNumbers={showLineNumbers}
      wrapLongLines={wrapLongLines}
      className={classNames(styles?.code)}
    >
      {code}
    </SyntaxHighlighter>
  );
};
