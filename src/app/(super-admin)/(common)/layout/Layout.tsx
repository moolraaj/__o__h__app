"use client"
import { useEffect, useState } from 'react';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
// import { usePathname } from 'next/navigation';
 

export default function Layout({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname();

  const [isToggle, setIsToggle] = useState<boolean>(false); // mobile sidebar toggle state
  const [isMobile, setIsMobile] = useState<boolean>(false); // check if the device is mobile

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarState");
      return savedState ? JSON.parse(savedState) : true;
    }
    return true;
  });

  // Detect screen size on mount and when resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Set to true if the screen size is <= 1024px
    };

    // Initialize on mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update localStorage whenever the state changes, but only for larger screens
  useEffect(() => {
    if (typeof window !== "undefined" && !isMobile) {
      localStorage.setItem("sidebarState", JSON.stringify(isSidebarExpanded));
    }
  }, [isSidebarExpanded, isMobile]);

  // Toggle left sidebar for desktop
  const handleToggleSidebar = () => {
    setIsSidebarExpanded((prevState: boolean) => !prevState);
  };

  // Toggle sidebar for mobile
  const openMenu = () => {
    setIsToggle(!isToggle);  // Toggle mobile sidebar visibility
  };


  return (
    <div className="dashboard_container">
        <Header
          handleToggleSidebar={handleToggleSidebar}
          openMenu={openMenu}
          isMobile={isMobile}
        />
     
      <div className="dashboard_main">
      <div
        className={`sidebar ${isSidebarExpanded ? 'expanded-view' : 'collapse-view'} ${isMobile ? (isToggle ? 'show-sidebar' : 'hide-sidebar') : ''}`}
        style={{
          width: isMobile ? '90%' : isSidebarExpanded ? '250px' : '90px',
        }}
      >
        <Sidebar 
        isSidebarExpanded={isSidebarExpanded}
        isMobile={isMobile}
        openMenu={openMenu}
        />
        </div>
        <main className="dashboard_content">
          {children}  
        
        </main>
      </div>
     
    </div>
  );
}
