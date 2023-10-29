import React from 'react';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Overlay } from 'components';
import { useSCExplorerContext } from 'contexts';
import { DocsTooltipUIType } from './types';

export const DocsTooltip = (props: DocsTooltipUIType) => {
  const { icons } = useSCExplorerContext();
  const { docs, ...rest } = props;
  const { hintIcon = faQuestionCircle } = icons ?? {};

  if (!docs || docs.length === 0) {
    return null;
  }

  const DocsContent = () => (
    <>
      {docs.map((row, key) => (
        <code key={key}>{row}</code>
      ))}
    </>
  );

  return (
    <Overlay {...rest} title={<DocsContent />}>
      <FontAwesomeIcon icon={hintIcon} />
    </Overlay>
  );
};
