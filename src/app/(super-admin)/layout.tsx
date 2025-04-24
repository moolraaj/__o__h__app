import BreadCrumb from "./(common)/header/BreadCrumb";
import Layout from "./(common)/layout/Layout";


export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Layout>
                <BreadCrumb />
                <div className="content-container">
                    {children}
                </div>
            </Layout>
        </div>
    );
}
