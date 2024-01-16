import React from "react";
import { useSelector } from "react-redux";
function NewPage() {
  const data = useSelector((state) => state.auth.userData);
  console.log(data);
  return <div>NewPage</div>;
}

export default NewPage;
