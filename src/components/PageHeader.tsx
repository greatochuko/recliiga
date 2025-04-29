import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "lucide-react";

export default function PageHeader({ title }: { title: string }) {
  const navigate = useNavigate();

  function navigateBack() {
    navigate(-1);
  }
  return (
    <div className="flex items-center justify-between pl-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button
        variant="link"
        size="sm"
        className="text-accent-orange"
        onClick={navigateBack}
      >
        <ChevronLeftIcon className="mr-1 h-4 w-4" />
        Previous
      </Button>
    </div>
  );
}
