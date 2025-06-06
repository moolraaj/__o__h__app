"use client";

import Loader from "@/(common)/Loader";
import { useGetUsersQuery } from "@/(store)/services/user/userApi";
import { useBreadcrumb } from "@/provider/BreadcrumbContext";
import { Users } from "@/utils/Types";
import { useEffect } from "react";
import { FaUsers } from "react-icons/fa";



export default function UserLists() {
  const { data: userData, isLoading: ambassadorLoading } = useGetUsersQuery({
    page: 1,
    limit: 100,
    role: 'user'
  });


  const { setRightContent } = useBreadcrumb();
  useEffect(() => {
    if (!userData) return;

    setRightContent(
      <div className="total-count-wrapper">
        <i><FaUsers size={18} color="#56235E" /></i>
        <span className="total-count">{userData.total} Users</span>
      </div>
    );

    return () => setRightContent(null);
  }, [userData, setRightContent]);


  if (ambassadorLoading) return <Loader />;

  return (
    <div className="ambassa_outer outer_wrapper">
      <div className="ambassa_inner">
        <div className="ambassa_wrapper">
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {userData?.users.map((ele: Users, index: number) => (
                  <tr key={ele._id}>
                    <td>{index + 1}</td>
                    <td>{ele.name}</td>
                    <td>{ele.email}</td>
                    <td>{ele.phoneNumber}</td>
                    <td className={`role-cell ${ele.role}`}>{ele.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


