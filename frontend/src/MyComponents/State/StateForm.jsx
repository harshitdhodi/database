import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StateForm = () => {
  const [name, setName] = useState("");
  const [isoCode, setIsoCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryName, setCountryName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stateData = {
      name,
      isoCode,
      countryCode,
      countryName,
    };

    try {
      await axios.post("http://localhost:3006/api/state/addState", stateData);
      navigate("/state"); // Redirect to the list page after submission
    } catch (error) {
      console.error("There was an error adding the state!", error);
    }
  };

  return (
    <div className="p-6 bg-white w-full mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Add New State</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">State Name</label>
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default StateForm;
