import React, { memo } from 'react';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Nav } from 'react-bootstrap';

import { useSCExplorerContext } from 'contexts';
import { VerifiedContractTabsEnum } from 'types';
import styles from './styles.module.scss';
import { LayoutComponentUIType } from './types';

export const LayoutSidebarComponent = (props: LayoutComponentUIType) => {
  const { activeSection } = props;
  const { support, customClassNames, smartContract } = useSCExplorerContext();
  const { abiRegistry } = smartContract;
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
    canUpgrade
  } = support;

  const NavLink = ({
    navKey,
    children
  }: {
    navKey: VerifiedContractTabsEnum;
    children: React.ReactNode;
  }) => (
    <Nav.Link
      eventKey={navKey}
      className={classNames(
        styles?.tab,
        customClassNames?.tabClassName,
        {
          [styles?.tabActive]: activeSection === navKey
        },
        {
          ...(customClassNames?.activeTabClassName
            ? {
                [customClassNames.activeTabClassName]: activeSection === navKey
              }
            : {})
        }
      )}
    >
      {children}
    </Nav.Link>
  );

  const navLinks = {
    [VerifiedContractTabsEnum.loadAbi]: {
      isActive: canLoadAbi,
      title: (
        <>
          Load ABI{' '}
          {Boolean(abiRegistry) && (
            <FontAwesomeIcon
              icon={faCircleCheck}
              className={classNames(styles?.tabLoadAbiIcon)}
            />
          )}
        </>
      )
    },
    [VerifiedContractTabsEnum.details]: {
      isActive: hasBuildInfo,
      title: 'Build Info'
    },
    [VerifiedContractTabsEnum.sourceCode]: {
      isActive: hasSourceCode,
      title: 'Source Code'
    },
    [VerifiedContractTabsEnum.readEndpoints]: {
      isActive: hasReadEndpoints,
      title: 'Read Endpoints'
    },
    [VerifiedContractTabsEnum.writeEndpoints]: {
      isActive: hasWriteEndpoints,
      title: 'Write Endpoints'
    },
    [VerifiedContractTabsEnum.events]: { isActive: hasEvents, title: 'Events' },
    [VerifiedContractTabsEnum.types]: { isActive: hasTypes, title: 'Types' },
    [VerifiedContractTabsEnum.contractConstructor]: {
      isActive: hasConstructor,
      title: 'Constructor'
    },
    [VerifiedContractTabsEnum.deploy]: {
      isActive: canDeploy,
      title: 'Deploy Contract'
    },
    [VerifiedContractTabsEnum.upgrade]: {
      isActive: canUpgrade,
      title: 'Upgrade Contract'
    }
  };

  const visibleTabs = Object.keys(navLinks).filter((key: string) =>
    Boolean((navLinks as any)?.[key]?.isActive)
  );

  return (
    <div className={classNames(styles?.layoutContentSidebar, styles?.tabs)}>
      {visibleTabs.map((visibleTab, index) => (
        <NavLink navKey={visibleTab as VerifiedContractTabsEnum} key={index}>
          {navLinks[visibleTab as keyof typeof navLinks]?.title ?? ''}
        </NavLink>
      ))}
    </div>
  );
};

export const LayoutSidebar = memo(LayoutSidebarComponent);
