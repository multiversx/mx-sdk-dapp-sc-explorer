import React, { memo } from 'react';
import { faDocker, faRust } from '@fortawesome/free-brands-svg-icons';
import { faCogs, faCopy } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import { CardItem, PanelHeader } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';
import { MvxCopyButton, MvxTrim } from 'lib';

export const ContractBuildComponent = ({
  globalStyles,
  styles
}: WithStylesImportType) => {
  const { smartContract, support, customClassNames } = useSCExplorerContext();
  const { rawAbi, verifiedContract } = smartContract;
  const { hasBuildInfo } = support;

  if (!hasBuildInfo) {
    return null;
  }

  return (
    <div
      className={classNames(
        globalStyles?.wrapper,
        customClassNames?.wrapperClassName,
        styles?.contractBuild
      )}
    >
      <PanelHeader>Build Info</PanelHeader>
      <div className={classNames(globalStyles?.cardBody)}>
        <div
          className={classNames(
            globalStyles?.cardContainer,
            globalStyles?.cardItemContainer,
            customClassNames?.cardItemContainerClassName
          )}
        >
          {rawAbi?.name && (
            <CardItem title='Name' icon={faCogs}>
              {rawAbi.name}
            </CardItem>
          )}
          {rawAbi?.buildInfo?.framework && (
            <CardItem title='Framework' icon={faCogs}>
              {rawAbi.buildInfo?.framework?.name}{' '}
              {rawAbi.buildInfo?.framework?.version}
            </CardItem>
          )}
          {rawAbi?.hasCallback && (
            <CardItem title='Has Callback' icon={faCogs}>
              {String(rawAbi.hasCallback)}
            </CardItem>
          )}
          {verifiedContract?.dockerImage && (
            <CardItem
              title='Docker Image'
              icon={faDocker}
              className={!rawAbi?.hasCallback ? 'double' : ''}
            >
              {verifiedContract.dockerImage}
            </CardItem>
          )}
        </div>

        {rawAbi?.buildInfo?.rustc && (
          <div className={classNames(globalStyles?.cardContainer)}>
            <h6 className={classNames(globalStyles?.cardContainerTitle)}>
              Rust
            </h6>
            <div
              className={classNames(
                globalStyles?.cardItemContainer,
                customClassNames?.cardItemContainerClassName
              )}
            >
              {rawAbi.buildInfo.rustc?.commitDate && (
                <CardItem title='Commit Date' icon={faRust}>
                  {rawAbi.buildInfo.rustc.commitDate}
                </CardItem>
              )}
              {rawAbi.buildInfo.rustc?.commitHash && (
                <CardItem title='Commit Hash' icon={faRust}>
                  <MvxTrim text={rawAbi.buildInfo.rustc.commitHash} />
                  <MvxCopyButton text={rawAbi.buildInfo.rustc.commitHash} />
                </CardItem>
              )}
              {rawAbi.buildInfo.rustc?.version && (
                <CardItem title='Version' icon={faRust}>
                  {rawAbi.buildInfo.rustc.version}
                </CardItem>
              )}
              {rawAbi.buildInfo.rustc?.channel && (
                <CardItem title='Channel' icon={faRust}>
                  {rawAbi.buildInfo.rustc.channel}
                </CardItem>
              )}
              {rawAbi.buildInfo.rustc?.short && (
                <CardItem title='Short' icon={faRust}>
                  {rawAbi.buildInfo.rustc.short}
                </CardItem>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const MemoizedContractBuild = memo(ContractBuildComponent);

export const ContractBuild = withStyles(MemoizedContractBuild, {
  ssrStyles: () => import('components/ContractBuild/styles.module.scss'),
  clientStyles: () =>
    require('components/ContractBuild/styles.module.scss').default
});
