import { Button, Input, Progress } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Send } from "react-feather";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import config from "../appwrite/config";
import { Query, Permission, Role, Client } from "appwrite";
import { Trash2 } from "react-feather";
import { toast } from "react-toastify";
import conf from "../conf/conf";
import NoDataScreen from "../components/NoDataScreen";
function CheatSection() {
  const userData = useSelector((state) => state.auth.userData);
  //console.log(userData);
  const [message, setMessage] = useState("");
  const { roomid } = useParams();
  const [chats, setChats] = useState([]);
  const [loding, setLoading] = useState(true);
  const query = [Query.equal("room_id", roomid)];

  const clint = new Client()
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);
  useEffect(() => {
    setLoading(true);
    config
      .getMessage(query)
      .then((message) => {
        //console.log(message.documents);
        setChats(message.documents);
      })
      .finally(() => {
        setLoading(false);
      });
    const unsubscribe = clint.subscribe(
      [
        `databases.${conf.appwriteDatabaseId}.collections.${conf.appwriteMessageCollectionId}.documents`,
      ],
      (responce) => {
        if (
          responce.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          if (responce.payload.roomid === roomid) {
            setChats((prev) => [...prev, responce.payload]);
          }
          //console.log("A MESSAGE WAS CREATED :");
        } else if (
          responce.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // console.log("A MESSAGE WAS DELETED :");
          setChats((prev) =>
            prev.filter((chat) => chat.$id !== responce.payload.$id)
          );
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);
  let parmissions = [Permission.write(Role.user(userData.$id))];

  const send = () => {
    if (message) {
      config
        .sendMessage({
          message: message,
          name: userData.name,
          user_id: userData.$id,
          room_id: roomid,
          roomid: roomid,
          parmissions,
        })
        .then((res) => {
          // setChats((perv) => [...perv, res]);
        })
        .catch((err) => {
          toast.error(err, { theme: "colored" });
        })
        .finally(() => {
          setMessage("");
        });
    } else {
      toast.warn("Please enter a message", { theme: "colored" });
    }
  };
  const deleteMassage = async (id) => {
    setLoading(true);
    await config
      .deleteMessage(id)
      .then((res) => {
        if (res) {
          //setChats(chats.filter((prev) => prev.$id !== id))
          toast.success("Message deleted successfully", { theme: "colored" });
        } else {
          toast.warn("Somthing want wrong ", { theme: "colored" });
        }
      })
      .catch((err) => {
        toast.error(err.message, { theme: "colored" });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //console.log(chats);
  return (
    <div className="h-full w-full">
      <div className="flex flex-col">
        {loding && (
          <div className="w-full flex justify-center">
            <Progress
              size="sm"
              isIndeterminate
              aria-label="Loading..."
              className="max-w-lg"
            />
          </div>
        )}
        {/* display all massages */}
        <div className="flex-1 h-full w-full p-4 mb-20">
          {chats.length > 0 ? (
            chats.map((item) =>
              item.user_id === userData.$id ? (
                <div className="flex justify-end mb-2" key={item.$id}>
                  {/* chatbox */}
                  <div>
                    <div className="message--wrapper">
                      <div className="message--header">
                        <p>
                          {item.name ? (
                            <span> {item.name} </span>
                          ) : (
                            "Anonymous user"
                          )}
                          <small className="message-timestamp">
                            {new Date(item.$createdAt).toLocaleString()}
                          </small>
                        </p>
                        <div>
                          {item.$permissions.includes(
                            `delete(\"user:${userData.$id}\")`
                          ) && (
                            <Trash2
                              className="delete--btn"
                              onClick={() => {
                                deleteMassage(item.$id);
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="message--body">
                        <span>{item.message}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start mb-2" key={item.$id}>
                  <div>
                    {/* chatbox */}
                    <div className="message--wrapper">
                      <div className="message--header">
                        <p>
                          {item.name ? (
                            <span> {item.name} </span>
                          ) : (
                            "Anonymous user"
                          )}
                          <small className="message-timestamp">
                            {new Date(item.$createdAt).toLocaleString()}
                          </small>
                        </p>
                        <div>
                          {item.$permissions.includes(
                            `delete(\"user:${userData.$id}\")`
                          ) && (
                            <Trash2
                              className="delete--btn"
                              onClick={() => {
                                deleteMassage(item.$id);
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="message--body">
                        <span>{item.message}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="w-full h-full mt-[30%] flex items-center justify-center">
              <NoDataScreen />
            </div>
          )}
        </div>
        {/* input */}
        <div
          className="p-4 bottom-1 left-0 right-0 "
          style={{ position: "fixed" }}>
          <div className="flex items-center md:space-x-10">
            <Input
              required
              type="email"
              label="Type message..."
              color="primary"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              onClick={send}
              color="primary"
              size="lg"
              variant="light"
              className="py-4 mx-2">
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheatSection;
