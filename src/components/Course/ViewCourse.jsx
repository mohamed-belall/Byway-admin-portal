import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import CourseService from "../../services/CourseService";

const ViewCourse = ({ isOpen, onClose, courseId }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isOpen && courseId) {
      fetchCourse();
      setCurrentStep(1);
    }
  }, [isOpen, courseId]);

  const fetchCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CourseService.getCourseById(courseId);
      setCourse(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rate) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-2xl ${i < rate ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  };

  const getLevelText = (level) => {
    const levels = {
      0: "Beginner",
      1: "Intermediate",
      2: "Advanced",
      3: "All Levels",
    };
    return levels[level] || "Unknown";
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            {currentStep === 2 && (
              <button
                onClick={handleBack}
                className="text-gray-500 hover:text-gray-700"
              >
                ←
              </button>
            )}
            <span>View Course</span>
          </div>
          <span className="text-sm text-gray-500">Step {currentStep} of 2</span>
        </div>
      }
      loading={loading}
      error={error}
      size="lg"
    >
      {course && (
        <div className="min-w-4xl">
          {currentStep === 1 && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Course Details
              </h3>

              {/* Image Display Section */}
              <div className="space-y-4">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-24 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={
                          course.coverURL === "path/path"
                            ? "https://media.istockphoto.com/id/1446486926/vector/front-and-back-end-of-development-responsive-web-design-website-interface-coding-and.jpg?s=1024x1024&w=is&k=20&c=hNJEOvRrXqL47KjdGpifhA9qtUAmg6diq7wDHN_WCxE="
                            : course.coverURL
                        }
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-2">
                      <div>Course Cover Image</div>
                      <div>Size: 700x430 pixels</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {course.title}
                </div>
              </div>

              {/* Category and Level */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {course.categoryName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {course.level}
                  </div>
                </div>
              </div>

              {/* Instructor and Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructor
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {course.instructorName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    ${course.cost}
                  </div>
                </div>
              </div>

              {/* Total Hours and Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total hours
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {course.totalHours} hours
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate
                  </label>
                  <div className="flex space-x-1">
                    {renderStars(course.rate)}
                  </div>
                </div>
              </div>

              {/* Description and Certification */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="border border-gray-300 rounded-lg bg-gray-50 p-3 min-h-[160px]">
                    <div
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certification
                  </label>
                  <div className="border border-gray-300 rounded-lg bg-gray-50 p-3 min-h-[160px]">
                    <div
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: course.cirtification }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Course Content
              </h3>

              <div className="space-y-6">
                {course.contents && course.contents.length > 0 ? (
                  course.contents.map((content, index) => (
                    <div key={index} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                          {content.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lectures Number
                          </label>
                          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            {content.lectureNumber}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (minutes)
                          </label>
                          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            {content.durationInMinutes}
                          </div>
                        </div>
                      </div>

                      {index < course.contents.length - 1 && (
                        <hr className="border-gray-200" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No content available for this course.
                  </div>
                )}
              </div>

              {/* Course Statistics Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  Course Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Total Lectures:</span>{" "}
                    {course.totalLectures}
                  </div>
                  <div>
                    <span className="font-medium">Total Duration:</span>{" "}
                    {course.totalHours} hours
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
            >
              Close
            </button>

            {/* Always show navigation buttons */}
            <div className="flex space-x-3">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
                >
                  ← Previous
                </button>
              )}

              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                  View Content →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViewCourse;
