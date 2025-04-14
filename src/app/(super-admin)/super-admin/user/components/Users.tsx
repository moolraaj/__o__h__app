"use client";

import { useGetUsersQuery } from "@/(store)/services/user/userApi";
import { Users } from "@/utils/Types";
import { UserCheck } from "lucide-react";

 

export default function UserLists() {
  const { data: userData, isLoading: ambassadorLoading   } = useGetUsersQuery({
    page: 1,
    limit: 100,
    role: 'user'
  });

 

 

  if (ambassadorLoading) return <p>Loading...</p>;

  return (
    <div className="ambassa_outer outer_wrapper">
      <div className="ambassa_inner">
        <div className="ambassa_wrapper">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <UserCheck size={20} /> Usres 
          </h2>

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


