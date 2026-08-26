import componentStyles from 'components/Modals/LoginModal/styles.module.scss';
import { withStyles, WithStylesImportType } from 'hocs/withStyles';

export const LoginModalComponent = ({
  globalStyles,
  styles
}: WithStylesImportType) => {
  return null;
};

export const LoginModal = withStyles(LoginModalComponent, {
  styles: componentStyles
});
