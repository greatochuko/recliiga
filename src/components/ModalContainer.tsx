export default function ModalContainer({
  open,
  closeModal,
  children,
}: {
  open: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm duration-200 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      onClick={closeModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${open ? "" : "scale-105"} duration-200`}
      >
        {children}
      </div>
    </div>
  );
}
