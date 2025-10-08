import { useAtom } from "jotai";
import { deleteDialogAtom, instructorsAtom } from "../../atoms/instructorAtom";

import { LuEye, LuPencilLine, LuTrash2 } from "react-icons/lu";

const InstructorTable = ({ instructors, onView, onEdit }) => {
  const [, setDeleteDialog] = useAtom(deleteDialogAtom);

  const renderStars = (rate) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rate ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div>
      <table className="w-full text-center ">
        <thead>
          <tr className="bg-indigo-100 text-center text-gray-700">
            <th className="py-3 px-4"> Name</th>
            <th className="py-3 px-4"> JobTitle</th>
            <th className="py-3 px-4"> Rate</th>
            <th className="py-3 px-4"> Action</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map((inst) => (
            <tr
              key={inst.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              <td className="px-3 py-4 text-xl font-bold text-gray-600">
                {inst.fullName}
              </td>
              <td className="px-3 py-4 text-xl font-bold text-gray-600">
                {inst.jobTitle}
              </td>

              <td className="px-3 py-4 text-3xl">{renderStars(inst.rate)}</td>
              <td className="py-3 px-4 flex justify-center gap-8 ">
                <button
                  className="text-blue-400 text-xl   hover:scale-130 transition"
                  onClick={() => onView(inst.id)}
                >
                  <LuEye />
                </button>
                <button
                  className="text-blue-400  text-xl  hover:scale-130 transition"
                  onClick={() => onEdit(inst)}
                >
                  <LuPencilLine />
                </button>
                <button
                  className="text-red-500   text-xl  hover:scale-130 transition"
                  onClick={() => {
                    console.log(inst.id);
                    setDeleteDialog({
                      open: true,
                      instructorId: inst.id,
                      instructorName: inst.fullName,
                    });
                  }}
                >
                  <LuTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructorTable;
