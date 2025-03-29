"use client";

import { useGetUsersQuery } from "@/(store)/services/user/userApi";
import { ShieldCheck, Users, UserCheck } from "lucide-react";

export default function ManageUsers() {
  const { data: adminData, isLoading: adminLoading } = useGetUsersQuery({ page: 1, limit: 15, role: 'admin' });
  const { data: userData, isLoading: userLoading } = useGetUsersQuery({ page: 1, limit: 15, role: 'user' });
  const { data: ambassadorData, isLoading: ambassadorLoading } = useGetUsersQuery({ page: 1, limit: 15, role: 'ambassador' });

  if (adminLoading || userLoading || ambassadorLoading) return <p>Loading...</p>;

  return (
    <div className="dash_outer outer_wrapper">
      <div className="dash_inner">
        <div className="dash_wrapper">
          <div className="admins dash_holder">
            <ShieldCheck size={20} />
            <h3>Admins</h3>
            <p>{adminData?.roles?.admin ?? 0}</p>
          </div>

          <div className="users dash_holder">
            <Users size={20} />
            <h3>Users</h3>
            <p>{userData?.roles?.user ?? 0}</p>
          </div>

          <div className="ambassadors dash_holder">
            <UserCheck size={20} />
            <h3>Ambassadors</h3>
            <p>{ambassadorData?.roles?.ambassador ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
