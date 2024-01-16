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
  ContractDeploy,
  ContractUpgrade
} from 'components';
import { useSCExplorerContext } from 'contexts';
import {
  ContractEndpointMutabilityEnum,
  VerifiedContractTabsEnum,
  DataTestIdsEnum
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
    canDeploy,
    canUpgrade,
    canDisplayContractDetails
  } = support;

  return (
    <Tab.Content className={classNames(styles?.layoutContentBody)}>
      {canLoadAbi && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.loadAbi}
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.loadAbi}-panel`}
          bsPrefix={styles?.tabPanel}
        >
          <ContractLoadAbi />
        </Tab.Pane>
      )}

      {hasBuildInfo && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.details}
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.details}-panel`}
          bsPrefix={styles?.tabPanel}
        >
          <ContractBuild />
        </Tab.Pane>
      )}

      {canDisplayContractDetails && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.contractDetails}
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.contractDetails}-panel`}
          bsPrefix={styles?.tabPanel}
        >
          <ContractBuild />
        </Tab.Pane>
      )}

      {hasSourceCode && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.sourceCode}
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.sourceCode}-panel`}
          bsPrefix={styles?.tabPanel}
        >
          <ContractFiles />
        </Tab.Pane>
      )}

      {hasReadEndpoints && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.readEndpoints}
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.readEndpoints}-panel`}
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
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.writeEndpoints}-panel`}
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
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.events}-panel`}
          bsPrefix={styles?.tabPanel}
        >
          <ContractEvents />
        </Tab.Pane>
      )}

      {hasTypes && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.types}
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.types}-panel`}
          bsPrefix={styles?.tabPanel}
        >
          <ContractTypings />
        </Tab.Pane>
      )}

      {hasConstructor && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.contractConstructor}
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.contractConstructor}-panel`}
          bsPrefix={styles?.tabPanel}
        >
          <ContractConstructor />
        </Tab.Pane>
      )}

      {canDeploy && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.deploy}
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.deploy}-panel`}
          bsPrefix={styles?.tabPanel}
        >
          <ContractDeploy />
        </Tab.Pane>
      )}

      {canUpgrade && (
        <Tab.Pane
          eventKey={VerifiedContractTabsEnum.upgrade}
          data-testid={`${DataTestIdsEnum.prefix}${VerifiedContractTabsEnum.upgrade}-panel`}
          bsPrefix={styles?.tabPanel}
        >
          <ContractUpgrade />
        </Tab.Pane>
      )}
    </Tab.Content>
  );
};

export const LayoutPanels = memo(LayoutPanelsComponent);
