import Layout from "./(common)/layout/Layout";


export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Layout>
                {children}
            </Layout>
        </div>
    );
}
