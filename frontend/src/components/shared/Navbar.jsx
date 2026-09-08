import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { ModeToggle } from "@/components/ModeToggle";
import { logoutUser } from "@/redux/authSlice";
import { setSearchedQuery } from "@/redux/jobSlice";
import { toast } from "sonner";
import api from "@/lib/axios";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.get('/user/logout');
      if (res.data.success) {
        dispatch(logoutUser());
        navigate("/login");
        toast.success(res.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.msg || "Failed to logout");
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40"
    >
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-6">
        
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Link to="/">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Career<span className="text-muted-foreground font-medium">Nest</span>
            </h1>
          </Link>
        </motion.div>

        {/* Links & Actions */}
        <div className="flex items-center gap-8">
          <ul className="hidden md:flex font-medium text-sm text-muted-foreground items-center gap-8">
            {user?.role === 'Recruiter' ? (
              <>
                <li className="hover:text-foreground transition-colors"><Link to="/admin/companies">Companies</Link></li>
                <li className="hover:text-foreground transition-colors"><Link to="/admin/jobs">Jobs</Link></li>
              </>
            ) : (
              <>
                <li className="hover:text-foreground transition-colors"><Link to="/">Home</Link></li>
                <li className="hover:text-foreground transition-colors"><Link to="/jobs" onClick={() => dispatch(setSearchedQuery(""))}>Jobs</Link></li>
                <li className="hover:text-foreground transition-colors"><Link to="/browse">Browse</Link></li>
                {user && (
                  <li className="hover:text-foreground transition-colors"><Link to="/applications">Applications</Link></li>
                )}
              </>
            )}
          </ul>

          <div className="flex items-center gap-4">
            <ModeToggle />
            
            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-sm font-medium hover:bg-muted/50">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="text-sm font-medium rounded-full px-6 shadow-sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer border border-border h-9 w-9 ring-offset-background transition-colors hover:ring-2 hover:ring-ring hover:ring-offset-2">
                    <AvatarImage src={user?.profile?.profilePhoto || ""} />
                    <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                      {user?.fullname?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4 mt-2 rounded-xl shadow-lg border-border/40" align="end">
                  <div className="flex gap-4 items-center mb-4">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={user?.profile?.profilePhoto || ""} />
                      <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                        {user?.fullname?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <h4 className="font-semibold text-sm text-foreground">{user?.fullname}</h4>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {user?.profile?.bio || "No bio yet"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Link to="/profile">
                      <div className="flex items-center w-full px-2 py-1.5 cursor-pointer rounded-md hover:bg-muted transition-colors text-sm font-medium">
                        <User2 className="mr-2 h-4 w-4 text-muted-foreground" />
                        View Profile
                      </div>
                    </Link>
                    <div 
                      onClick={handleLogout}
                      className="flex items-center w-full px-2 py-1.5 cursor-pointer rounded-md hover:bg-destructive/10 text-destructive transition-colors text-sm font-medium"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
