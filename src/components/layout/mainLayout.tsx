import { Outlet } from "react-router-dom";
import NavBar from "../navbar/Navbar";

const mainLayout = () => {
  return (
    <>
      <NavBar />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default mainLayout;
