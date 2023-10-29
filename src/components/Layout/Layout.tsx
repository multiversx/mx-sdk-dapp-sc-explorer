import React, { memo, useEffect, useState } from 'react';
import { Loader } from '@multiversx/sdk-dapp/UI/Loader';
import classNames from 'classnames';
import { Tab, Nav } from 'react-bootstrap';

import {
  ContractBuild,
  ContractEvents,
  ContractFiles,
  ContractTypings,
  ContractConstructor,
  ContractEndpoints,
  LoginModal,
  LoginButton
} from 'components';
import { useSCExplorerContext } from 'contexts';
import {
  SCExplorerType,
  ContractEndpointMutabilityEnum,
  VerifiedContractTabsEnum
} from 'types';
import styles from './styles.module.scss';

export const LayoutComponent = (props: SCExplorerType) => {
  const { support, customClassNames } = useSCExplorerContext();
  const { className, loaderComponent, activeSection, setActiveSection } = props;
  const {
    canView,
    canMutate,
    hasBuildInfo,
    hasSourceCode,
    hasReadEndpoints,
    hasWriteEndpoints,
    hasEvents,
    hasTypes,
    hasConstructor
  } = support;

  const [activeKey, setActiveKey] = useState<VerifiedContractTabsEnum>(
    activeSection ?? VerifiedContractTabsEnum.details
  );

  useEffect(() => {
    if (activeSection && !setActiveSection) {
      setActiveKey(activeSection);
    }
  }, [activeSection]);

  const activePanel = activeSection ?? activeKey;

  if (!canView) {
    return loaderComponent ? <>{loaderComponent}</> : <Loader />;
  }

  return (
    <div className={classNames(className, styles?.layout)}>
      {canMutate && <LoginModal />}
      <div className={classNames(styles?.layoutHeader)}>
        <div className={classNames(styles?.layoutHeaderTitle)}>
          Smart Contract Explorer{' '}
          <span className={classNames(styles?.layoutHeaderSubtitle)}>BETA</span>
        </div>
        <LoginButton />
      </div>
      <div className={classNames(styles?.layoutContent)}>
        <Tab.Container
          defaultActiveKey={activePanel}
          onSelect={(selectedKey) => {
            if (selectedKey) {
              if (setActiveSection) {
                setActiveSection(selectedKey as VerifiedContractTabsEnum);
                return;
              }
              setActiveKey(selectedKey as VerifiedContractTabsEnum);
            }
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
                  customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activePanel === VerifiedContractTabsEnum.details
                  },
                  {
                    ...(customClassNames?.activeTabClassName
                      ? {
                          [customClassNames.activeTabClassName]:
                            activePanel === VerifiedContractTabsEnum.details
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
                  customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activePanel === VerifiedContractTabsEnum.sourceCode
                  },
                  {
                    ...(customClassNames?.activeTabClassName
                      ? {
                          [customClassNames.activeTabClassName]:
                            activePanel === VerifiedContractTabsEnum.sourceCode
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
                  customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activePanel === VerifiedContractTabsEnum.readEndpoints
                  },
                  {
                    ...(customClassNames?.activeTabClassName
                      ? {
                          [customClassNames.activeTabClassName]:
                            activePanel ===
                            VerifiedContractTabsEnum.readEndpoints
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
                  customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activePanel === VerifiedContractTabsEnum.writeEndpoints
                  },
                  {
                    ...(customClassNames?.activeTabClassName
                      ? {
                          [customClassNames.activeTabClassName]:
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
                  customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activePanel === VerifiedContractTabsEnum.events
                  },
                  {
                    ...(customClassNames?.activeTabClassName
                      ? {
                          [customClassNames.activeTabClassName]:
                            activePanel === VerifiedContractTabsEnum.events
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
                  customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activePanel === VerifiedContractTabsEnum.types
                  },
                  {
                    ...(customClassNames?.activeTabClassName
                      ? {
                          [customClassNames.activeTabClassName]:
                            activePanel === VerifiedContractTabsEnum.types
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
                  customClassNames?.tabClassName,
                  {
                    [styles?.tabActive]:
                      activePanel ===
                      VerifiedContractTabsEnum.contractConstructor
                  },
                  {
                    ...(customClassNames?.activeTabClassName
                      ? {
                          [customClassNames.activeTabClassName]:
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
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};

export const Layout = memo(LayoutComponent);
