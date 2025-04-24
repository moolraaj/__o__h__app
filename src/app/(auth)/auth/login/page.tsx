// "use client";

// import { useState, ChangeEvent, FormEvent } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function SuperAdminLogin() {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);


//     const result = await signIn("superadmin", {
//       redirect: false,
//       email,
//       password,
//     });

//     if (result?.error) {
//       setError(result.error);
//     } else {

//       router.push("/super-admin/dashboard");
//     }
//   };

//   return (
//     <>

//       <div style={{ padding: "2rem" }}>
//         <h1>super admin login</h1>


//         {error && <p>{error}</p>}


//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "1rem" }}>
//             <label>Email: </label>
//             <input
//               type="email"
//               name="email"
//               value={email}
//               onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div style={{ marginBottom: "1rem" }}>
//             <label>Password: </label>
//             <input
//               type="password"
//               name="password"
//               value={password}
//               onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//           <button type="submit" style={{ padding: "0.5rem 1rem" }}>
//             Login
//           </button>
//         </form>
//       </div>
//     </>

//   );
// }












"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import loginIlluStration from "@/images/oral-health-hero-banner.png";
import vectorLogin from "@/images/oral-health-vector-1.png";
import Image from "next/image";
import { FiMail, FiLock } from "react-icons/fi";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("superadmin", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/super-admin/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <Image src={vectorLogin.src} alt="login-vector" width={100} height={100} className="login-vector" />
        <h1 className="app-title">SecurePanel</h1>
        <p className="welcome-text">Welcome back, Super Admin</p>
        <p className="subtitle">Please login to manage your dashboard.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="login-error">{error}</p>}

          <div className="input-group">
            <label>Email</label>
            <div className={`input-wrapper ${email ? "filled" : ""}`}>
              <FiMail size={18} className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className={`input-wrapper ${password ? "filled" : ""}`}>
              <FiLock size={18} className="input-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-footer">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a className="forgot-password" href="#">Forgot Password?</a>
          </div>

          <button className="login-button" type="submit">Login</button>

          <p className="signup-text">
            Don’t have an account? <a href="#">Sign Up</a>
          </p>
        </form>

        <footer className="login-footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Help</a>
        </footer>
      </div>

      <div className="login-right">
        <img src={loginIlluStration.src} alt="Login Illustration" />
      </div>
    </div>
  );
}
