/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCustomer = () => {
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    photo: null,
  });
  const [initialData, setInitialData] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the route parameters

  useEffect(() => {
    // Fetch existing customer data
    const fetchCustomerData = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/api/customer/get?id=${id}`);
        setInitialData(response.data.data);
        setCustomer(prev => ({
          ...prev,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          email: response.data.data.email,
          photo: response.data.data.photo ? response.data.data.photo : null,
        }));
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      }
    };

    fetchCustomerData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setCustomer(prevCustomer => ({
        ...prevCustomer,
        [name]: files[0],
      }));
    } else {
      setCustomer(prevCustomer => ({
        ...prevCustomer,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (customer.password !== customer.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", customer.firstName);
    formData.append("lastName", customer.lastName);
    formData.append("email", customer.email);
    if (customer.password) formData.append("password", customer.password);
    if (customer.confirm_password) formData.append("confirm_password", customer.confirm_password);
    if (customer.photo) formData.append("photo", customer.photo);

    try {
      await axios.put(`http://localhost:3006/api/customer/updateUserByid?id=${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/customer"); // Redirect to the customer list page
    } catch (error) {
      console.error("Failed to update customer:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Update Customer</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="firstName" className="block font-semibold mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={customer.firstName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-red-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block font-semibold mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={customer.lastName}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-red-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-red-500"
            required
          />
        </div>
        {/* <div className="mb-4">
          <label htmlFor="password" className="block font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={customer.password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-red-500"
            placeholder="Leave blank to keep current password"
          />
        </div> */}
        {/* <div className="mb-4">
          <label htmlFor="confirm_password" className="block font-semibold mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={customer.confirm_password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-red-500"
            placeholder="Leave blank to keep current password"
          />
        </div> */}
        <div className="mb-4">
          <label htmlFor="photo" className="block font-semibold mb-2">
            Photo
          </label>
       
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:border-red-500"
          />
             {customer.photo && (
            <img
              src={`http://localhost:3006/api/logo/download/${customer.photo}`}
              alt="Previous Selected Photo"
              className="mb-4"
              style={{ width: '150px', height: '150px' }}
            />
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default UpdateCustomer;
