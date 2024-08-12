import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const UpdateIndustry = ({ isUpdate = false }) => {
  const navigate = useNavigate();
  const { companyId } = useParams(); // Assuming you're passing the company ID via URL params

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

  // Fetch countries on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3006/api/country/countries")
      .then((response) => {
        const countriesData = response.data.data;
        setCountries(countriesData);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch company data if updating
  useEffect(() => {
    if (isUpdate && companyId) {
      axios
        .get(`http://localhost:3006/api/companies/company/${companyId}`)
        .then((response) => {
          const data = response.data.data;
          setFormData({
            ...formData,
            industry_address: data.industry_address || "",
            office_address: data.office_address || "",
            email: data.email || "",
            mobile: data.mobile || "",
            name: data.name || "",
            website: data.website || "",
            products: data.products || [""],
            photo: data.photo || [""],
            country: data.country || "",
            state: data.state || "",
            city: data.city || "",
          });
        })
        .catch((error) => console.error("Error fetching company data:", error));
    }
  }, [isUpdate, companyId]);

  // Fetch states when a country is selected
  useEffect(() => {
    if (formData.country) {
      axios
        .get(`http://localhost:3006/api/state/getStatebyCountry?countryCode=${formData.country}`)
        .then((response) => {
          setStates(response.data);
        })
        .catch((error) => console.error("Error fetching states:", error));
    }
  }, [formData.country]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (formData.state) {
      axios
        .get(`http://localhost:3006/api/city/getcity?state=${formData.state}`)
        .then((response) => {
          setCities(response.data.data);
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      if (isUpdate && companyId) {
        await axios.put(`http://localhost:3006/api/companies/company/${companyId}`, formData);
        alert("Company data updated successfully!");
      } else {
        await axios.post("http://localhost:3006/api/companies/company", formData);
        alert("Company data submitted successfully!");
      }
      navigate("/industry");
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{isUpdate ? "Update Company" : "Create Company"}</h1>
      <form onSubmit={handleSubmit}>
        {/* Other form fields here */}
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
                state: "",
                city: "",
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Country" variant="outlined" />
            )}
          />
        </div>
        {/* State and City Autocomplete fields here */}
        <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded">
          {isUpdate ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default UpdateIndustry;
