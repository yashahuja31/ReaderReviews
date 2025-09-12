import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookList from "./pages/BookList";
import ProfilePage from "./pages/ProfilePage";
import ProfileView from "./pages/ProfileView";
import BookDetails from "./pages/BookDetails"; 
import ReadList from "./pages/ReadList";
import { useAuth } from "./contexts/authContext.jsx";
import AddBook from "./pages/AddBook";
import Navbar from "./components/Navbar";
import PageContainer from "./components/PageContainer";
import "./components/Navbar.css";

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <PageContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addbook" element={user?.isAdmin ? <AddBook /> : <Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profilepage" element={user ? <ProfilePage /> : <Login />} />
          <Route path="/profile-view" element={user ? <ProfileView /> : <Login />} />
          <Route path="/readlist" element={user ? <ReadList /> : <Login />} />
        </Routes>
      </PageContainer>
    </Router>
  );
};

export default App;
