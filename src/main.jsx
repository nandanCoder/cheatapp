import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorPage, Sigin, Signup } from "./pages/index.js";
import { Provider } from "react-redux";
import store from "./app/store/store.js";
import CheatSection from "./pages/CheatSection.jsx";
import Home from "./pages/Home.jsx";
import AuthLayout from "./components/AuthLayout.jsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authentication>
            <Home />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/signin",
        element: (
          <AuthLayout authentication={false}>
            <Sigin />
          </AuthLayout>
        ),
      },
      {
        path: "/chats/:roomid",
        element: (
          <AuthLayout authentication>
            <CheatSection />,
          </AuthLayout>
        ),
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
    <ToastContainer />
  </React.StrictMode>
);
