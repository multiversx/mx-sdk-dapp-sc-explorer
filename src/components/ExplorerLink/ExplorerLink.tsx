import React, { PropsWithChildren } from 'react';

import { MvxExplorerLink, useGetNetworkConfig } from 'lib';
import { UserInterfaceType } from 'types';

export const ExplorerLink = ({
  children,
  page,
  className,
  'data-testid': dataTestId
}: ExplorerLinkPropsType) => {
  const { network } = useGetNetworkConfig();

  return (
    <MvxExplorerLink
      link={`${network.explorerAddress}${page}`}
      class={className}
      dataTestId={dataTestId}
    >
      {children ? <>{children}</> : null}
    </MvxExplorerLink>
  );
};

export interface ExplorerLinkPropsType
  extends UserInterfaceType,
    PropsWithChildren {
  page: string;
}
