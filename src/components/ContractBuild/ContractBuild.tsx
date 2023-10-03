import React from 'react';
import { faDocker, faRust } from '@fortawesome/free-brands-svg-icons';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { CopyButton } from '@multiversx/sdk-dapp/UI/CopyButton';
import { Trim } from '@multiversx/sdk-dapp/UI/Trim';
import classNames from 'classnames';

import globalStyles from 'assets/styles/globals.module.scss';
import { CardItem } from 'components';
import { INTERFACE_NAME_PLACEHOLDER } from 'constants/general';
import { useScContext } from 'context';

import styles from './styles.module.scss';
import { ContractBuildUIType } from './types';

export const ContractBuild = ({ customInterface }: ContractBuildUIType) => {
  const { rawAbi, verifiedContract } = useScContext();

  if (!(rawAbi && verifiedContract)) {
    return null;
  }
  return (
    <div
      className={classNames(
        globalStyles.wrapper,
        customInterface?.customClassNames?.wrapperClassName,
        styles.contractBuild
      )}
    >
      <div className={classNames(globalStyles.cardHeader)}>Build Info</div>
      <div className={classNames(globalStyles.cardBody)}>
        <div
          className={classNames(
            globalStyles.cardContainer,
            globalStyles.cardItemContainer,
            customInterface?.customClassNames?.cardItemContainerClassName
          )}
        >
          {rawAbi?.name && rawAbi.name !== INTERFACE_NAME_PLACEHOLDER && (
            <CardItem
              title='Name'
              icon={faCogs}
              customInterface={customInterface}
            >
              {rawAbi.name}
            </CardItem>
          )}
          {rawAbi?.buildInfo?.framework && (
            <CardItem
              title='Framework'
              icon={faCogs}
              customInterface={customInterface}
            >
              {rawAbi.buildInfo?.framework?.name}{' '}
              {rawAbi.buildInfo?.framework?.version}
            </CardItem>
          )}
          {rawAbi?.hasCallback && (
            <CardItem
              title='Has Callback'
              icon={faCogs}
              customInterface={customInterface}
            >
              {String(rawAbi.hasCallback)}
            </CardItem>
          )}
          {verifiedContract?.dockerImage && (
            <CardItem
              title='Docker Image'
              icon={faDocker}
              className={!rawAbi?.hasCallback ? 'double' : ''}
              customInterface={customInterface}
            >
              {verifiedContract.dockerImage}
            </CardItem>
          )}
        </div>

        <div className={classNames(globalStyles.cardContainer)}>
          <h6 className={classNames(globalStyles.cardContainerTitle)}>Rust</h6>
          <div
            className={classNames(
              globalStyles.cardItemContainer,
              customInterface?.customClassNames?.cardItemContainerClassName
            )}
          >
            {rawAbi?.buildInfo?.rustc?.commitDate && (
              <CardItem
                title='Commit Date'
                icon={faRust}
                customInterface={customInterface}
              >
                {rawAbi.buildInfo.rustc.commitDate}
              </CardItem>
            )}
            {rawAbi?.buildInfo?.rustc?.commitHash && (
              <CardItem
                title='Commit Hash'
                icon={faRust}
                customInterface={customInterface}
              >
                <Trim text={rawAbi.buildInfo.rustc.commitHash} />
                <CopyButton text={rawAbi.buildInfo.rustc.commitHash} />
              </CardItem>
            )}
            {rawAbi?.buildInfo?.rustc?.version && (
              <CardItem
                title='Version'
                icon={faRust}
                customInterface={customInterface}
              >
                {rawAbi.buildInfo.rustc.version}
              </CardItem>
            )}
            {rawAbi?.buildInfo?.rustc?.short && (
              <CardItem
                title='Short'
                icon={faRust}
                customInterface={customInterface}
              >
                {rawAbi.buildInfo.rustc.short}
              </CardItem>
            )}
            {rawAbi?.buildInfo?.rustc?.channel && (
              <CardItem
                title='Channel'
                icon={faRust}
                customInterface={customInterface}
              >
                {rawAbi.buildInfo.rustc.channel}
              </CardItem>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
