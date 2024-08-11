import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCountryForm = () => {
    const [name, setName] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const { slug } = useParams(); // To get the slug (like 'india') for editing
    const navigate = useNavigate();
  
    useEffect(() => {
      if (slug) {
        // If there is a slug, we are in edit mode
        setIsEditing(true);
        fetchCountry(slug);
      }
    }, [slug]);
  
    const fetchCountry = async (slug) => {
      try {
        const response = await axios.get(`http://localhost:3006/api/country/countries/${slug}`);
        const { name, countryCode } = response.data.data; // Accessing nested data object
        setName(name);
        setCountryCode(countryCode);
      } catch (error) {
        console.error("There was an error fetching the country details!", error);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (isEditing) {
          // Update existing country using the slug
          await axios.put(`http://localhost:3006/api/country/countries/${slug}`, { name, countryCode });
        } else {
          // Create new country
          await axios.post("http://localhost:3006/api/country/countries", { name, countryCode });
        }
        navigate("/country"); // Redirect to the list page after submission
      } catch (error) {
        console.error("There was an error saving the country!", error);
      }
    };
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">{isEditing ? "Edit Country" : "Add New Country"}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Country Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">Country Code</label>
            <input
              type="text"
              id="countryCode"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#1F2937] text-white rounded hover:bg-blue-500 transition duration-300"
          >
            {isEditing ? "Update Country" : "Add Country"}
          </button>
        </form>
      </div>
    );
  };
export default UpdateCountryForm;
