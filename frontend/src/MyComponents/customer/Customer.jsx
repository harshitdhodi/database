import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const CustomerList = () => {
  const [users, setUsers] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    fetchUsers();
  }, [pageIndex]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3006/api/customer/getUser?page=${pageIndex + 1}`);
      const { data, total, hasNextPage } = response.data;

      // Calculate page count based on total items and page size
      setPageCount(Math.ceil(total / pageSize));
      setHasNextPage(hasNextPage);

      // Update user data with ID for table display
      const dataWithIds = data.map((user, index) => ({
        ...user,
        id: pageIndex * pageSize + index + 1,
      }));
      setUsers(dataWithIds);
    } catch (error) {
      console.error("There was an error fetching the users!", error);
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
      await axios.delete(`http://localhost:3006/api/customer/delete?id=${id}` , {withCredentials:true});
      fetchUsers();
    } catch (error) {
      console.error("There was an error deleting the user!", error);
    }
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-xl font-bold mb-3 ml-2">User List</h1>
        <button className="px-4 py-2 mt-3 bg-[#1F2937] text-white rounded hover:bg-red-500 transition duration-300">
          <Link to="/create-customer">Add New User</Link>
        </button>
      </div>

      <table className="w-full mt-4 border-collapse shadow-lg overflow-x-scroll">
        <thead>
          <tr className="bg-[#1F2937] text-white text-left uppercase font-serif text-[14px]">
            <th className="py-2 px-6">ID</th>
            <th className="py-2 px-6">First Name</th>
            <th className="py-2 px-6">Last Name</th>
            <th className="py-2 px-6">Email</th>
            <th className="py-2 px-6">Photo</th>
            <th className="py-2 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="bg-gray-50 border-b border-gray-300 hover:bg-gray-100 transition duration-150"
            >
              <td className="py-2 px-6">{user.id}</td>
              <td className="py-2 px-6">{user.firstName}</td>
              <td className="py-2 px-6">{user.lastName}</td>
              <td className="py-2 px-6">{user.email}</td>
              <td className="py-2 px-6">
                {user.photo && (
                  <img
                    src={`http://localhost:3006/api/logo/download/${user.photo}`}
                    alt="User"
                    className="h-10 w-10 object-cover rounded-full"
                  />
                )}
              </td>
              <td className="py-2 px-4">
                <div className="flex py-1 px-4 items-center space-x-2">
                  <button>
                    <Link to={`/edit-customer/${user._id}`}>
                      <FaEdit className="text-blue-500 text-lg" />
                    </Link>
                  </button>
                  <button onClick={() => handleDelete(user._id)}>
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

export default CustomerList;
