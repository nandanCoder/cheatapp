import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import auth from "../appwrite/auth";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOut, login } from "../app/featuchers/authSlice";
function Signup() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [loding, setLoding] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const create = async (data) => {
    setError("");
    setLoding(true);
    await auth
      .createAccount(data)
      .then((res) => {
        setLoding(false);
        auth.getCurrentUser().then((userData) => {
          //console.log("User created send datta :", userData);
          dispatch(login({ userData }));
          if (userData) {
            toast.success("Hay your account created successfully", {
              theme: "colored",
            });
            // console.log("Successfully created : ", res);
            navigate("/");
          } else {
            dispatch(logOut());
          }
        });
      })
      .catch((err) => {
        toast.error(err.message, { theme: "colored" });
        setLoding(false);
        setError(err.message);
      });
  };
  return (
    <div className="h-screen w-full flex items-center justify-center ">
      <div className=" p-6 w-[500px] rounded-xl flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-red-400 text-center ">
          Cheat app
        </h1>
        <h1 className="text-2xl font-bold"> Sing Up </h1>
        <p>Create a account to cheat all over the world</p>
        <form
          onSubmit={handleSubmit(create)}
          className="gap-4 flex flex-col mt-4">
          <Input
            label="Name.."
            type="text"
            {...register("name", { required: true })}
          />

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
          {error ? <p className="text-[#f93d3d] text-sm">{error}</p> : null}
          <Button
            isLoading={loding}
            color="danger"
            type="submit"
            disabled={loding}
            size="lg">
            {loding ? "Creating..." : "Submit"}
          </Button>
        </form>
        <p className="text-center mb-4">
          You have an account login
          {
            <Link className="p-2 text-blue-600 underline" to="/signin">
              here
            </Link>
          }
        </p>
      </div>
    </div>
  );
}

export default Signup;
