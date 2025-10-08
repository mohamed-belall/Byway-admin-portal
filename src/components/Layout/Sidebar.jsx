import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiBookOpen, FiLogOut, FiUser } from "react-icons/fi";
import LMSLogo from "../../assets/Icon/lms.png";
import authService from "../../services/authService";
import { authAtom } from "../../atoms/auth";
import { useAtom } from "jotai";
const Sidebar = () => {
  const navItems = [
    { to: "/dashboard", lable: "Dashboard", icon: <FiHome /> },
    { to: "/instructors", lable: "Instructors", icon: <FiUsers /> },
    { to: "/courses", lable: "Courses", icon: <FiBookOpen /> },
  ];
  const [, setAuth] = useAtom(authAtom);
  const navigate = useNavigate();

  const handelLogout = async () => {
    try {
      await authService.logout();

      setAuth({
        isAuthenticated: false,
        user: null,
        token: null,
        role: null,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <aside className="w-64 bg-white shadow-md h-full flex flex-col">
      <button
        className="flex items-center gap-2 p-6"
        onClick={() => navigate("/Dashboard")}
      >
        <img src={LMSLogo} alt="Byway" className="w-8 h-8" />
        <div className=" text-xl font-bold text-indigo-600">Byway</div>
      </button>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-indigo-50 ${
                isActive ? "bg-indigo-100 text-indigo-600 font-medium" : ""
              }`
            }
          >
            {item.icon}
            {item.lable}
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <button
          onClick={handelLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
