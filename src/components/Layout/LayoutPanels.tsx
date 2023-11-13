import React, { memo } from 'react';
import classNames from 'classnames';
import { Tab } from 'react-bootstrap';

import {
  ContractBuild,
  ContractEvents,
  ContractFiles,
  ContractTypings,
  ContractConstructor,
  ContractEndpoints,
  ContractLoadAbi,
  ContractDeploy
} from 'components';
import { useSCExplorerContext } from 'contexts';
import {
  ContractEndpointMutabilityEnum,
  VerifiedContractTabsEnum
} from 'types';
import styles from './styles.module.scss';

export const LayoutPanelsComponent = () => {
  const { support } = useSCExplorerContext();

  const {
    hasBuildInfo,
    hasSourceCode,
    hasReadEndpoints,
    hasWriteEndpoints,
    hasEvents,
    hasTypes,
    hasConstructor,
    canLoadAbi,
    canDeploy
  } = support;

  return (
    <Tab.Content className={classNames(styles?.layoutContentBody)}>
      {canLoadAbi && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.loadAbi}
          bsPrefix={styles?.tabPanel}
        >
          <ContractLoadAbi />
        </Tab.Pane>
      )}
      {hasBuildInfo && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.details}
          bsPrefix={styles?.tabPanel}
        >
          <ContractBuild />
        </Tab.Pane>
      )}

      {hasSourceCode && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.sourceCode}
          bsPrefix={styles?.tabPanel}
        >
          <ContractFiles />
        </Tab.Pane>
      )}

      {hasReadEndpoints && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.readEndpoints}
          bsPrefix={styles?.tabPanel}
        >
          <ContractEndpoints
            mutability={ContractEndpointMutabilityEnum.readonly}
          />
        </Tab.Pane>
      )}

      {hasWriteEndpoints && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.writeEndpoints}
          bsPrefix={styles?.tabPanel}
        >
          <ContractEndpoints
            mutability={ContractEndpointMutabilityEnum.mutable}
          />
        </Tab.Pane>
      )}

      {hasEvents && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.events}
          bsPrefix={styles?.tabPanel}
        >
          <ContractEvents />
        </Tab.Pane>
      )}

      {hasTypes && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.types}
          bsPrefix={styles?.tabPanel}
        >
          <ContractTypings />
        </Tab.Pane>
      )}

      {hasConstructor && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.contractConstructor}
          bsPrefix={styles?.tabPanel}
        >
          <ContractConstructor />
        </Tab.Pane>
      )}

      {canDeploy && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.deploy}
          bsPrefix={styles?.tabPanel}
        >
          <ContractDeploy />
        </Tab.Pane>
      )}
    </Tab.Content>
  );
};

export const LayoutPanels = memo(LayoutPanelsComponent);
