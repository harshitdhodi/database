import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import * as XLSX from 'xlsx';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const Industries = () => {
  const [companies, setCompanies] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageSize = 5;

  useEffect(() => {
    fetchCompanies();
  }, [pageIndex]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`http://localhost:3006/api/companies/getCompanies?page=${pageIndex + 1}`);
      const { data, total, hasNextPage } = response.data;

      // Calculate page count based on total items and page size
      setPageCount(Math.ceil(total / pageSize));
      setHasNextPage(hasNextPage);

      // Update company data with ID for table display
      const dataWithIds = data.map((company, index) => ({
        ...company,
        id: pageIndex * pageSize + index + 1,
      }));
      setCompanies(dataWithIds);
    } catch (error) {
      console.error("There was an error fetching the companies!", error);
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
      await axios.delete(`http://localhost:3006/api/companies/deleteCompany?id=${id}`);
      fetchCompanies();
    } catch (error) {
      console.error("There was an error deleting the company!", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Process each row to include image paths
      const processedData = jsonData.map((row) => {
        // Assuming the image paths are stored in a column called 'image_paths'
        const imagePaths = row.image_paths ? row.image_paths.split(",") : [];
        
        return {
          ...row,
          photo: imagePaths, // Store image paths in the 'photo' field
        };
      });

      try {
        await axios.post("http://localhost:3006/api/companies/addCompanies", processedData);
        fetchCompanies(); // Fetch the updated list after adding
      } catch (error) {
        console.error("There was an error uploading the file!", error);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Function to export data including image paths to an XLSX file
  const exportDataToXLSX = () => {
    const exportData = companies.map((company) => ({
      ID: company.id,
      Name: company.name,
      IndustryAddress: company.industry_address,
      OfficeAddress: company.office_address,
      Email: company.email,
      Mobile: company.mobile,
      Website: company.website,
      Products: company.products.join(", "),
      Photos: company.photo.join(", "), // Include the image paths
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");

    XLSX.writeFile(workbook, "Companies.xlsx");
  };

  return (
    <div className="p-4 overflow-hidden">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-xl font-bold mb-3 ml-2">Company List</h1>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="mt-3 cursor-pointer"
          />
          <button className="px-4 py-2 mt-3 bg-[#1F2937] text-white rounded hover:bg-red-500 transition duration-300">
            <Link to="/create-company">Add New Company</Link>
          </button>
          {/* Export to Excel Button */}
          <button
            onClick={exportDataToXLSX}
            className="px-4 py-2 mt-3 bg-[#1F2937] text-white rounded hover:bg-blue-500 transition duration-300"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-scroll">
        <table id="companies-table" className="w-full mt-4 border-collapse shadow-lg ">
          <thead>
            <tr className="bg-[#1F2937] text-white text-left uppercase font-serif text-[14px]">
              <th className="py-2 px-6">ID</th>
              <th className="py-2 px-6">Name</th>
              <th className="py-2 px-6">Industry Address</th>
              <th className="py-2 px-6">Office Address</th>
              <th className="py-2 px-6">Email</th>
              <th className="py-2 px-6">Mobile</th>
              <th className="py-2 px-6">Website</th>
              <th className="py-2 px-6">Products</th>
              <th className="py-2 px-6">Photos</th>
              <th className="py-2 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr
                key={company._id}
                className="bg-gray-50 border-b border-gray-300 hover:bg-gray-100 transition duration-150"
              >
                <td className="py-2 px-6">{company.id}</td>
                <td className="py-2 px-6">{company.name}</td>
                <td className="py-2 px-6">{company.industry_address}</td>
                <td className="py-2 px-6">{company.office_address}</td>
                <td className="py-2 px-6">{company.email}</td>
                <td className="py-2 px-6">{company.mobile}</td>
                <td className="py-2 px-6">{company.website}</td>
                <td className="py-2 px-6">{company.products.join(", ")}</td>
                <td className="py-2 px-6">
                  {company.photo.length > 0 ? (
                    company.photo.map((photoUrl, index) => (
                      <img key={index} src={photoUrl} alt={`photo-${index}`} className="w-16 h-16 object-cover" />
                    ))
                  ) : (
                    "No Photos"
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex py-1 px-4 items-center space-x-2">
                    <button>
                      <Link to={`/editCompany/${company._id}`}>
                        <FaEdit className="text-blue-500 text-lg" />
                      </Link>
                    </button>
                    <button onClick={() => handleDelete(company._id)}>
                      <FaTrashAlt className="text-red-500 text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default Industries;
