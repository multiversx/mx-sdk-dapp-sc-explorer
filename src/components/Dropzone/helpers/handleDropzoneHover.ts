import { DragEvent } from 'react';
import { DropEvent } from 'react-dropzone';

export interface HandleDropzoneHoverType {
  shouldShowHover: boolean;
  event: DropEvent | DragEvent<HTMLDivElement>;
}

export const handleDropzoneHover = ({
  event,
  shouldShowHover
}: HandleDropzoneHoverType) => {
  const hoveredClassName = 'hovered';
  const target = event.target as HTMLElement;
  const hovered = target.classList.contains(hoveredClassName);

  if (shouldShowHover && !hovered) {
    target.classList.add(hoveredClassName);
    return;
  }

  if (!shouldShowHover && hovered) {
    target.classList.remove(hoveredClassName);
  }
};
