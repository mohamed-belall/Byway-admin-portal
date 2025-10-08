import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import {
  instructorFormAtom,
  instructorsAtom,
} from "../../atoms/instructorAtom";
import instructorService from "../../services/instructorService";
import Modal from "../common/Modal";
import { Camera } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

import { MdErrorOutline } from "react-icons/md";

const InstructorForm = () => {
  const [form, setForm] = useAtom(instructorFormAtom);
  const [, setInstructors] = useAtom(instructorsAtom);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    ImageFile: null,
    rate: 0,
    jobTitle: 0,
  });
  const [errors, setErrors] = useState({
    fullName: null,
    bio: null,
    ImageFile: null,
    rate: null,
    jobTitle: null,
  });

  useEffect(() => {
    if (form.mode === "edit" && form.data) {
      setFormData(form.data);
      if (form.data.profilePictureURL) {
        setPreview(form.data.profilePictureURL);
      }
    } else if (form.mode === "add") {
      setPreview(null);
    }
    console.log(form.data);
  }, [form.data]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "rate" || name === "jobTitle"
            ? value === ""
              ? null
              : Number(value)
            : value === ""
            ? null
            : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm((prev) => ({
      ...prev,
      loading: true,
    }));

    const newErrors = {};
    console.log(form.data.profilePictureURL);

    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!form.data.profilePictureURL && !formData.ImageFile)
      newErrors.ImageFile = "profile picture is required.";
    if (formData.jobTitle === null || formData.jobTitle === "")
      newErrors.jobTitle = "Please select a job title.";

    if (!formData.bio) newErrors.bio = "Bio cannot be empty.";

    if (Object.keys(newErrors).length > 0) {
      setForm((prev) => ({
        ...prev,
        loading: false,
      }));
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const fd = new FormData();
      fd.append("FullName", formData.fullName);
      fd.append("Bio", formData.bio);
      if (formData.ImageFile) fd.append("ImageFile", formData.ImageFile);
      fd.append("Rate", formData.rate);
      fd.append("JobTitle", formData.jobTitle);

      if (form.mode === "add") {
        await instructorService.addInstructor(fd);
      } else {
        await instructorService.updateInstructor(form.data.id, fd);
      }

      // Refresh instructors list
      const data = await instructorService.getInstructors({
        pageIndex: 1,
        pageSize: 8,
        search: null,
      });
      setInstructors((prev) => ({
        ...prev,
        items: data.data,
        totalCount: data.count,
      }));

      handleClose();
    } catch (error) {
      setForm((prev) => ({ ...prev, error: error.message.message }));
    } finally {
      setForm((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleClose = () => {
    setForm({
      open: false,
      mode: "add",
      data: null,
      loading: false,
      error: null,
    });
    setFormData({
      fullName: "",
      bio: "",
      ImageFile: null,
      rate: 0,
      jobTitle: "",
    });
    setErrors({});
  };

  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      handleChange(e);
    }
  };

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
      onClose={handleClose}
      title={form.mode === "add" ? "Add Instructor" : "Edit Instructor"}
    >
      {/* Profile Picture */}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4 min-w-2xl">
        {/* Image File */}
        <div className="flex flex-col items-start space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <div className="relative w-35 h-35 ">
            {/* Circle container */}
            <div className="w-full h-full border shadow-lg rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-600" />
              )}
            </div>

            {/* Camera button overlay */}
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-all"
            >
              <Camera size={25} className="text-white" />
            </label>

            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              name="ImageFile"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div>
            {errors.ImageFile && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <MdErrorOutline />
                {errors.ImageFile}
              </p>
            )}
          </div>

          {/* Full Name */}

          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <MdErrorOutline />
              {errors.fullName}
            </p>
          )}
        </div>
        {/* Job Title */}
        <div className="flex items-center gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <select
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.jobTitle ? "border-red-500" : "border-gray-300"
              } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            >
              <option value="">Choose a job title</option>
              <option value={0}>Fullstack Developer</option>
              <option value={1}>Backend Developer</option>
              <option value={2}>Frontend Developer</option>
              <option value={3}>UXUI Designer</option>
            </select>
            {errors.jobTitle && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <MdErrorOutline />
                {errors.jobTitle}
              </p>
            )}
          </div>
          {/* rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            {renderStarRating()}
          </div>
        </div>

        {/* bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className={`mt-1 block w-full rounded-md border ${
              errors.bio ? "border-red-500" : "border-gray-300"
            } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <MdErrorOutline />
              {errors.bio}
            </p>
          )}
        </div>

        {form.error && <div className="text-red-600 text-sm">{form.error}</div>}

        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={form.loading}
            className="flex-1 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {form.loading
              ? "Saving..."
              : form.mode === "add"
              ? "Add"
              : "Update"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InstructorForm;
