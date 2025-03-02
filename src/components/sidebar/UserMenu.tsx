import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ChevronDown, UserPlus, Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import InvitePopup from "@/components/InvitePopup";
export function UserMenu() {
  const {
    user,
    signOut,
    deleteAccount
  } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
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
      navigate('/sign-in');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
  return <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium">{user?.user_metadata?.full_name || 'User'}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <div className="p-2">
            <h3 className="text-lg font-semibold px-2 py-1.5">My Account</h3>
          </div>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowInvitePopup(true)} className="flex items-center gap-2 cursor-pointer">
            <UserPlus className="w-4 h-4" />
            <span>Invite Players</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            <span className="">Delete Account</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowLogoutDialog(true)} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2 " />
            <span className="text-black">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showInvitePopup && <InvitePopup />}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
              <div className="mt-4 text-red-600">
                Please read this message carefully before proceeding.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <p className="mb-2">Type 'Delete' to confirm:</p>
            <Input value={deleteConfirmation} onChange={e => setDeleteConfirmation(e.target.value)} placeholder="Type 'Delete' here" />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
            setDeleteConfirmation("");
            setShowDeleteDialog(false);
          }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} disabled={deleteConfirmation !== "Delete"} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to log out of your account?
              <div className="mt-2 text-[#FF7A00]">
                You will need to log in again to access your account.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 text-left">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
}