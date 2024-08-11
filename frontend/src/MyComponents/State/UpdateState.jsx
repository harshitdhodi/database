import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateForm = () => {
  const [name, setName] = useState("");
  const [isoCode, setIsoCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const { slug } = useParams(); // To get the slug from the URL
  const navigate = useNavigate();

  useEffect(() => {
    fetchData(slug);
  }, [slug]);

  const fetchData = async (slug) => {
    try {
      const response = await axios.get(`http://localhost:3006/api/state/getStateBySlug/${slug}`);
      const { name, isoCode, countryCode, countryName } = response.data.data;
      setName(name);
      setIsoCode(isoCode);
      setCountryCode(countryCode);
      setCountryName(countryName);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      isoCode,
      countryCode,
      countryName,
    };

    try {
      await axios.put(`http://localhost:3006/api/state/updateState/${slug}`, data);
      navigate("/state"); // Redirect to the list page after submission
    } catch (error) {
      console.error("There was an error updating the data!", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Update Data</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">ISO Code</label>
          <input
            type="text"
            value={isoCode}
            onChange={(e) => setIsoCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Country Code</label>
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Country Name</label>
          <input
            type="text"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateForm;
