import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  User,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { LogIn, LogOut, User as UserIcon, ArrowLeft } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { logOut } from "../app/featuchers/authSlice";
import auth from "../appwrite/auth";
function Header() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loding, setLoding] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomid } = useParams();

  const userData = useSelector((state) => state.auth.userData);
  const handaleLogout = async () => {
    await auth
      .logOut()
      .then(
        toast.success("Successfully logged out ....", { theme: "colored" }),
        dispatch(logOut()),
        navigate("/signin")
      )
      .catch((err) => {
        toast.error(err.message, { theme: "colored" });
      })
      .finally(() => setLoding(false));
  };

  return (
    <>
      <Navbar>
        <NavbarBrand>
          <Link to="/">
            {roomid ? (
              <ArrowLeft />
            ) : (
              <p className="font-bold text-inherit">A ChatApp</p>
            )}
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className=" lg:flex">
            <span>
              {userData ? (
                <User
                  name={
                    userData.name.charAt(0).toUpperCase() +
                    userData.name.slice(1)
                  }
                  description={userData.email}
                />
              ) : (
                <UserIcon />
              )}
            </span>
          </NavbarItem>
          <NavbarItem>
            {userData ? (
              <Button onClick={handaleLogout} color="danger" variant="flat">
                <LogOut />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/signup")}
                color="primary"
                variant="flat">
                <LogIn />
              </Button>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}

export default Header;
