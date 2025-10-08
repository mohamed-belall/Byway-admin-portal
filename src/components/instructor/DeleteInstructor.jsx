import { useAtom } from "jotai";
import Modal from "../common/Modal";
import { deleteDialogAtom, instructorsAtom } from "../../atoms/instructorAtom";
import instructorService from "../../services/instructorService";
import deleteIcon from "../../assets/Icon/delete.svg";
import { MdErrorOutline } from "react-icons/md";

const DeleteInstructor = () => {
  const [deleteDialog, setDeleteDialog] = useAtom(deleteDialogAtom);
  const [instructors, setInstructors] = useAtom(instructorsAtom);

  const handleDelete = async () => {
    setDeleteDialog((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await instructorService.deleteInstructor(
        deleteDialog.instructorId
      );

 

      setInstructors((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== deleteDialog.instructorId),
        totalCount: prev.totalCount - 1,
      }));

      handleClose();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Failed to delete instructor.";
      setDeleteDialog((prev) => ({ ...prev, error: backendMessage }));
    } finally {
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleClose = () => {
    setDeleteDialog({
      open: false,
      instructorId: null,
      instructorName: null,
      loading: false,
      error: null,
    });
  };

  return (
    <Modal
      isOpen={deleteDialog.open}
      onClose={handleClose}
      // title="Delete Instructor"
    >
      <div className="flex flex-col items-center gap-5 ">
        <div className="bg-red-50 p-5 rounded-full">
          <div className="bg-red-100 p-5 rounded-full">
            <img src={deleteIcon} alt="" className="w-34 h-34     " />
          </div>
        </div>
        <p className="text-2xl text-center font-semibold text-gray-500 max-w-xl px-10">
          Are you sure you want to delete this instructor{" "}
          <span className="text-black font-bold">
            {deleteDialog.instructorName}
          </span>
          ?
        </p>

        {deleteDialog.error && (
          <div className="mt-4 flex items-center gap-3 rounded-md bg-red-600/10 border border-red-600 text-red-700 px-4 py-3 text-sm font-medium shadow">
            <MdErrorOutline size={30} />

            <span className="text-lg">{deleteDialog.error}</span>
          </div>
        )}

        <div className="w-full mt-6 flex justify-between  gap-3">
          <button
            type="button"
            onClick={handleClose}
            className=" rounded-md border border-gray-300 px-7 py-2 text-xl font-bold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteDialog.loading}
            className="flex-1 rounded-md bg-red-700  py-5 text-xl font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteDialog.loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteInstructor;
