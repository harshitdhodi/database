import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const CreateCompanyForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    industry_address: "",
    office_address: "",
    email: "",
    mobile: "",
    name: "",
    website: "",
    products: [""],
    photo: [""],
    country: "",
    state: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3006/api/country/countries")
      .then((response) => {
        console.log("Countries response:", response.data); // Log response data
        const countriesData = response.data.data;
        if (Array.isArray(countriesData)) {
          setCountries(countriesData);
        } else {
          console.error("Expected array but got:", countriesData);
        }
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);
  
  useEffect(() => {
    if (formData.country) {
      axios
        .get(`http://localhost:3006/api/state/getStatebyCountry?countryCode=${formData.country}`)
        .then((response) => {
          console.log("States response:", response.data); // Confirm structure
          // Assuming response.data is an array of states
          setStates(response.data); // Directly set states from response.data
        })
        .catch((error) => console.error("Error fetching states:", error));
    }
  }, [formData.country]);
  
  useEffect(() => {
    if (formData.state) {
      // Fetch cities based on selected state
      axios
        .get(`http://localhost:3006/api/city/getcity?state=${formData.state}`)
        .then((response) => {
          // Assuming the response data format is similar to the provided format
          setCities(response.data.data); // Access the `data` property to get the list of cities
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [formData.state]);

  const handleChange = (e, newValue) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData({
      ...formData,
      [field]: updatedArray,
    });
  };

  const addProductField = () => {
    setFormData({
      ...formData,
      products: [...formData.products, ""],
    });
  };

  const addPhotoField = () => {
    setFormData({
      ...formData,
      photo: [...formData.photo, ""],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3006/api/companies/company", formData);
      alert("Company data submitted successfully!");
      setFormData({
        industry_address: "",
        office_address: "",
        email: "",
        mobile: "",
        name: "",
        website: "",
        products: [""],
        photo: [""],
        country: "",
        state: "",
        city: "",
      });
      navigate("/industry"); // Navigate to the industry page
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Company</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Industry Address</label>
          <input
            type="text"
            name="industry_address"
            value={formData.industry_address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Office Address</label>
          <input
            type="text"
            name="office_address"
            value={formData.office_address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Website</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Country</label>
          <Autocomplete
            options={countries}
            getOptionLabel={(option) => option.name}
            value={countries.find((country) => country.name === formData.country) || null}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                country: newValue ? newValue.name : "",
                state: "", // Reset state and city when country changes
                city: "",
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Country" variant="outlined" />
            )}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">State</label>
          <Autocomplete
            options={states}
            getOptionLabel={(option) => option.name}
            value={states.find((state) => state._id === formData.state) || null}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                state: newValue ? newValue._id : "",
                city: "", // Reset city when state changes
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select State" variant="outlined" />
            )}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.name}
            value={cities.find((city) => city._id === formData.city) || null}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                city: newValue ? newValue._id : "",
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select City" variant="outlined" />
            )}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Products</label>
          {formData.products.map((product, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                name={`products[${index}]`}
                value={product}
                onChange={(e) => handleArrayChange(e, index, "products")}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addProductField}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Add Product
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Photos</label>
          {formData.photo.map((photo, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                name={`photo[${index}]`}
                value={photo}
                onChange={(e) => handleArrayChange(e, index, "photo")}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addPhotoField}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Add Photo
          </button>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateCompanyForm;
