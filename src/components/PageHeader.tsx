import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

export default function PageHeader({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between pl-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 rounded-md p-1.5 px-3 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange/10"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Previous
      </button>
    </div>
  );
}
