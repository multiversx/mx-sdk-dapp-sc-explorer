import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Tab } from 'react-bootstrap';

import { LoginModal, LoginButton } from 'components';
import { useSCExplorerContext } from 'contexts';
import { withStyles } from 'hocs/withStyles';
import { MvxPreloader } from 'lib';
import { SCExplorerType, VerifiedContractTabsEnum } from 'types';

import { LayoutPanels } from './LayoutPanels';
import { LayoutSidebar } from './LayoutSidebar';

export const LayoutComponent = (props: SCExplorerType) => {
  const {
    className,
    loaderComponent,
    activeSection,
    setActiveSection,
    styles
  } = props;
  const { support, accountInfo } = useSCExplorerContext();
  const { canView, canMutate, canLoadAbi } = support;
  const { onLoginClick } = accountInfo;

  const [activeKey, setActiveKey] = useState<VerifiedContractTabsEnum>(
    activeSection ?? VerifiedContractTabsEnum.details
  );

  useEffect(() => {
    if (activeSection && !setActiveSection) {
      setActiveKey(activeSection);
    }
  }, [activeSection]);

  const activePanel =
    activeSection && setActiveSection ? activeSection : activeKey;

  if (!(canView || canLoadAbi)) {
    return loaderComponent ? <>{loaderComponent}</> : <MvxPreloader />;
  }

  return (
    <div className={classNames(className, styles?.layout)}>
      {canMutate && <LoginModal />}
      <div className={classNames(styles?.layoutHeader)}>
        <div className={classNames(styles?.layoutHeaderTitle)}>
          Smart Contract Explorer{' '}
          <span className={classNames(styles?.layoutHeaderSubtitle)}>BETA</span>
        </div>
        {!Boolean(onLoginClick) && canMutate && <LoginButton />}
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
          <LayoutSidebar activeSection={activePanel} />
          <LayoutPanels />
        </Tab.Container>
      </div>
    </div>
  );
};

export const MemoizedLayout = memo(LayoutComponent);

export const Layout = withStyles(MemoizedLayout, {
  ssrStyles: () => import('components/Layout/styles.module.scss'),
  clientStyles: () => require('components/Layout/styles.module.scss').default
});
