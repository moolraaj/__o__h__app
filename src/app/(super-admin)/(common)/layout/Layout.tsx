import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
 

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard_container">
     
      <div className="dashboard_main">
        <Sidebar />
        <main className="dashboard_content">
        <Header />
          {children}  
        
        </main>
      </div>
     
    </div>
  );
}
