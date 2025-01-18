import { Link, useNavigate } from "react-router-dom";
import { Link2, LogOut, Settings, User } from "lucide-react";
import toast from "react-hot-toast";
import { useCheckQuery, useLogoutMutation } from "../store/api/authApiSlice";
export default function Navbar() {
  const { data: user } = useCheckQuery();
  const [logout, { isSuccess }] = useLogoutMutation();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      if (isSuccess) {
        toast.success("Logout was successful");
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to={user ? "/blogs" : "/"}
          className="flex items-center gap-2.5 hover:opacity-80 transition-all"
        >
          <h1 className="text-lg font-bold">blog App</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
          {user && (
            <>
              <Link to="/profile" className="btn btn-sm gap-2">
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button
                className="flex gap-2 items-center"
                onClick={handleLogout}
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
