import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouterPaths } from "./RouterPath";
import { Error, Home } from "../../pages";
import { Login } from "../../pages/Login/Login";
import { Signup } from "../../pages/Signup/Signup";
import { MultiRoute, NavBar } from "../../components";

export function MainRouter() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <BrowserRouter>
      <NavBar onOpenSignup={() => setShowSignup(true)} />
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
      <Routes>
        {MultiRoute(RouterPaths.HOME, <Home />)}
        <Route path={RouterPaths.LOGIN} element={<Login />} />
        <Route path={RouterPaths.ERROR} element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}