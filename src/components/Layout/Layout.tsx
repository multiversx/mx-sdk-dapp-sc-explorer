import React, { memo, useEffect, useState } from 'react';
import { Loader } from '@multiversx/sdk-dapp/UI/Loader';
import classNames from 'classnames';
import { Tab } from 'react-bootstrap';

import { LoginModal, LoginButton } from 'components';
import { useSCExplorerContext } from 'contexts';
import { SCExplorerType, VerifiedContractTabsEnum } from 'types';
import { LayoutPanels } from './LayoutPanels';
import { LayoutSidebar } from './LayoutSidebar';
import styles from './styles.module.scss';

export const LayoutComponent = (props: SCExplorerType) => {
  const { className, loaderComponent, activeSection, setActiveSection } = props;
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

export const Layout = memo(LayoutComponent);
