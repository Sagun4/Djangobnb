export default function SearchFilters() {
  return (
    <>
      <div className="h-15 flex flex-row items-center justify-between border rounded-full px-6 py-10 shadow-md">
        <div className="hidden lg:block">
          <div className="flex flex-row items-center justify-between ">
            <div className="cursor-pointer w-62.5 h-16 px-6 flex flex-col justify-center rounded-full  mr-2 hover:bg-gray-100">
              <p className="text-xs font-semibold">Where</p>
              <p className="text-sm text-gray-500 font-medium">Anywhere</p>
            </div>
            <div className="cursor-pointer w-62.5 h-16 px-6 flex flex-col justify-center rounded-full  mr-2 hover:bg-gray-100">
              <p className="text-xs font-semibold">Check-in</p>
              <p className="text-sm text-gray-500 font-medium">Add dates</p>
            </div>
            <div className="cursor-pointer w-62.5 h-16 px-6 flex flex-col justify-center rounded-full  mr-2 hover:bg-gray-100">
              <p className="text-xs font-semibold">Check-out</p>
              <p className="text-sm text-gray-500 font-medium">Add dates</p>
            </div>
            <div className="cursor-pointer w-62.5 h-16 px-6 flex flex-col justify-center rounded-full  mr-2 hover:bg-gray-100">
              <p className="text-xs font-semibold">Guests</p>
              <p className="text-sm text-gray-500 font-medium">Add guests</p>
            </div>
          </div>
        </div>
        <div className="p-2">
          <div className="w-10 h-10 rounded-full bg-airbnb flex items-center justify-center text-white hover:bg-airbnb-hover transition duration-300 cursor-pointer"> 
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
