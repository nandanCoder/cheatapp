import React, { useEffect } from "react";
import Header from "../components/Header";
import Rooms from "../components/Rooms";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../app/featuchers/authSlice";
function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);

  return (
    <div>
      <Rooms />
    </div>
  );
}

export default Home;
