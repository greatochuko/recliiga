import ModalContainer from "../ModalContainer";
import { toast } from "sonner";
import { deleteEvent } from "@/api/events";
import { useState } from "react";

export default function DeleteEventModal({
  open,
  closeModal,
  eventId,
  refetchEvents,
}: {
  open: boolean;
  closeModal: () => void;
  refetchEvents: () => void;
  eventId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDeleteEvent() {
    setLoading(true);
    const { error } = await deleteEvent(eventId);
    if (!error) {
      refetchEvents();
      toast.success("Event deleted successfully", {
        style: { color: "#16a34a" },
      });
      closeModal();
    } else {
      toast.error("An error occured deleting event", {
        style: { color: "#ef4444" },
      });
    }
    setLoading(false);
  }
  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div className="mx-auto flex w-[90%] max-w-md flex-col items-center justify-center gap-2 rounded-md bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-800">Delete Event</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Are you sure you want to delete this event? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={closeModal}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteEvent}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-500/90 disabled:bg-red-500/50"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}
