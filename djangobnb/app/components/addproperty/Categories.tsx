interface CategoriesProps {
  dataCategory: string;
  setCategory: (category: string) => void;
}

const categories = [
  {
    key: "beach",
    label: "Beach",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16c2.5 0 3.5 2 6 2s3.5-2 6-2 3.5 2 6 2"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 10l8-4 8 4" />
      </svg>
    ),
  },
  {
    key: "cabins",
    label: "Cabins",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 11l8-5 8 5v7H4v-7Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18v-5h6v5" />
      </svg>
    ),
  },
  {
    key: "tiny-homes",
    label: "Tiny homes",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12l7-6 7 6v7H5v-7Z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19v-4h4v4" />
      </svg>
    ),
  },
  {
    key: "lake",
    label: "Lake",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 14c2 0 3 1.5 5 1.5S12 14 14 14s3 1.5 5 1.5 3-1.5 5-1.5"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l3-3 3 3" />
      </svg>
    ),
  },
  {
    key: "camping",
    label: "Camping",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 19L12 5l9 14"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 19l5-8 5 8" />
      </svg>
    ),
  },
  {
    key: "city",
    label: "City",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 20V6l6-2v16m4 0V8l6-2v14"
        />
      </svg>
    ),
  },
  {
    key: "countryside",
    label: "Countryside",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 19l6-8 4 5 6-9"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 19h18" />
      </svg>
    ),
  },
  {
    key: "skiing",
    label: "Skiing",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4l4 4 6-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 20l14-4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3" />
      </svg>
    ),
  },
  {
    key: "tropical",
    label: "Tropical",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6c-3 0-5 2-6 4 3 0 5-1 6-4Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6c3 0 5 2 6 4-3 0-5-1-6-4Z"
        />
      </svg>
    ),
  },
  {
    key: "desert",
    label: "Desert",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 19c3-2 6-3 9-3s6 1 9 3"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10c1-2 3-3 4-3s3 1 4 3"
        />
      </svg>
    ),
  },
  {
    key: "castles",
    label: "Castles",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 20V8l4 2 4-2 4 2 4-2v12"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20v-6h6v6" />
      </svg>
    ),
  },
];

const Categories: React.FC<CategoriesProps> = ({ dataCategory, setCategory }) => {
  return (
    <>
      <div className="pt-3 cursor-pointer pb-6 flex items-center space-x-12 overflow-x-auto flex-nowrap">
        {categories.map((category) => {
          const isSelected = category.key === dataCategory;
          return (
            <div
              key={category.key}
              onClick={() => setCategory(category.key)}
              className={`shrink-0 pb-4 flex flex-col items-center space-y-2 border-b-2 transition duration-300 ${
                isSelected
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              <span className={isSelected ? "text-gray-900" : "text-gray-600"}>
                {category.icon}
              </span>
              <span className="text-xs font-semibold">{category.label}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Categories;