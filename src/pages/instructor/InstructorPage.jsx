import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  instructorFiltersAtom,
  instructorFormAtom,
  instructorsAtom,
  searchAtom,
} from "../../atoms/instructorAtom";
import InstructorTable from "../../components/instructor/InstructorTable";
import instructorService from "../../services/instructorService";
import Pagination from "../../components/common/Pagination";
import InstructorForm from "../../components/instructor/InstructorForm";
import DeleteInstructor from "../../components/instructor/DeleteInstructor";
import ViewInstructor from "../../components/instructor/ViewInstructor";

const Instructorpage = () => {
  const [instructors, setInstructors] = useAtom(instructorsAtom);
  const [filters, setFilters] = useAtom(instructorFiltersAtom);
  const [, setForm] = useAtom(instructorFormAtom);
  const [viewModal, setViewModal] = useState({
    open: false,
    instructorId: null,
  });

  // const [search, setSearch] = useAtom(searchAtom);

  const fetchInstructors = async () => {
    setInstructors((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await instructorService.getInstructors(filters);
      setInstructors({
        items: data.data,
        totalCount: data.count,
        loading: false,
        error: null,
      });
    } catch (error) {
      setInstructors((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failded to fetch instructors",
      }));
    }
  };

  useEffect(() => {
    fetchInstructors();
    console.log(instructors);
  }, [filters]);

  const handleSearch = (e) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value === "" ? null : e.target.value,
      pageIndex: 1,
    }));
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

  const handleView = (instructorId) => {
    setViewModal({
      open: true,
      instructorId,
    });
  };

  const handleEdit = (instructor) => {
    setForm({
      open: true,
      mode: "edit",
      data: instructor,
      loading: false,
      error: null,
    });
  };

  return (
    <div className=" flex flex-col px-5 py-5 bg-white w-full shadow-md rounded-2xl h-auto">
      <div className="flex flex-row justify-between items-center  ">
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="font-bold text-2xl">Instructors</div>
          <div className="px-3 py-1 bg-gray-200 rounded-2xl">
            {instructors.totalCount}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between gap-3">
          <button
            type="submit"
            onClick={handleAddClick}
            className="w-full px-4 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Add Instructor
          </button>
          <div
            className="flex items-center bg-white px-3 py-2 rounded-lg shadow-md border-2 border-gray-50
          "
          >
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search for Instructors"
              value={filters.search}
              onChange={handleSearch}
              className="bg-transparent outline-none px-2"
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white  rounded-xl  shadow-md my-10 overflow-hidden">
        {instructors.loading ? (
          <div className="text-center  text-6xl my-20">Loading...</div>
        ) : instructors.error ? (
          <div className="p-8 text-center text-red-600">
            {instructors.error}
          </div>
        ) : (
          <InstructorTable
            instructors={instructors.items}
            onView={handleView}
            onEdit={handleEdit}
          />
        )}
      </div>

      <Pagination
        filters={filters}
        setFilters={setFilters}
        totalCount={instructors.totalCount}
      />
      {/* Modals */}
      <InstructorForm />
      <DeleteInstructor />
      <ViewInstructor
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, instructorId: null })}
        instructorId={viewModal.instructorId}
      />
    </div>
  );
};

export default Instructorpage;
