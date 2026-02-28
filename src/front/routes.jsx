// Import necessary components and functions from react-router-dom.
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Existing pages
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";


import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Private } from "./pages/Private";
import { PrivateRoute } from "./components/PrivateRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Layout />}
      errorElement={<h1>Not found!</h1>}
    >
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

      {/* Authentication Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Private Route */}
      <Route path="/private" element={<Private />} />
    </Route>
  )
);