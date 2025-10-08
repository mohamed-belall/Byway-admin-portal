import { useAtom } from "jotai";
import Modal from "../common/Modal";
import { deleteDialogAtom, CoursesAtom } from "../../atoms/CourseAtom";
import CourseService from "../../services/CourseService";

const DeleteCourse = () => {
  const [deleteDialog, setDeleteDialog] = useAtom(deleteDialogAtom);
  const [courses, setCourses] = useAtom(CoursesAtom);

  const handleDelete = async () => {
    setDeleteDialog((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await CourseService.deleteCourse(deleteDialog.courseId);

      setCourses((prev) => ({
        ...prev,
        items: prev.items.filter((c) => c.id !== deleteDialog.courseId),
        totalCount: prev.totalCount - 1,
      }));

      handleClose();
    } catch (error) {
      setDeleteDialog((prev) => ({ ...prev, error: error.message }));
    } finally {
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleClose = () => {
    setDeleteDialog({
      open: false,
      courseId: null,
      loading: false,
      error: null,
    });
  };

  return (
    <Modal
      isOpen={deleteDialog.open}
      onClose={handleClose}
      title="Delete Course"
    >
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete this course? This action cannot be
          undone.
        </p>

        {deleteDialog.error && (
          <div className="mt-4 text-sm text-red-600">{deleteDialog.error}</div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteDialog.loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteDialog.loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCourse;
