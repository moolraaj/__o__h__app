// "use client";

// import Link from "next/link";
// import React from "react";
// import { LayoutDashboard, ShieldCheck, UserCheck, Users } from "lucide-react";

// interface SidebarProps {
//   isSidebarExpanded: boolean;
//   isMobile: boolean;
//   openMenu: () => void;
// }

// const links = [
//   { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { href: "/super-admin/admin", label: "Admins", icon: ShieldCheck },
//   { href: "/super-admin/ambassador", label: "Ambassadors", icon: UserCheck },
//   { href: "/super-admin/user", label: "Users", icon: Users },
//   { href: "/super-admin/slider", label: "Slider", icon: Users },
//   { href: "/super-admin/disease", label: "Disease", icon: Users },
// ];

// const Sidebar: React.FC<SidebarProps> = ({ isSidebarExpanded,isMobile,openMenu }) => {
//   return (
//     <div className="side_bar_inner">
//       <div className="sidebar_wrapper">
//         <ul className="show_l">
//           {links.map(({ href, label, icon: Icon }) => (
//             <li key={href}>
//               <Link href={href} className="flex items-center gap-2">
//                 <span><Icon size={20} /></span>
//                 {(isMobile || isSidebarExpanded) && <h1>{label}</h1>}

//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


"use client";

import Link from "next/link";
import React from "react";
import { LayoutDashboard, ShieldCheck, UserCheck, Users, X } from "lucide-react";

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
  return (
    <div className="side_bar_inner relative">
      {/* Cut/Close Button */}

      {isMobile &&
        <span
          onClick={openMenu}
          className="sidebar-close-button"
          aria-label="Close Sidebar"
        >
          <X size={20} />
        </span>
      }
      <div className="sidebar_wrapper mt-10">
        <ul className="show_l">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded ">
                <span><Icon size={20} /></span>
                {(isMobile || isSidebarExpanded) && <h1>{label}</h1>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;




