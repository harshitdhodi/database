import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FaEdit, FaTrashAlt, FaCheck, FaEye, FaTimes, FaArrowUp, FaArrowDown, FaPlus, FaFileImport, FaFileExport } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import * as FaIcons from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";


Modal.setAppElement('#root');


const ServicesTable = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [services, setServices] = useState([]);
  const [loadings, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [showFileInput, setShowFileInput] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [metaFilter, setMetaFilter] = useState("All");
  const [selectedService, setSelectedService] = useState(null); // State for the selected banner
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate()
  const pageSize = 5;

  const notify = () => {
    toast.success("Updated Successfully!");
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      if (metaFilter === "Meta Available") {
        return service.metatitle && service.metatitle.length > 0 || service.metadescription && service.metadescription.length > 0;;
      }
      if (metaFilter === "Meta Unavailable") {
        return !service.metatitle || service.metatitle.length === 0 || !service.metadescription || service.metadescription.length === 0;
      }
      return true;
    }).filter((service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [services, searchTerm, metaFilter]);



  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Category",
        accessor: "categoryName",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/services/editServices/${row.original.slug}`)}
          >
            {row.original.categoryName}
          </span>
        ),
      },
      // {
      //   Header: "Icon",
      //   accessor: "Icon",
      //   Cell: ({ value }) => <DynamicFaIcon name={value} />,
      //   disableSortBy: true,
      // },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row }) => (
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => navigate(`/services/editServices/${row.original.slug}`)}
          >
            {row.original.title}
          </span>
        ),
      },
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => {
          const firstImage = Array.isArray(value) && value.length > 0 ? value[0] : null;
          return firstImage ? <img src={`http://localhost:3006/api/image/download/${firstImage}`} alt="Service" className=" w-32 h-20 object-cover" /> : null;

        },
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => value === "active" ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />,
        disableSortBy: true,
      },
      {
        Header: "Options",
        Cell: ({ row }) => (
          <div className="flex gap-4">
            <button className="text-blue-500 hover:text-blue-700 transition" onClick={() => handleView(row.original)}>
              <FaEye />
            </button>
            <button className="text-blue-500 hover:text-blue-700 transition">
              <Link to={`/services/editServices/${row.original.slug}`}>  <FaEdit /></Link>
            </button>
            <button className="text-red-500 hover:text-red-700 transition" onClick={() => deleteService(row.original.slug)}>
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
      data: filteredServices,
    },
    useSortBy
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3006/api/services/getService?page=${pageIndex + 1}`, { withCredentials: true });

      const servicesWithIds = response.data.data.map((service, index) => ({
        ...service,
        Icon: service.icons,
        id: pageIndex * pageSize + index + 1,
      }));
      setServices(servicesWithIds);
      setPageCount(Math.ceil(response.data.total / pageSize)); // Assuming the API returns the total number of items
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const deleteService = async (slugs) => {
    try {
      const response = await axios.delete(`http://localhost:3006/api/services/deleteService?slugs=${slugs}`, { withCredentials: true });
       window.location.href="/services"
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(pageIndex);
  }, [pageIndex]);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get('http://localhost:3006/api/pageHeading/heading?pageType=service', { withCredentials: true });
      const { heading, subheading } = response.data;
      setHeading(heading || '');
      setSubheading(subheading|| '');
    } catch (error) {
      console.error(error);
    }
  };

  const saveHeadings = async () => {
    try {
      await axios.put('http://localhost:3006/api/pageHeading/updateHeading?pageType=service', {
        pagetype: 'service',
        heading,
        subheading,
      }, { withCredentials: true });
      notify();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeadings();
  }, []);


  // const DynamicFaIcon = ({ name }) => {
  //   const IconComponent = FaIcons[name];
  //   if (!IconComponent) {
  //     return <FaIcons.FaQuestionCircle />; // Return a default icon if the specified icon doesn't exist
  //   }
  //   return <IconComponent size={25} />;
  // };

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  function exportServices() {
    axios.get('http://localhost:3006/api/services/exportService', { responseType: 'blob', withCredentials: true })
      .then(response => {
        // Create a temporary link element
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Services.xlsx';
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(error => {
        console.error('Error exporting products:', error);
        alert('Failed to export products');
      });
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const onFileUpload = async () => {

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }


    const formData = new FormData();
    formData.append('file', file);


    try {
      const response = await axios.post('http://localhost:3006/api/services/importService', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file.');
    }
  }

  return (
    <div className="p-4 overflow-x-auto">
      <ToastContainer />
      <div className="mb-8 border border-gray-200 shadow-lg p-4 rounded ">
        <div className="grid md:grid-cols-2 md:gap-2 grid-cols-1">
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={handleHeadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2 uppercase font-serif">Sub heading</label>
            <input
              type="text"
              value={subheading}
              onChange={handleSubheadingChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            />
          </div>
        </div>
        <button
          onClick={saveHeadings}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300"
        >
          Save
        </button>
      </div>
      <div className="flex md:flex-row flex-col justify-between md:items-center mb-4">
        <h1 className="text-xl font-bold  text-gray-700 font-serif uppercase">Services</h1>
        <div className="flex gap-2 md:flex-row flex-col md:mt-0 mt-4">
          <div className="flex items-center gap-2">
            <select
              className="px-2 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
              value={metaFilter}
              onChange={(e) => setMetaFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Meta Available">Meta Available</option>
              <option value="Meta Unavailable">Meta Unavailable</option>
            </select>
            <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300">
              <Link to="/services/createServices"><FaPlus size={15} /></Link>
            </button>
            <button onClick={exportServices} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300">
              <FaFileExport size={15} />
            </button>
            <button onClick={() => { onFileUpload(); setShowFileInput(true) }} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300">
              <FaFileImport size={15} />
            </button>
          </div>
          <div>
            {showFileInput && (
              <div className=" mt-2 p-2 bg-white border border-gray-200 rounded shadow-md">
                <input type="file" onChange={handleFileChange} className="mb-2" />
                <button onClick={onFileUpload} className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300">
                  Upload
                </button>
                {message && <p>{message}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
        />
      </div>
      <h2 className="text-md font-semibold mb-4">Manage your service</h2>
      {loadings ? (
       <div className="flex justify-center"><UseAnimations animation={loading} size={56} /></div>
      ) : (
        <>{services.length == 0 ? <div className="flex justify-center items-center"><iframe className="w-96 h-96" src="https://lottie.host/embed/1ce6d411-765d-4361-93ca-55d98fefb13b/AonqR3e5vB.json"></iframe></div>
          :<table className="w-full mt-4 border-collapse" {...getTableProps()}>
          <thead className="bg-slate-700 hover:bg-slate-800 text-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-2 px-4 border-b border-gray-300 cursor-pointer uppercase font-serif"
                  >
                    <div className="flex items-center gap-2 ">
                      <span>{column.render("Header")}</span>
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
                <tr {...row.getRowProps()} className="border-b border-gray-300 hover:bg-gray-100 transition duration-150 ">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="py-2 px-4 ">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>}</>
        
      )}
      <div className="mt-4 flex justify-center">
        <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0} className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">
          {"<<"}
        </button>{" "}
        <button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 0} className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">
          {"<"}
        </button>{" "}
        <button onClick={() => setPageIndex(pageIndex + 1)} disabled={pageIndex + 1 >= pageCount} className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">
          {">"}
        </button>{" "}
        <button onClick={() => setPageIndex(pageCount - 1)} disabled={pageIndex + 1 >= pageCount} className="mr-2 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{" "}
        </span>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Banner Details"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-8 rounded shadow-lg w-96 relative">
        <button onClick={closeModal} className="absolute top-5 right-5 text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
          <h2 className="text-xl font-bold mb-4 font-serif">Service</h2>
          {selectedService && (
            <div className="">
              <div className="flex mt-2">
                <p className="mr-2 font-semibold font-serif">Title :</p>
                <p>{selectedService.title}</p>
              </div>
              <label className="mr-2 mt-2 font-semibold font-serif"> Description :<ReactQuill
                readOnly={true}
                value={selectedService.details}
                modules={{ toolbar: false }}
                theme="bubble"
                className="quill"
              />
              </label>
            </div>
          )}
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-900 transition duration-300"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ServicesTable;
