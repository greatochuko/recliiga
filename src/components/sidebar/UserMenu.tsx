import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ChevronDown, UserPlus, Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import InvitePopup from "@/components/InvitePopup";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
export function UserMenu() {
  const { user, signOut, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showInvitePopup, setShowInvitePopup] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/sign-in");
      toast.success("Successfully logged out", {
        style: { color: "#16a34a" },
      });
    } catch (error) {
      console.log(error.message);
      toast.error("Error logging out");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "Delete") {
      toast.error('Please type "Delete" to confirm');
      return;
    }
    try {
      await deleteAccount();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-2">
            {user.avatar_url ? (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.avatar_url}
                  alt="Player avatar"
                  className="object-cover"
                  sizes="64px"
                />
                <AvatarFallback className="text-gray-800">
                  {getInitials(user.full_name)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <User className="h-5 w-5 text-gray-500" />
            )}
            <span className="text-sm font-medium">
              {user?.full_name.split(" ")[0] || "User"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="center">
          <div className="p-2">
            <h3 className="text-lg font-semibold">My Account</h3>
          </div>
          <DropdownMenuItem asChild>
            <Link
              to="/dashboard/profile"
              className="flex cursor-pointer items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowInvitePopup(true)}
            className="flex cursor-pointer items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Players</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="">Delete Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowLogoutDialog(true)}
            className="text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="text-black">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InvitePopup
        open={showInvitePopup}
        closeModal={() => setShowInvitePopup(false)}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
              <div className="mt-4 text-red-600">
                Please read this message carefully before proceeding.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <p className="mb-2">Type 'Delete' to confirm:</p>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type 'Delete' here"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmation("");
                setShowDeleteDialog(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== "Delete"}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="mx-auto w-[90%] rounded-lg p-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to log out of your account?
              <div className="mt-2 text-accent-orange">
                You will need to log in again to access your account.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-center gap-4 sm:items-center sm:justify-center">
            <AlertDialogCancel className="mt-0 border-gray-200 text-left">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-accent-orange text-white hover:bg-accent-orange/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
