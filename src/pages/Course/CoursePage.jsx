import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  CourseFiltersAtom,
  CourseFormAtom,
  CoursesAtom,
  deleteDialogAtom,
} from "../../atoms/CourseAtom";
import CourseCard from "../../components/Course/CourseCard";
import Pagination from "../../components/common/Pagination";
import CourseForm from "../../components/Course/CourseForm";
import CourseService from "../../services/CourseService";
import ViewCourse from "../../components/Course/ViewCourse";
import DeleteCourse from "../../components/Course/DeleteCourse";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const Coursepage = () => {
  const [courses, setCourses] = useAtom(CoursesAtom);
  const [filters, setFilters] = useAtom(CourseFiltersAtom);
  const [, setForm] = useAtom(CourseFormAtom);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [, setDeleteDialog] = useAtom(deleteDialogAtom);

  const [viewModal, setViewModal] = useState({
    open: false,
    courseId: null,
  });
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      const response = await CourseService.getCategories();
      setCategory(response);
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchCorses();
  }, [filters]);

  const fetchCorses = async () => {
    setCourses((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await CourseService.getCourses(filters);

      setCourses({
        items: data.data,
        totalCount: data.count,
        loading: false,
        error: null,
      });
    } catch (e) {
      setCourses((prev) => ({ ...prev, loading: false, error: e.message }));
    }
  };

  const handleAddClick = () => {
    setForm({
      open: true,
      mode: "add",
      data: null,
      loading: false,
      error: null,
    });
  };
  const handleView = (courseId) => {
    setViewModal({
      open: true,
      courseId,
    });
  };

  const handleEdit = (course) => {
    setForm({
      open: true,
      mode: "edit",
      data: course,
      loading: false,
      error: null,
    });
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: searchValue,
      pageIndex: 1, // Reset to first page on new search
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e);
    setSelectedCategory(categoryId);
    setFilters((prev) => ({
      ...prev,
      categoryId: isNaN(categoryId) ? null : categoryId,
      pageIndex: 1,
    }));
  };

  return (
    <div className="flex flex-col px-5 py-5 bg-white w-full shadow-md rounded-2xl h-auto">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="font-bold text-2xl">Courses</div>
          <div className="px-3 py-1 bg-gray-200 rounded-2xl">
            {courses.totalCount}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between gap-3">
          <button
            onClick={handleAddClick}
            className="px-4 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Add Course
          </button>

          <Listbox value={selectedCategory} onChange={handleCategoryChange}>
            <div className="relative w-48  z-20">
              <Listbox.Button className=" w-full h-full cursor-pointer font-medium rounded-xl border border-gray-200 bg-white py-2 px-4  text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:text-md">
                <div className="flex flex-row justify-between items-center">
                  <span>
                    {category.find((cat) => cat.id === selectedCategory)
                      ?.name || "All Categories"}
                  </span>
                  <ChevronUpDownIcon className=" right-3 top-1/2 h-5 w-5 text-gray-400" />
                </div>
              </Listbox.Button>
              <Listbox.Options className="absolute mt-3 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-blue-500 ring-opacity-5 focus:outline-none">
                <Listbox.Option value="">
                  {({ active }) => (
                    <div
                      className={`cursor-pointer select-none px-4 py-2 ${
                        active
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-900"
                      }`}
                    >
                      All Categories
                    </div>
                  )}
                </Listbox.Option>
                {category.map((cat) => (
                  <Listbox.Option key={cat.id} value={cat.id}>
                    {({ active, selected }) => (
                      <div
                        className={`cursor-pointer select-none px-4 py-2 flex justify-between ${
                          active
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-900"
                        }`}
                      >
                        {cat.name}
                        {selected && (
                          <CheckIcon className="h-4 w-4 text-indigo-500" />
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>

          <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow border-2 border-gray-200">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search for Courses"
              value={filters.search}
              onChange={handleSearch}
              className="bg-transparent outline-none px-2"
            />
          </div>
        </div>
      </div>

      {courses.error && (
        <div className="text-red-600 text-6xl my-20">
          {courses.error.message}
        </div>
      )}

      {courses.loading ? (
        <div className="text-center  text-6xl my-20">Loading...</div>
      ) : courses.items.length === 0 ? (
        <div className="text-center  text-6xl my-20">
          You haven’t added any courses yet create one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 py-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {courses.items?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={(id) =>
                setDeleteDialog({ open: true, courseId: id, loading: false })
              }
            />
          ))}
        </div>
      )}

      <Pagination
        filters={filters}
        setFilters={setFilters}
        totalCount={courses.totalCount}
      />

      {/* Modals */}
      <CourseForm />
      <DeleteCourse />
      <ViewCourse
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, courseId: null })}
        courseId={viewModal.courseId}
      />
    </div>
  );
};

export default Coursepage;
