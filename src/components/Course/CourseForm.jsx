import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  CourseFiltersAtom,
  CourseFormAtom,
  CoursesAtom,
  LevelAtom,
} from "../../atoms/CourseAtom";
import Modal from "../common/Modal";
import CourseService from "../../services/CourseService";
import { MdErrorOutline } from "react-icons/md";
import {
  PhotoIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../common/Spinner/LoadingSpinner";

const CourseForm = () => {
  const [form, setForm] = useAtom(CourseFormAtom);
  const [filters, setFilters] = useAtom(CourseFiltersAtom);
  const [, setCourses] = useAtom(CoursesAtom);
  const [level , setLevel] = useAtom(LevelAtom);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null,
    level: 0,
    rate: 1,
    instructorName: "",
    categoryName: "",
    cirtification: "",
    cost: 0,
    instructorId: "",
    categoryId: "",
    totalHours: "",
    contents: [{ name: "", LectureNumber: 1, DurationInMinutes: 1 }],
  });
  const [preview, setPreview] = useState(null);

  const [errors, setErrors] = useState({
    title: null,
    description: null,
    imageFile: null,
    level: null,
    rate: null,
    instructorName: null,
    categoryName: null,
    cirtification: null,
    cost: null,
    instructorId: null,
    categoryId: null,
    totalHours: null,
    contents: [{ name: null, LectureNumber: null, DurationInMinutes: null }],
  });

  useEffect(() => {
    const handleEditMode = async () => {
      if (form.mode === "edit" && form.data) {
        try {
          setForm((prev) => ({ ...prev, loading: true }));

          const editedResponse = await CourseService.getCourseById(
            form.data.id
          );

          const responseData = editedResponse.data || editedResponse;

          const editData = {
            title: responseData.title || "",
            description: responseData.description || "",
            imageFile: null,
            level: responseData.levelId || 0,
            rate: responseData.rate || 1,
            cirtification:
              responseData.cirtification || responseData.certification || "",
            cost: responseData.cost || 0,
            categoryId: responseData.categoryId || 0,
            categoryName: responseData.categoryName || "",
            instructorId: responseData.instructorId || 0,
            instructorName: responseData.instructorName || "",
            totalHours: responseData.totalHours || "",
            contents:
              responseData.contents && responseData.contents.length > 0
                ? responseData.contents.map((content) => ({
                    name: content.name || "",
                    LectureNumber:
                      content.lectureNumber || content.LectureNumber || 1,
                    DurationInMinutes:
                      content.durationInMinutes ||
                      content.DurationInMinutes ||
                      1,
                  }))
                : [{ name: "", LectureNumber: 1, DurationInMinutes: 1 }],
          };

         
          setFormData(editData);
          

          if (responseData.coverURL && responseData.coverURL !== "path/path") {
            setPreview(responseData.coverURL);
          }

          setForm((prev) => ({ ...prev, loading: false, error: null }));
        } catch (error) {
          console.error("Error loading course for edit:", error);
          setForm((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to load course data for editing",
          }));
        }
      } else {
        setFormData({
          title: "",
          description: "",
          imageFile: null,
          level: 0,
          rate: 1,
          cirtification: "",
          cost: 0,
          instructorId: "",
          categoryId: "",
          totalHours: "",
          contents: [{ name: "", LectureNumber: 1, DurationInMinutes: 1 }],
        });
        setPreview(null);
      }
    };

    if (form.open) {
      handleEditMode();
    }
  }, [form.mode, form.data, form.open]);


  useEffect(() => {console.log(formData);} , [formData]);

  const fetchInstructorAndCategories = async () => {
    setCourses((prev) => ({ ...prev, loading: true, error: null }));

    const data = await CourseService.getInstructorsAndCategories();
    setCategories(data.categories);
    setInstructors(data.instructors);
    setCourses((prev) => ({ ...prev, loading: false, error: null }));
    // setFormData((prev) => ({ ...prev,  }));
  };

  useEffect(() => {
    fetchInstructorAndCategories();
  }, [form.open]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === "level") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
    } else if (name === "rate") {
      const rateValue = parseInt(value);
      if (rateValue >= 1 && rateValue <= 5) {
        setFormData((prev) => ({ ...prev, [name]: rateValue }));
      }
    } else if (name === "cost") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuillChange = (field, value) => {
    const cleanValue = value === "<p><br></p>" ? "" : value;
    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.fullName = "Course Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (form.mode === "add" && !formData.imageFile) {
      newErrors.imageFile = "Cover Image is required";
    }

    if (!formData.categoryId) newErrors.categoryId = "Category is required";
    if (formData.level === "" || formData.level < 0 || formData.level > 3)
      newErrors.level = "level is required";
    if (!formData.instructorId) newErrors.instructorId = "level is required";
    if (!formData.cost || formData.cost < 0)
      newErrors.cost = "Cost must be a positive number";

    if (formData.rate < 1 || formData.rate > 5)
      newErrors.rate = "Rate must be between 1 and 5";
    if (!formData.cirtification.trim())
      newErrors.cirtification = "Certification is required";

    if (Object.keys(newErrors).length > 0) {
      setForm((prev) => ({
        ...prev,
        loading: false,
      }));
      setErrors(newErrors);
      return;
    }

    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const errors = [];
    const validContents = formData.contents.filter(
      (content) =>
        content.name.trim() &&
        content.LectureNumber > 0 &&
        content.DurationInMinutes >= 1
    );

    if (validContents.length === 0) {
      errors.push(
        "At least one complete content item is required (Name, Lecture Number must be greater than 0, and Duration must be at least 1 minute)"
      );
    }

    if (errors.length > 0) {
      setForm((prev) => ({ ...prev, error: errors.join(", ") }));
      return false;
    }
    return true;
  };

  const handleContentChange = (index, field, value) => {
    const updatedContents = [...formData.contents];
    if (field === "LectureNumber" || field === "DurationInMinutes") {
      const numValue = parseInt(value) || 0;
      updatedContents[index][field] = Math.max(1, numValue);
    } else {
      updatedContents[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, contents: updatedContents }));
  };

  const addContent = () => {
    setFormData((prev) => ({
      ...prev,
      contents: [
        ...prev.contents,
        { name: "", LectureNumber: 1, DurationInMinutes: 1 },
      ],
    }));
  };

  const removeContent = (index) => {
    if (formData.contents.length > 1) {
      const updatedContents = formData.contents.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, contents: updatedContents }));
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep === 1 && validateStep1()) {
      setForm((prev) => ({ ...prev, error: null }));
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setForm((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const fd = new FormData();

      fd.append("Title", formData.title.trim());
      fd.append("Description", formData.description.trim());
      fd.append("Level", parseInt(formData.level));
      fd.append("Cost", parseFloat(formData.cost) || 0);
      fd.append("Rate", parseInt(formData.rate) || 1);
      fd.append(
        "Cirtification",
        formData.cirtification.trim() || "Certificate of Completion"
      );
      fd.append("InstructorId", parseInt(formData.instructorId));
      fd.append("CategoryId", parseInt(formData.categoryId));

      if (formData.imageFile) {
        fd.append("ImageFile", formData.imageFile);
      }

      formData.contents
        .filter(
          (content) =>
            content.name.trim() &&
            content.LectureNumber > 0 &&
            content.DurationInMinutes >= 1
        )
        .forEach((content, index) => {
          fd.append(`Contents[${index}].Name`, content.name.trim());
          fd.append(`Contents[${index}].LectureNumber`, content.LectureNumber);
          fd.append(
            `Contents[${index}].DurationInMinutes`,
            content.DurationInMinutes
          );
        });

    

      let data;
      if (form.mode === "add") {
        data = await CourseService.createCourse(fd);
        setCourses((prev) => ({
          ...prev,
          items: [data, ...prev.items],
          totalCount: prev.totalCount + 1,
        }));
      } else {
        if (!form.data?.id) {
          throw new Error("No course ID provided for update");
        }
      
        data = await CourseService.updateCourse(form.data.id, fd);
        setCourses((prev) => ({
          ...prev,
          items: prev.items.map((c) =>
            c.id === data.id ? { ...c, ...data } : c
          ),
        }));
      }

      handleClose();
    } catch (error) {
      console.error("Submit error details:", error);
      setForm((prev) => ({
        ...prev,
        error: error.message || "An error occurred while saving the course",
      }));
    } finally {
      setForm((prev) => ({ ...prev, loading: false }));
      setErrors({});
    }
  };

  const handleClose = async () => {
    setForm({
      open: false,
      mode: "add",
      data: null,
      loading: false,
      error: null,
    });
    setFormData({
      title: "",
      description: "",
      imageFile: null,
      level: 0,
      rate: 1,
      cirtification: "",
      cost: 0,
      instructorId: "",
      categoryId: "",
      totalHours: "",
      contents: [{ name: "", LectureNumber: 1, DurationInMinutes: 1 }],
    });
    setPreview(null);
    setCurrentStep(1);
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

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["blockquote"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "bold",
    "italic",
    "underline",
    "align",
    "list",
    "bullet",
    "link",
    "image",
    "blockquote",
  ];

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, rate: i }))}
          className={`text-2xl ${
            i <= formData.rate ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-400 transition-colors`}
        >
          ★
        </button>
      );
    }
    return <div className="flex space-x-1">{stars}</div>;
  };

  return (
    <Modal
      isOpen={form.open}
      title={
        <div className="flex items-center justify-between  ">
          <div className="flex items-center space-x-3">
            {currentStep === 2 && (
              <button
                onClick={handleBack}
                className="text-gray-500 hover:text-gray-700"
              >
                ←
              </button>
            )}
            <span>{form.mode === "edit" ? "Edit Course" : "Add Course"}</span>
          </div>
          <span className="text-sm text-gray-500">Step {currentStep} of 2</span>
        </div>
      }
      onClose={handleClose}
      error={form.error}
      size="lg"
    >
      <form
        onSubmit={currentStep === 2 ? handleSubmit : handleNext}
        className="space-y-6"
        noValidate
      >
        {currentStep === 1 && (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Course details
            </h3>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-xs text-gray-500">
                          Upload Image
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-2">
                    <div>Size: 700x430 pixels</div>
                    <div>File Support: .jpg, .jpeg, .png, or .gif</div>
                    {form.mode === "edit" && preview && (
                      <div className="text-blue-600">
                        Current image will be kept if no new image is uploaded
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById("coverFile").click()}
                    className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    📁 {form.mode === "edit" ? "Change Image" : "Upload Image"}
                  </button>
                  <input
                    id="coverFile"
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Write here"
                className={` block w-full rounded-md border ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                required
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <MdErrorOutline />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Category and Level */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={` block w-full rounded-md border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  required
                >
                  <option value="">Choose</option>
                  {categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                      className="text-black"
                      selected={
                        String(formData.categoryName) === String(cat.name)
                      }
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <MdErrorOutline />
                    {errors.categoryId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className={` block w-full rounded-md border ${
                    errors.level ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  required
                >
                  <option  value="">Choose</option>
                  {

                  level.map((l , index) => (
                      <option
                      key={index}
                      value={l.id}
                      selected={
                        formData.level === l.id
                      }
                    >
                      {l.name}
                    </option>
                  ))}
                </select>
                {errors.level && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <MdErrorOutline />
                    {errors.level}
                  </p>
                )}
              </div>
            </div>

            {/* Instructor and Cost */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructor
                </label>
                <select
                  name="instructorId"
                  value={formData.instructorId}
                  onChange={handleChange}
                  className={` block w-full rounded-md border ${
                    errors.instructorId ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  required
                >
                  <option value="">Choose</option>
                  {instructors.map((inst) => (
                    <option
                      key={inst.id}
                      value={inst.id}
                      selected={
                        String(formData.instructorName) ===
                        String(inst.fullName)
                      }
                    >
                      {inst.fullName}
                    </option>
                  ))}
                </select>
                {errors.instructorId && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <MdErrorOutline />
                    {errors.instructorId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="Enter cost"
                  min="0"
                  step="0.01"
                  className={` block w-full rounded-md border ${
                    errors.cost ? "border-red-500" : "border-gray-300"
                  } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                  required
                />
                {errors.cost && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <MdErrorOutline />
                    {errors.cost}
                  </p>
                )}
              </div>
            </div>

            {/* Total Hours and Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total hours
                </label>
                <input
                  type="text"
                  name="totalHours"
                  value={formData.totalHours}
                  onChange={handleChange}
                  placeholder="Write here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate
                </label>
                {renderStarRating()}
              </div>
            </div>

            {/* Description and Certification with ReactQuill */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div
                  className={`border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-lg overflow-hidden`}
                >
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) =>
                      handleQuillChange("description", value)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write here..."
                    style={{ height: "120px", marginBottom: "42px" }}
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <MdErrorOutline />
                    {errors.description}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification
                </label>
                <div
                  className={`border ${
                    errors.cirtification ? "border-red-500" : "border-gray-300"
                  } rounded-lg overflow-hidden`}
                >
                  <ReactQuill
                    theme="snow"
                    value={formData.cirtification}
                    onChange={(value) =>
                      handleQuillChange("cirtification", value)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write here..."
                    style={{ height: "120px", marginBottom: "42px" }}
                  />
                </div>
                {errors.cirtification && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <MdErrorOutline />
                    {errors.cirtification}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Add Content
            </h3>

            <div className="space-y-6">
              {formData.contents.map((content, index) => (
                <div key={index} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={content.name}
                      onChange={(e) =>
                        handleContentChange(index, "name", e.target.value)
                      }
                      placeholder="Write here"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lectures Number
                      </label>
                      <input
                        type="number"
                        value={content.LectureNumber}
                        onChange={(e) =>
                          handleContentChange(
                            index,
                            "LectureNumber",
                            e.target.value
                          )
                        }
                        placeholder="Enter number of lectures"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={content.DurationInMinutes}
                        onChange={(e) =>
                          handleContentChange(
                            index,
                            "DurationInMinutes",
                            e.target.value
                          )
                        }
                        placeholder="Enter duration in minutes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {formData.contents.length > 1 && (
                    <div className="flex justify-start">
                      <button
                        type="button"
                        onClick={() => removeContent(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {index < formData.contents.length - 1 && (
                    <hr className="border-gray-200" />
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addContent}
                className="w-full py-3 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2 transition-colors"
              >
                <PlusCircleIcon className="w-5 h-5" />
                <span>Add Another Content</span>
              </button>
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={form.loading}
            className={`px-6 py-2 text-sm font-semibold text-white ${
              form.loading ? "flex justify-center bg-gray-400" : "bg-gray-900"
            } rounded-lg hover:bg-gray-800 focus:outline-none`}
          >
            {currentStep === 1
              ? "Next"
              : form.mode === "edit"
              ? form.loading
                ? <LoadingSpinner />
                : "Update"
              : form.loading
              ? <LoadingSpinner />
              : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseForm;
