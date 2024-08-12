import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CityForm = () => {
  const [cityData, setCityData] = useState({
    name: '',
    stateName: '',
    countryCode: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCityData({
      ...cityData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3006/api/city/createCity', cityData);
      navigate('/city'); // Redirect to city list after submission
    } catch (error) {
      console.error('There was an error creating the city!', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create City</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">City Name:</label>
          <input
            type="text"
            name="name"
            value={cityData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">State Name:</label>
          <input
            type="text"
            name="stateName"
            value={cityData.stateName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Country Code:</label>
          <input
            type="text"
            name="countryCode"
            value={cityData.countryCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CityForm;
