import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditFAQ = () => {
  const { id: faqId } = useParams();
  const navigate = useNavigate(); 
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("active");

  const modules = {
    toolbar: [
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        [{ 'direction': 'rtl' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
};


  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/api/faq/getFAQById?id=${faqId}`,{ withCredentials: true });
        const { question, answer, status } = response.data.data;
        setQuestion(question);
        setAnswer(answer);
        setStatus(status);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFAQData();
  }, [faqId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const faqData = {
        question,
        answer,
        status
      };

      await axios.put(`http://localhost:3006/api/faq/updateFAQ?id=${faqId}`, faqData,{ withCredentials: true });

      // Clear the form fields after submission
      setQuestion("");
      setAnswer("");
      setStatus("active");

      // Navigate to the FAQs page after successful submission
      navigate("/faq");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-xl font-bold font-serif text-gray-700 uppercase text-center">Edit Faq</h1>
      <div className="mb-4">
        <label htmlFor="question" className="block font-semibold mb-2">
          Question
        </label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="answer" className="block font-semibold mb-2">
          Answer
        </label>
        <ReactQuill
          value={answer}
          onChange={setAnswer}
          modules={modules} // Include modules for image handling
          className="quill"
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
        Update FAQ
      </button>
    </form>
  );
};

export default EditFAQ;
