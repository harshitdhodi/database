import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    [{ 'direction': 'rtl' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};
const NewInfrastructureForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoAlts, setPhotoAlts] = useState([]);
  const navigate = useNavigate();

  const notify = () => {
    toast.error("You can only upload up to 5 photos");
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    // Limit the number of photos to 5
    if (photos.length + files.length > 5) {
      notify();
        return;
    }
    setPhotos([...photos, ...files]);
    // Initialize alt text for each new photo
    const newPhotoAlts = Array.from({ length: files.length }, () => "");
    setPhotoAlts([...photoAlts, ...newPhotoAlts]);
};

const handleDeleteImage = (index) => {
  setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  setPhotoAlts((prevPhotoAlts) => prevPhotoAlts.filter((_, i) => i !== index));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      // Append each photo along with its alt text
      photos.forEach((photo, index) => {
        formData.append(`photo`, photo);
        formData.append(`alt`, photoAlts[index]);
    });
      const response = await axios.post(
        "http://localhost:3006/api/infrastructure/createInfrastructure",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        }
      );



      setTitle("");
      setDescription("");
      setPhotos([]);
      setPhotoAlts([]);
      navigate("/infrastructure");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Add Infrastructure</h1>
      <ToastContainer/>
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-2">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-8">
        <label htmlFor="details" className="block font-semibold mb-2">
          Description
        </label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          modules={modules} // Include modules for image handling
          className="quill"
        />
      </div>
      <div className="mt-12">
                <label htmlFor="photo" className="block font-semibold mb-2">
                    Photos
                </label>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    multiple
                    onChange={handlePhotoChange}
                    className="border rounded focus:outline-none "
                    accept="image/*"
                />
                {photos.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-4">
                        {photos.map((photo, index) => (
                            <div key={index} className="relative w-56 group flex flex-col items-center">
                                <div className="relative w-56">
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt={`Infrastructure ${index + 1}`}
                                        className="h-32 w-56 object-cover"
                                    />

                                    <button
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                                    >
                                        X
                                    </button>
                                </div>
                                <label className="block mt-2">
                                    Alternative Text:
                                    <input
                                        type="text"
                                        value={photoAlts[index]}
                                        onChange={(e) => {
                                            const newPhotoAlts = [...photoAlts];
                                            newPhotoAlts[index] = e.target.value;
                                            setPhotoAlts(newPhotoAlts);
                                        }}
                                        className="w-full p-2 border rounded focus:outline-none"
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mt-8">
        Add Infrastructure
      </button>
    </form>
  );
};

export default NewInfrastructureForm;
