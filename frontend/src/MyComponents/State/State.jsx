import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const StateList = () => {
  const [cities, setCities] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageSize = 15;

  useEffect(() => {
    fetchCities();
  }, [pageIndex]);

  const fetchCities = async () => {
    try {
      const response = await axios.get(`http://localhost:3006/api/state/getState?page=${pageIndex + 1}`);
      const { data, total, hasNextPage } = response.data;

      // Calculate page count based on total items and page size
      setPageCount(Math.ceil(total / pageSize));
      setHasNextPage(hasNextPage);

      // Update city data with ID for table display
      const dataWithIds = data.map((city, index) => ({
        ...city,
        id: pageIndex * pageSize + index + 1,
      }));
      setCities(dataWithIds);
    } catch (error) {
      console.error("There was an error fetching the cities!", error);
    }
  };

  const handleNextPage = () => {
    if (pageIndex < pageCount - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3006/api/state/deleteState?id=${id}`);
      fetchCities();
    } catch (error) {
      console.error("There was an error deleting the state!", error);
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-xl font-bold mb-3 ml-2">State List</h1>
        <button className="px-4 py-2 mt-3 bg-[#1F2937] text-white rounded hover:bg-red-500 transition duration-300">
          <Link to="/create-state">Add New State</Link>
        </button>
      </div>

      <table className="w-full mt-4 border-collapse shadow-lg overflow-x-scroll">
        <thead>
          <tr className="bg-[#1F2937] text-white text-left uppercase font-serif text-[14px]">
            <th className="py-2 px-6">ID</th>
            <th className="py-2 px-6">State Name</th>
            <th className="py-2 px-6">ISO Code</th>
            <th className="py-2 px-6">Country Code</th>
            <th className="py-2 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr
              key={city._id}
              className="bg-gray-50 border-b border-gray-300 hover:bg-gray-100 transition duration-150"
            >
              <td className="py-2 px-6">{city.id}</td>
              <td className="py-2 px-6">{city.name}</td>
              <td className="py-2 px-6">{city.isoCode}</td>
              <td className="py-2 px-6">{city.countryCode}</td>
              <td className="py-2 px-4">
                <div className="flex py-1 px-4 items-center space-x-2">
                  <button>
                    <Link to={`/state/${city._id}`}>
                      <FaEdit className="text-blue-500 text-lg" />
                    </Link>
                  </button>
                  <button onClick={() => handleDelete(city._id)}>
                    <FaTrashAlt className="text-red-500 text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={pageIndex === 0}
          className="px-3 py-1 bg-[#1F2937] text-white flex justify-center rounded hover:bg-slate-900 transition"
        >
          {"<"}
        </button>
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className="px-3 py-1 bg-[#1F2937] text-white rounded hover:bg-slate-900 transition"
        >
          {">"}
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{" "}
        </span>
      </div>
    </div>
  );
};

export default StateList;
