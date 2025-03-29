"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ReusableModal from "@/(common)/Model";
import { LogOut } from "lucide-react";

function Header() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const firstLetter = userName.charAt(0).toUpperCase();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="header_inner">
      <div
        className="header_wrapper"

      >
        {session && (
          <div className="user-info"  >
            <div
              className="user-icon"
            >
              {firstLetter}
            </div>
            <span onClick={() => setShowLogoutModal(true)} className="logout-button">
              <LogOut size={18} /> Logout
            </span>
          </div>
        )}
      </div>


      <ReusableModal
        isOpen={showLogoutModal}
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

    </div>
  );
}

export default Header;
