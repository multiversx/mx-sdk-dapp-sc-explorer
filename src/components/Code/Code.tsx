import React from 'react';
import classNames from 'classnames';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import properties from 'react-syntax-highlighter/dist/esm/languages/hljs/properties';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import androidstudio from 'react-syntax-highlighter/dist/esm/styles/hljs/androidstudio';

import { withStyles } from 'hocs/withStyles';
import type { CodeUIType } from './types';

SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('properties', properties);

export const CodeComponent = ({
  code,
  language = 'rust',
  showLineNumbers = false,
  wrapLongLines = true,
  styles
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

export const Code = withStyles(CodeComponent, {
  ssrStyles: () => import('components/Code/styles.module.scss'),
  clientStyles: () => require('components/Code/styles.module.scss').default
});
