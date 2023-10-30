import React from 'react';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { Overlay } from 'components';
import { useSCExplorerContext } from 'contexts';
import styles from './styles.module.scss';
import { DocsTooltipUIType } from './types';

export const DocsTooltip = (props: DocsTooltipUIType) => {
  const { icons } = useSCExplorerContext();
  const { docs, ...rest } = props;
  const { hintIcon = faQuestionCircle } = icons ?? {};

  if (!docs || docs.length === 0) {
    return null;
  }

  const DocsContent = () => (
    <div className={classNames(styles.docsTooltip)}>
      {docs.map((row, key) => (
        <p key={key}>
          <code>{row}</code>
        </p>
      ))}
    </div>
  );

  return (
    <Overlay {...rest} title={<DocsContent />}>
      <FontAwesomeIcon icon={hintIcon} />
    </Overlay>
  );
};
