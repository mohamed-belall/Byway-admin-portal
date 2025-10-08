import React from "react";
import { FaEye, FaTrash, FaPen } from "react-icons/fa";

const CourseCard = ({ course, onView, onEdit, onDelete }) => {
  const renderStars = (rate) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rate ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
      <div className="relative p-3 ">
        <img
          src={
            course.coverURL == "path/path"
              ? "https://media.istockphoto.com/id/1446486926/vector/front-and-back-end-of-development-responsive-web-design-website-interface-coding-and.jpg?s=1024x1024&w=is&k=20&c=hNJEOvRrXqL47KjdGpifhA9qtUAmg6diq7wDHN_WCxE="
              : course.coverURL
          }
          alt={course.title}
          className=" rounded-2xl w-full h-48 border border-gray-300 shadow object-cover"
        />
        <div className="absolute top-6 left-6 border border-gray-400/80 bg-black/20 backdrop-blur-md shadow-md text-xl text-white font-bold px-4 py-1 rounded-2xl">
          {course.categoryName}
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-around p-4">
        <h3 className="text-2xl text-center font-semibold">{course.title}</h3>
        <p className="text-left text-lg font-semibold text-gray-600">
          By {course.instructorName}
        </p>
        <div className=" text-left flex items-center  font-bold text-2xl">
          {renderStars(course.rate)}
        </div>
        <div className="text-left  text-gray-700">
          <span>{course.totalHours} Total Hours, </span>
          <span>{course.totalLectures} Lectures, </span>
          <span className="capitalize">{course.level}</span>
        </div>
        <div className="text-left font-bold text-xl">${course.cost}</div>
        <div className="text-left flex justify-center space-x-5">
          <button
            onClick={() => onView(course.id)}
            className="shadow-md p-3 rounded-xl text-xl text-blue-500 hover:scale-110 transition"
          >
            <FaEye />
          </button>
          <button
            onClick={() => onEdit(course)}
            className="shadow-md p-3 rounded-xl text-xl text-green-500 hover:scale-110 transition"
          >
            <FaPen />
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className=" shadow-md p-3 rounded-xl text-xl text-red-500 hover:scale-110 transition"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
