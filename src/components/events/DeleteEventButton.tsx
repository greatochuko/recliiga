import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import DeleteEventModal from "./DeleteEventModal";

export default function DeleteEventButton({
  eventId,
  refetchEvents,
}: {
  eventId: string;
  refetchEvents: () => void;
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setModalIsOpen(true)}
        variant="outline"
        size="sm"
        className="flex items-center text-red-500 hover:text-red-700"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>

      <DeleteEventModal
        open={modalIsOpen}
        closeModal={() => setModalIsOpen(false)}
        eventId={eventId}
        refetchEvents={refetchEvents}
      />
    </>
  );
}
