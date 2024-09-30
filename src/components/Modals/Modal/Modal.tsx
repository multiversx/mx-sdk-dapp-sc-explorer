import React from 'react';
import classNames from 'classnames';
import { Modal as BsModal } from 'react-bootstrap';

import { withStyles } from 'hocs/withStyles';
import { ModalUIType } from 'types';

export const ModalComponent = (props: ModalUIType) => {
  const {
    show = false,
    onClose,
    children,
    title,
    footer,
    className,
    styles
  } = props;

  return (
    <BsModal
      show={show}
      onHide={onClose}
      keyboard={false}
      backdrop='static'
      animation={false}
      centered={true}
      className={classNames(styles?.modal, className)}
      dialogClassName={classNames(styles?.modalDialog)}
    >
      {title && (
        <BsModal.Header
          closeButton
          closeVariant='white'
          className={classNames(styles?.modalHeader)}
        >
          {title}
        </BsModal.Header>
      )}
      <BsModal.Body className={classNames(styles?.modalBody)}>
        {children}
      </BsModal.Body>
      {footer && (
        <BsModal.Footer className={classNames(styles?.modalFooter)}>
          {footer}
        </BsModal.Footer>
      )}
    </BsModal>
  );
};

export const Modal = withStyles(ModalComponent, {
  ssrStyles: () => import('components/Modals/Modal/styles.module.scss'),
  clientStyles: () =>
    require('components/Modals/Modal/styles.module.scss').default
});
