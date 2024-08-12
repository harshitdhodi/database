import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CityUpdateForm = () => {
  const [cityData, setCityData] = useState({
    name: '',
    stateName: '',
    countryCode: '',
  });
  const { id } = useParams(); // Get the city identifier from the URL
  const navigate = useNavigate();

  useEffect(() => {
    fetchCityData();
  }, []);

  const fetchCityData = async () => {
    try {
      const response = await axios.get(`http://localhost:3006/api/city/getCityBySlug?id=${id}`);
      const { data } = response.data;
      setCityData({
        name: data.name,
        stateName: data.stateName,
        countryCode: data.countryCode,
      });
    } catch (error) {
      console.error('There was an error fetching the city data!', error);
    }
  };

  const handleChange = (e) => {
    setCityData({
      ...cityData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3006/api/city/updateCity?id=${id}`, cityData);
      navigate('/city'); // Redirect to city list after submission
    } catch (error) {
      console.error('There was an error updating the city!', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Update City</h2>
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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default CityUpdateForm;
