import { Spinner } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import config from "../appwrite/config";
// add rooms components
import {
  Button,
  Input,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { MessageSquare, X } from "react-feather";
import { Client, Permission, Role } from "appwrite";
import conf from "../conf/conf";
import NoDataScreen from "./NoDataScreen";
function Rooms() {
  const [allRoom, setAllRoom] = useState([]);
  const isRendered = useRef(false);

  // add rooms components
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const userData = useSelector((state) => state.auth.userData);
  const clint = new Client()
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);
  useEffect(() => {
    if (!isRendered.current) {
      setLoading(true);
      config
        .getRooms()
        .then((rooms) => {
          setAllRoom(rooms.documents);
          //console.log(rooms.documents);
        })
        .catch((err) => {
          //console.log(err);
        })
        .finally(() => setLoading(false));
    }
    const unsubscribe = clint.subscribe(
      [
        `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteRoomCollectionId}.documents`,
      ],
      (responce) => {
        //console.log(responce);
        if (
          responce.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setAllRoom((prev) => [...prev, responce.payload]);
          //console.log("A MESSAGE WAS CREATED :");
        } else if (
          responce.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // console.log("A MESSAGE WAS DELETED :");
          setAllRoom((prev) =>
            prev.filter((room) => room.$id !== responce.payload.$id)
          );
        }
      }
    );
    isRendered.current = false;
    return () => {
      unsubscribe();
    };
  }, []);

  //add rooms components
  let parmissions = [Permission.write(Role.user(userData.$id))];
  const createRoom = async (data) => {
    setLoading(true);
    await config
      .createRoom({
        ...data,
        auther: userData ? userData.name : null,
        user_id: userData.$id,
        parmissions,
      })
      .then((post) => {
        navigate(`/chats/${post.$id}`);
        // console.log(post);
        if (post) {
          toast.success("Your room has been created successfully", {
            theme: "colored",
          });
        } else {
          toast.error("Your room  not  created", { theme: "colored" });
        }
      })
      .catch((err) => {
        toast.error(err.message, { theme: "colored" });
      })
      .finally(() => setLoading(false));
  };
  const removeRoom = async (room_id) => {
    setLoading(true);
    config
      .deleteRoom(room_id)
      .then((res) => {
        //setAllRoom(allRoom.filter((room) => room.$id !== room_id));
        if (res) {
          toast.success("Your room has been removed successfully", {
            theme: "colored",
          });
        } else {
          toast.warn("Somthing want wrong ::", { theme: "colored" });
        }
      })
      .catch((err) => {
        toast.error(err.message, { theme: "colored" });
      })
      .finally(() => {
        setLoading(false);
      });
    // console.log(allRoom);
  };
  //console.log(allRoom);
  return (
    <div className="h-screen w-full">
      {/* add rooms components */}
      <div className="w-full mt-2 p-4 flex justify-end">
        <Button
          onPress={onOpen}
          className=" mr-10 "
          variant="shadow"
          color="secondary">
          Create Room
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex text-black flex-col gap-1">
                  Are you sure to create a room ?
                </ModalHeader>
                <ModalBody>
                  <Input
                    type="text"
                    label="Room name"
                    {...register("name", { required: true })}
                  />
                  <Input
                    type="text"
                    label="discription"
                    {...register("discription", { required: true })}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="bordered" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="success"
                    className="text-white"
                    onPress={onClose}
                    onClick={handleSubmit(createRoom)}>
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      {/* add rooms components uper */}
      <div className="text-center w-full">{loading && <Spinner />}</div>
      <div className="w-full mt-4 p-6 grid gap-y-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-4">
        {allRoom &&
          allRoom.map((room) => (
            // room card
            <Card key={room.$id}>
              <CardBody className="bg-gray-300 shadow">
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-xl">
                      {room.name.charAt(0).toUpperCase() + room.name.slice(1)}
                    </p>
                    <p className="text-small text-default-500">
                      Created by
                      <span className="py-2" aria-label="computer" role="img">
                        💻
                      </span>{" "}
                      {room.auther.charAt(0).toUpperCase() +
                        room.auther.slice(1)}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p>
                    {room.discription.charAt(0).toUpperCase() +
                      room.discription.slice(1)}
                  </p>
                </CardBody>
                <Divider />
                <CardFooter className="">
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/chats/${room.$id}`)}
                    color="primary"
                    radius="full">
                    Cheat
                    <MessageSquare />
                  </Button>
                  {room.$permissions.includes(
                    `delete(\"user:${userData.$id}\")`
                  ) && (
                    <Button
                      onClick={() => removeRoom(room.$id)}
                      color="danger"
                      radius="full"
                      className="ml-4">
                      {/* Remove */}
                      <X />
                    </Button>
                  )}
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        {/* pliss help any oun i dont push data in redus state in same arrey */}
      </div>
    </div>
  );
}

export default Rooms;
