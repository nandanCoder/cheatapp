import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../appwrite/auth";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOut, login as userLoginData } from "../app/featuchers/authSlice";

function Sigin() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loding, setLoding] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const login = async (data) => {
    setError("");
    setLoding(true);
    await auth
      .login(data)
      .then((res) => {
        setLoding(false);
        auth.getCurrentUser().then((userData) => {
          dispatch(userLoginData({ userData }));
          if (userData) {
            navigate("/");
            toast.success("Account login successful....", {
              theme: "colored",
            });
            // console.log("login success", res);
          } else {
            dispatch(logOut());
          }
        });
      })
      .catch((err) => {
        console.log("error", err);
        setError(err.message);
        setLoding(false);
        //toast.error(err.message, { theme: "colored" });
      });
  };
  return (
    <div className="h-screen w-full flex items-center justify-center ">
      <div className=" p-6 w-[500px] rounded-xl flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-red-400 text-center ">
          Cheat app
        </h1>
        <h1 className="text-2xl font-bold"> Sing in </h1>
        <p>Welcome back ||</p>
        <form
          onSubmit={handleSubmit(login)}
          className="gap-4 flex flex-col mt-4">
          <Input
            label="Email.."
            type="email"
            {...register("email", {
              required: true,
              validate: {
                matchPattern: (value) =>
                  /[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/.test(
                    value
                  ) || "Email address must be a valid email address",
              },
            })}
          />
          <Input
            label="Password.."
            type="password"
            {...register("password", {
              required: true,
            })}
          />
          {error ? <p className="text-red-800 text-sm">{error}</p> : null}
          <Button
            color="danger"
            type="submit"
            size="lg"
            isLoading={loding}
            disabled={loding}>
            {loding ? "Prossing..." : "Login"}
          </Button>
        </form>
        <p className="text-center mb-4">
          You dont have an account singup
          {
            <Link className="p-2 text-blue-600 underline" to="/signup">
              here
            </Link>
          }
        </p>
      </div>
    </div>
  );
}

export default Sigin;
