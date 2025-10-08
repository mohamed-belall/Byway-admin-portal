import { FiBell } from "react-icons/fi";

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-700">Courses</h1>

      <div className="flex items-center gap-6">
        <button className="text-gray-500 hover:text-gray-700">
          <FiBell size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
          J
        </div>
      </div>
    </header>
  );
};

export default Header;
