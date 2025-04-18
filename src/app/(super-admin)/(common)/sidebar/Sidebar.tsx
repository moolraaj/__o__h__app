"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LayoutDashboard, ShieldCheck, UserCheck, Users } from "lucide-react";
import { FaTimes } from "react-icons/fa";

interface SidebarProps {
  isSidebarExpanded: boolean;
  isMobile: boolean;
  openMenu: () => void;
}

const links = [
  { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super-admin/admin", label: "Admins", icon: ShieldCheck },
  { href: "/super-admin/ambassador", label: "Ambassadors", icon: UserCheck },
  { href: "/super-admin/user", label: "Users", icon: Users },
  { href: "/super-admin/slider", label: "Slider", icon: Users },
  { href: "/super-admin/disease", label: "Disease", icon: Users },
];

const Sidebar: React.FC<SidebarProps> = ({ isSidebarExpanded, isMobile, openMenu }) => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {

    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="side_bar_inner relative">
      {isMobile && (
        <div className="sidebar_header">
          <span
            onClick={openMenu}
            className="sidebar-close-button"
            aria-label="Close Sidebar"
          >
            <FaTimes size={20} />
          </span>

          <div className="sidebar-logo p-4 flex justify-center items-center">
            <h1>Logo</h1>
          </div>
        </div>
      )}



      <div className="sidebar_wrapper mt-10">
        <ul className="show_l">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 p-2 rounded transition-colors ${isActive ? "active-sidebar-link" : "hover:bg-gray-100"
                    }`}
                >
                  <span><Icon size={20} /></span>
                  {(isMobile || isSidebarExpanded) && <h1>{label}</h1>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
