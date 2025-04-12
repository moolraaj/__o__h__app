"use client";

import Link from "next/link";
import React from "react";
import { LayoutDashboard, ShieldCheck, UserCheck, Users } from "lucide-react";
 

function Sidebar() {
  return (
    <div className="side_bar_inner">
      <div className="sidebar_wrapper">
        <ul className="show_l">
          <li>
            <Link href="/super-admin/dashboard" className="flex items-center gap-2">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/super-admin/admin" className="flex items-center gap-2">
              <ShieldCheck size={18} /> Admins
            </Link>
          </li>
          <li>
            <Link href="/super-admin/ambassador" className="flex items-center gap-2">
              <UserCheck size={18} /> Ambassadors
            </Link>
          </li>
          <li>
            <Link href="/super-admin/user" className="flex items-center gap-2">
              <Users size={18} /> Users
            </Link>
          </li>
          <li>
            <Link href="/super-admin/slider" className="flex items-center gap-2">
              <Users size={18} /> Slider
            </Link>
          </li>

          <li>
            <Link href="/super-admin/disease" className="flex items-center gap-2">
              <Users size={18} /> Disease
            </Link>
          </li>
         
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
