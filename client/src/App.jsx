import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookList from "./pages/BookList";
import ProfilePage from "./pages/ProfilePage";
import BookDetails from "./pages/BookDetails"; 
import { useAuth } from "./contexts/authContext.jsx";
import AddBook from "./pages/AddBook";

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addbook" element={user?.isAdmin ? <AddBook /> : <Home />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profilepage" element={user ? <ProfilePage /> : <Login />} />
        console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
      </Routes>
    </Router>
  );
};

export default App;
