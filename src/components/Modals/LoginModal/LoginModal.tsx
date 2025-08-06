import { withStyles, WithStylesImportType } from 'hocs/withStyles';

export const LoginModalComponent = ({
  globalStyles,
  styles
}: WithStylesImportType) => {
  return null;
};

export const LoginModal = withStyles(LoginModalComponent, {
  ssrStyles: () => import('components/Modals/LoginModal/styles.module.scss'),
  clientStyles: () =>
    require('components/Modals/LoginModal/styles.module.scss').default
});
