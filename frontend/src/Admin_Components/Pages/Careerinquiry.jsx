import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaTrashAlt, FaDownload, FaEye, FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from 'axios';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";


const CareerInquiryTable = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) =>
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inquiries, searchTerm]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Mobile No",
        accessor: "mobileNo",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Resume",
        accessor: "resume",
        Cell: ({ value }) => (
          <div className="flex gap-4">
            <a className="text-green-500 hover:text-green-700 transition" href={`http://localhost:3006/api/careerInquiries/download/${value}`}>
              <FaDownload size={20} />
            </a>
            <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => viewResume(value)}>
              <FaEye size={20} />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
      {
        Header: "Message",
        accessor: "message",
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deleteInquiry(row.original._id)}>
              <FaTrashAlt />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: filteredInquiries,
    },
    useSortBy
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3006/api/careerInquiries/getCareerInquiries`, { withCredentials: true });
      const inquiriesWithIds = response.data.data.map((inquiryItem, index) => ({
        ...inquiryItem,
        id: index + 1,
      }));
      setInquiries(inquiriesWithIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteInquiry = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3006/careerInquiries/deleteCareerInquiries/${id}`, { withCredentials: true });

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };



  const viewResume = (filename) => {
    window.open(`http://localhost:3006/api/careerInquiries/view/${filename}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>
      <h2 className="text-xl font-bold  text-gray-700 font-serif uppercase">Career Inquiries</h2>
      {loadings ? (
        <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>
          {
            inquiries.length == 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>: <table className="w-full mt-4 border-collapse" {...getTableProps()}>
              <thead className="bg-slate-700 hover:bg-slate-800 text-white">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="py-2 px-4 border-b border-gray-300 cursor-pointer uppercase font-serif "
                      >
                        <div className="flex items-center gap-2">
                          <span className="">{column.render("Header")}</span>
                          {column.canSort && (
                            <span className="ml-1">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <FaArrowDown />
                                ) : (
                                  <FaArrowUp />
                                )
                              ) : (
                                <FaArrowDown className="text-gray-400" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150">
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="py-2 px-4 ">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          }
        </>

      )}
    </div>
  );
};

export default CareerInquiryTable;
