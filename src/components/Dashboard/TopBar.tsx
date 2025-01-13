import { LuMapPin, LuUser } from "react-icons/lu";

const TopBar = () => {
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-300">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="flex items-center text-2xl font-bold gap-1 hover:cursor-pointer hover:text-custom-blue transition-colors duration-200">
            <LuMapPin className="" />
            <span className=" text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
              MapUp
            </span>
          </span>
        </div>
        <button className="flex items-center space-x-2 px-2 hover:bg-gray-100 rounded-lg">
          <LuUser className="h-5 w-5 text-lg text-gray-600" />
          <span className="hidden md:inline mt-1 text-lg font-medium">
            Profile
          </span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
