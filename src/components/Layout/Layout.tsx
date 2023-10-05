import React, { memo, useState } from 'react';
import { Loader } from '@multiversx/sdk-dapp/UI/Loader';
import classNames from 'classnames';
import { Tab, Nav } from 'react-bootstrap';

import {
  ContractBuild,
  ContractEvents,
  ContractFiles,
  ContractTypings,
  ContractConstructor,
  ContractEndpoints
} from 'components';
import { useSupport } from 'hooks';
import {
  SCExplorerType,
  ContractEndpointMutabilityEnum,
  VerifiedContractTabsEnum
} from 'types';

import styles from './styles.module.scss';

export const LayoutComponent = (props: SCExplorerType) => {
  const { loaderComponent, customInterface } = props;
  const {
    canView,
    hasBuildInfo,
    hasSourceCode,
    hasReadEndpoints,
    hasWriteEndpoints,
    hasEvents,
    hasTypes,
    hasConstructor
  } = useSupport();

  const [activeKey, setActiveKey] = useState<VerifiedContractTabsEnum>(
    VerifiedContractTabsEnum.details
  );

  if (!canView) {
    return loaderComponent ? <>{loaderComponent}</> : <Loader />;
  }

  return (
    <div className={classNames(styles?.layout)}>
      <div className={classNames(styles?.layoutHeader)}>
        <div className={classNames(styles?.layoutHeaderTitle)}>
          Smart Contract Explorer{' '}
          <span className={classNames(styles?.layoutHeaderSubtitle)}>BETA</span>
        </div>
      </div>
      <div className={classNames(styles?.layoutContent)}>
        <Tab.Container
          defaultActiveKey={activeKey}
          onSelect={(selectedKey) => {
            return selectedKey
              ? setActiveKey(selectedKey as VerifiedContractTabsEnum)
              : VerifiedContractTabsEnum.details;
          }}
          transition={false}
        >
          <div
            className={classNames(styles?.layoutContentSidebar, styles?.tabs)}
          >
            {hasBuildInfo && (
              <Nav.Link
                eventKey={VerifiedContractTabsEnum.details}
                className={classNames(
                  styles?.tab,
                  customInterface?.customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activeKey === VerifiedContractTabsEnum.details
                  },
                  {
                    ...(customInterface?.customClassNames?.activeTabClassName
                      ? {
                          [customInterface.customClassNames.activeTabClassName]:
                            activeKey === VerifiedContractTabsEnum.details
                        }
                      : {})
                  }
                )}
              >
                Build Info
              </Nav.Link>
            )}

            {hasSourceCode && (
              <Nav.Link
                eventKey={VerifiedContractTabsEnum.sourceCode}
                className={classNames(
                  styles?.tab,
                  customInterface?.customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activeKey === VerifiedContractTabsEnum.sourceCode
                  },
                  {
                    ...(customInterface?.customClassNames?.activeTabClassName
                      ? {
                          [customInterface.customClassNames.activeTabClassName]:
                            activeKey === VerifiedContractTabsEnum.sourceCode
                        }
                      : {})
                  }
                )}
              >
                Source Code
              </Nav.Link>
            )}

            {hasReadEndpoints && (
              <Nav.Link
                eventKey={VerifiedContractTabsEnum.readEndpoints}
                className={classNames(
                  styles?.tab,
                  customInterface?.customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activeKey === VerifiedContractTabsEnum.readEndpoints
                  },
                  {
                    ...(customInterface?.customClassNames?.activeTabClassName
                      ? {
                          [customInterface.customClassNames.activeTabClassName]:
                            activeKey === VerifiedContractTabsEnum.readEndpoints
                        }
                      : {})
                  }
                )}
              >
                Read Endpoints
              </Nav.Link>
            )}

            {hasWriteEndpoints && (
              <Nav.Link
                eventKey={VerifiedContractTabsEnum.writeEndpoints}
                className={classNames(
                  styles?.tab,
                  customInterface?.customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activeKey === VerifiedContractTabsEnum.writeEndpoints
                  },
                  {
                    ...(customInterface?.customClassNames?.activeTabClassName
                      ? {
                          [customInterface.customClassNames.activeTabClassName]:
                            activeKey ===
                            VerifiedContractTabsEnum.writeEndpoints
                        }
                      : {})
                  }
                )}
              >
                Write Endpoints
              </Nav.Link>
            )}

            {hasEvents && (
              <Nav.Link
                eventKey={VerifiedContractTabsEnum.events}
                className={classNames(
                  styles?.tab,
                  customInterface?.customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activeKey === VerifiedContractTabsEnum.events
                  },
                  {
                    ...(customInterface?.customClassNames?.activeTabClassName
                      ? {
                          [customInterface.customClassNames.activeTabClassName]:
                            activeKey === VerifiedContractTabsEnum.events
                        }
                      : {})
                  }
                )}
              >
                Events
              </Nav.Link>
            )}

            {hasTypes && (
              <Nav.Link
                eventKey={VerifiedContractTabsEnum.types}
                className={classNames(
                  styles?.tab,
                  customInterface?.customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activeKey === VerifiedContractTabsEnum.types
                  },
                  {
                    ...(customInterface?.customClassNames?.activeTabClassName
                      ? {
                          [customInterface.customClassNames.activeTabClassName]:
                            activeKey === VerifiedContractTabsEnum.types
                        }
                      : {})
                  }
                )}
              >
                Types
              </Nav.Link>
            )}

            {hasConstructor && (
              <Nav.Link
                eventKey={VerifiedContractTabsEnum.contractConstructor}
                className={classNames(
                  styles?.tab,
                  customInterface?.customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activeKey === VerifiedContractTabsEnum.contractConstructor
                  },
                  {
                    ...(customInterface?.customClassNames?.activeTabClassName
                      ? {
                          [customInterface.customClassNames.activeTabClassName]:
                            activeKey ===
                            VerifiedContractTabsEnum.contractConstructor
                        }
                      : {})
                  }
                )}
              >
                Constructor
              </Nav.Link>
            )}
          </div>

          <Tab.Content className={classNames(styles?.layoutContentBody)}>
            {hasBuildInfo && (
              <Tab.Pane
                eventKey={VerifiedContractTabsEnum.details}
                bsPrefix={styles?.tabPanel}
              >
                <ContractBuild customInterface={customInterface} />
              </Tab.Pane>
            )}

            {hasSourceCode && (
              <Tab.Pane
                eventKey={VerifiedContractTabsEnum.sourceCode}
                bsPrefix={styles?.tabPanel}
              >
                <ContractFiles customInterface={customInterface} />
              </Tab.Pane>
            )}

            {hasReadEndpoints && (
              <Tab.Pane
                eventKey={VerifiedContractTabsEnum.readEndpoints}
                bsPrefix={styles?.tabPanel}
              >
                <ContractEndpoints
                  customInterface={customInterface}
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
                  customInterface={customInterface}
                  mutability={ContractEndpointMutabilityEnum.mutable}
                />
              </Tab.Pane>
            )}

            {hasEvents && (
              <Tab.Pane
                eventKey={VerifiedContractTabsEnum.events}
                bsPrefix={styles?.tabPanel}
              >
                <ContractEvents customInterface={customInterface} />
              </Tab.Pane>
            )}

            {hasTypes && (
              <Tab.Pane
                eventKey={VerifiedContractTabsEnum.types}
                bsPrefix={styles?.tabPanel}
              >
                <ContractTypings customInterface={customInterface} />
              </Tab.Pane>
            )}

            {hasConstructor && (
              <Tab.Pane
                eventKey={VerifiedContractTabsEnum.contractConstructor}
                bsPrefix={styles?.tabPanel}
              >
                <ContractConstructor customInterface={customInterface} />
              </Tab.Pane>
            )}
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export const Layout = memo(LayoutComponent);
