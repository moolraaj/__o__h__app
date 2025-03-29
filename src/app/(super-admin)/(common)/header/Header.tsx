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
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {firstLetter}
            </div>
            <button onClick={() => setShowLogoutModal(true)}>
              <LogOut size={18} /> Logout
            </button>
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
