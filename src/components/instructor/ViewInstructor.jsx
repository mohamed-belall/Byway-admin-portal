import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import instructorService from "../../services/instructorService";

const ViewInstructor = ({ isOpen, onClose, instructorId }) => {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && instructorId) {
      fetchInstructor();
    }
  }, [isOpen, instructorId]);

  const fetchInstructor = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await instructorService.getInstructorById(instructorId);
      setInstructor(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rate) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rate ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Instructor">
      {loading ? (
        <div className="py-4 text-center">Loading...</div>
      ) : error ? (
        <div className="py-4 text-center text-red-600 ">{error}</div>
      ) : instructor ? (
        <div className=" flex flex-col gap-3  min-w-xl mt-4 space-y-4">
          <div className="  flex items-center justify-center ">
            {instructor.profilePictureURL ? (
              <img
                src={instructor.profilePictureURL}
                alt={instructor.fullName}
                className=" h-70 w-70 rounded-full object-cover border-2 border-gray-300 shadow-xl"
              />
            ) : (
              <span className="text-3xl text-gray-500">
                {instructor.fullName.charAt(0)}
              </span>
            )}
          </div>

          <div>
            <h4 className="font-bold text-xl text-gray-900">Name</h4>
            <p className="text-xl py-2 px-2 text-gray-500 rounded-lg border-2 border-gray-300">
              {instructor.fullName}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-xl text-gray-900">Job Title</h4>
            <p className="text-xl py-2 px-2 text-gray-500 rounded-lg border-2 border-gray-300">
              {instructor.jobTitle}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xl text-gray-900">Rate</h4>
            <div className="flex items-center gap-1 text-4xl">
              {renderStars(instructor.rate)}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xl text-gray-900">Bio</h4>
            <p className="text-xl py-2 px-2 text-gray-500 rounded-lg border-2 border-gray-300">
              {instructor.bio}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default ViewInstructor;
