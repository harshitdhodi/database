import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditPartnerForm = () => {
    const [partnerName, setPartnerName] = useState("");
    const [photo, setPhoto] = useState([]);
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("active");
    const { id } = useParams();
    const [initialPhotos, setInitialPhotos] = useState([]);
    const [photoAlts, setPhotoAlts] = useState([]);
    const [initialphotoAlts, setInitialPhotoAlts] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fetchPartner();
    }, []);

    const fetchPartner = async () => {
        try {
            const response = await axios.get(`http://localhost:3006/api/partner/singlePartner?id=${id}`, { withCredentials: true });
            const { partnerName, photo, url, alt, status } = response.data;
            setPartnerName(partnerName);
            setInitialPhotos(photo);
            setUrl(url);
            setStatus(status);
            setInitialPhotoAlts(alt);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteInitialPhoto = (e, photoFilename, index) => {
        e.preventDefault();
        axios
            .delete(`http://localhost:3006/api/partner/${id}/image/${photoFilename}/${index}`, { withCredentials: true })
            .then(response => {
                const updatedPhotos = initialPhotos.filter(photo => photo !== photoFilename);
                setInitialPhotos(updatedPhotos);
                const updatedPhotoAlts = [...initialphotoAlts];
                updatedPhotoAlts.splice(index, 1);
                setInitialPhotoAlts(updatedPhotoAlts);
            })
            .catch((error) => {

                console.error(error);
            });
    };

    const handleFileChange = (e) => {
        const newPhotos = Array.from(e.target.files);
        setPhoto([...photo, ...newPhotos]);
    };


    const handleInitialAltTextChange = (e, index) => {
        const newPhotoAlts = [...initialphotoAlts];
        newPhotoAlts[index] = e.target.value;

        setInitialPhotoAlts(newPhotoAlts);
    };

    const handleNewAltTextChange = (e, index) => {
        const newPhotoAlts = [...photoAlts];
        newPhotoAlts[index] = e.target.value;

        setPhotoAlts(newPhotoAlts);
    };

    const handleDeleteNewPhoto = (e, index) => {
        e.preventDefault();
        const updatedPhotos = [...photo];
        updatedPhotos.splice(index, 1);
        setPhoto(updatedPhotos);
        const updatedPhotoAlts = [...initialphotoAlts];
        updatedPhotoAlts.splice(index, 1);
        setInitialPhotoAlts(updatedPhotoAlts);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("partnerName", partnerName);
            // Combine initial and new photo alts into a single array
            const combinedAlts = [...initialphotoAlts, ...photoAlts];

            // Append photos and their respective alts to FormData
            photo.forEach((p) => {
                formData.append(`photo`, p);
            });

            combinedAlts.forEach((a) => {
                formData.append(`alt`, a);
            })

            formData.append("url", url);
            formData.append("status", status);

            const response = await axios.put(
                `http://localhost:3006/api/partner/updatePartner?id=${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true

                }
            );



            setPartnerName("");
            setPhoto([]);
            setUrl("");
            setStatus("active");
            navigate("/clients");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Client</h1>
            <div className="mb-4">
                <label htmlFor="partnerName" className="block font-semibold mb-2">
                    Client Name
                </label>
                <input
                    type="text"
                    id="partnerName"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block font-semibold mb-2">Current Photos</label>
                <div className="grid grid-cols-3 gap-4">
                    {initialPhotos.map((photo, index) => (
                        <div key={index} className="relative w-56">
                            <img
                                src={`http://localhost:3006/api/image/download/${photo}`}
                                alt={`Photo ${index + 1}`}
                                className="w-56 h-32 object-cover"
                            />
                            <label htmlFor={`alt-${index}`} className="block mt-2">
                                Alt Text:
                                <input
                                    type="text"
                                    id={`alt-${index}`}
                                    value={initialphotoAlts[index]}
                                    onChange={(e) => handleInitialAltTextChange(e, index)}
                                    className="w-full p-2 border rounded focus:outline-none"
                                />
                            </label>
                            <button
                                onClick={(e) => handleDeleteInitialPhoto(e, photo, index)}
                                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex justify-center items-center"
                            >
                                <span className="text-xs">X</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label className="block font-semibold mb-2">Add New Photos</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="p-2 border rounded"
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {photo.map((file, index) => (
                        <div key={index} className="relative">
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`New Photo ${index + 1}`}
                                className="w-fullh-32 object-cover"
                            />

                            <label htmlFor={`alt-new-${index}`} className="block mt-2">
                                Alt Text:
                                <input
                                    type="text"
                                    id={`alt-new-${index}`}
                                    value={photoAlts[index] || ""}
                                    onChange={(e) => handleNewAltTextChange(e, index)}
                                    className="w-fullp-2 border rounded focus:outline-none"
                                />
                            </label>
                            <button
                                onClick={(e) => handleDeleteNewPhoto(e, index)}
                                className="absolute top-4 right-2 bg-red-500 text-white rounded-md p-1 size-6 flex
                justify-center items-center"
                            >
                                <span className="text-xs">X</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="url" className="block font-semibold mb-2">
                    URL
                </label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="status" className="block font-semibold mb-2">
                    Status
                </label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Update Partner
            </button>
        </form>
    );
};

export default EditPartnerForm;
