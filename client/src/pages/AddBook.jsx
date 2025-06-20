import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import axios from "axios";

const AddBook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    coverImage: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // redirect if not admin
  if (!user?.isAdmin) {
    return <p>You are not authorized to add books.</p>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/books", form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("Book added successfully!");
      setForm({
        title: "",
        author: "",
        genre: "",
        description: "",
        coverImage: "",
      });
      // Optional: redirect to book list
      navigate("/books");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add book.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Add New Book</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required /><br />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required /><br />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} /><br />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} /><br />
        <input name="coverImage" placeholder="Cover Image URL" value={form.coverImage} onChange={handleChange} /><br />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
