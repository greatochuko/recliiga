import { cloneElement, ReactElement } from "react";

interface ModalContainerProps {
  open: boolean;
  closeModal: () => void;
  children: ReactElement;
}

export default function ModalContainer({
  open,
  closeModal,
  children,
}: ModalContainerProps) {
  // useEffect(() => {
  //   if (open) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }
  // }, [open]);

  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm duration-200 ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={closeModal}
    >
      {cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          if (children.props.onClick) {
            children.props.onClick(e); // Preserve original onClick
          }
        },
        className: `${children.props.className ?? ""} ${
          open ? "" : "scale-105"
        } duration-200`,
      })}
    </div>
  );
}
