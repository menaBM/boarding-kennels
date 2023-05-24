import React from "react";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main id="main" className="page-container" aria-labelledby="main content">
        {children}
      </main>
    </> 
  );
}

export default Layout;