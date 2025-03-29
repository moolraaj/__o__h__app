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

          <div className="ambass_wrapper">
            {userData?.users.map((ele: Users) => (
              <div key={ele._id} className="s_ambassa">
                <ul className="ambass_list u_lists">
                    <li>{ele.name}</li>
                    <li>{ele.email}</li>
                    <li>{ele.phoneNumber}</li>
                    <li>{ele.role}</li>
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
