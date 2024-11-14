import React, { memo, useEffect } from 'react';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isWindowAvailable } from '@multiversx/sdk-dapp/utils/isWindowAvailable';
import classNames from 'classnames';
import { Nav } from 'react-bootstrap';

import { Badge } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { useGetContractEndpointCount } from 'hooks';
import { VerifiedContractTabsEnum, DataTestIdsEnum } from 'types';

import { LayoutComponentUIType, LayoutSidebarNavLinksType } from './types';

export const LayoutSidebarComponent = (props: LayoutComponentUIType) => {
  const { activeSection, styles } = props;
  const { support, customClassNames, smartContract } = useSCExplorerContext();
  const { readEndpointsCount, writeEndpointsCount } =
    useGetContractEndpointCount();
  const { abiRegistry } = smartContract;
  const {
    hasBuildInfo,
    hasSourceCode,
    hasReadEndpoints,
    hasWriteEndpoints,
    hasEvents,
    hasTypes,
    hasConstructor,
    hasContractDetails,
    canLoadAbi,
    canDeploy,
    canUpgrade
  } = support;

  const NavLink = ({
    navKey,
    children,
    'data-testid': dataTestId
  }: {
    navKey: VerifiedContractTabsEnum;
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <Nav.Link
      eventKey={navKey}
      data-testid={dataTestId ?? ''}
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

  const navLinks: LayoutSidebarNavLinksType = {
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
    [VerifiedContractTabsEnum.contractDetails]: {
      isActive: hasContractDetails,
      title: 'Contract Details'
    },
    [VerifiedContractTabsEnum.sourceCode]: {
      isActive: hasSourceCode,
      title: 'Source Code'
    },
    [VerifiedContractTabsEnum.readEndpoints]: {
      isActive: hasReadEndpoints,
      title: 'Read Endpoints',
      badge: readEndpointsCount
    },
    [VerifiedContractTabsEnum.writeEndpoints]: {
      isActive: hasWriteEndpoints,
      title: 'Write Endpoints',
      badge: writeEndpointsCount
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

  // Fixes Trim re-render bug
  useEffect(() => {
    setTimeout(() => {
      if (isWindowAvailable()) {
        window.dispatchEvent(new Event('resize'));
      }
    }, 0);
  }, [visibleTabs]);

  return (
    <div className={classNames(styles?.layoutContentSidebar, styles?.tabs)}>
      {visibleTabs.map((visibleTab, index) => {
        const currentNavLink = navLinks[visibleTab as keyof typeof navLinks];

        return (
          <NavLink
            navKey={visibleTab as VerifiedContractTabsEnum}
            key={index}
            data-testid={`${DataTestIdsEnum.prefix}${visibleTab}-button`}
          >
            {currentNavLink?.title ?? ''}
            {currentNavLink?.badge && (
              <Badge
                badgeValue={currentNavLink.badge}
                className={classNames(customClassNames?.badgeFilledClassName)}
              />
            )}
          </NavLink>
        );
      })}
    </div>
  );
};

export const MemoizedLayoutSidebar = memo(LayoutSidebarComponent);

export const LayoutSidebar = withStyles(MemoizedLayoutSidebar, {
  ssrStyles: () => import('components/Layout/styles.module.scss'),
  clientStyles: () => require('components/Layout/styles.module.scss').default
});
