// Shell for every logged-in page: Navbar on top, the current page below.
// <Outlet /> is where React Router renders the matched child route (see App.jsx).
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Outlet />
      </main>
    </>
  );
}

export default AppLayout;
