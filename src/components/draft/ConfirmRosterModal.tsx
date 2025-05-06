import ModalContainer from "../ModalContainer";

export default function ConfirmRosterModal({
  open,
  loading,
  closeModal,
  handleConfirmRoster,
}: {
  open: boolean;
  loading: boolean;
  closeModal: () => void;
  handleConfirmRoster: () => void;
}) {
  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div className="w-[90%] max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Confirm Roster
        </h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to confirm the selected roster?
          <br />
          <span className="text-red-500">Note: this cannot be undone</span>
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="rounded-md border bg-white px-4 py-2 text-sm font-medium text-gray-800 duration-200 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmRoster}
            className="rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90 disabled:pointer-events-none disabled:bg-accent-orange/50"
            disabled={loading}
          >
            Confirm
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}
