import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logOut, login } from "./app/featuchers/authSlice";
import auth from "./appwrite/auth";
import Header from "./components/Header";
import Loader from "./components/Loader";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    auth
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
          // console.log("User logged");
        } else {
          dispatch(logOut());
        }
      })
      .catch((err) => {
        dispatch(logOut());
        navigate("signin");
        toast.info("You dont have an account or you are not logged in", {
          theme: "light",
        });
      })
      .finally(() => setLoading(false));
  }, []);
  return !loading ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <div className="h-screen w-full flex justify-center items-center">
      <Loader />
    </div>
  );
}

export default App;
