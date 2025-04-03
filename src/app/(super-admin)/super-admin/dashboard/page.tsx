
"use client";

import { useGetUsersQuery } from "@/(store)/services/user/userApi";
import { ShieldCheck, Users, UserCheck } from "lucide-react";

export default function ManageUsers() {
  const { data: adminData, isLoading: adminLoading } = useGetUsersQuery({ page: 1, limit: 15, role: 'admin' });
  const { data: userData, isLoading: userLoading } = useGetUsersQuery({ page: 1, limit: 15, role: 'user' });
  const { data: ambassadorData, isLoading: ambassadorLoading } = useGetUsersQuery({ page: 1, limit: 15, role: 'dantasurakshaks' });

  if (adminLoading || userLoading || ambassadorLoading) return <p>Loading...</p>;

  return (
    <div className="dash_container">
  <div className="dash_outer outer_wrapper">
    <div className="dash_inner">
    <div className="dash_h-d">
    <div className="dash-inner-wraper-h1">
          <h1>Dr. Patrick Kim</h1>
          </div>
    <div className="dash-inner-wraper-p">

          <p>Your schedule today.</p>
          </div>

       
      <div className="dash_wrapper">
       
        <div className="admins dash_holder">
          <ShieldCheck size={20} />
          <div className="inner_dash_holder">
          <h1>{adminData?.roles?.admin ?? 0}</h1>
          <h3>Admins</h3>
          </div>
        </div>

        <div className="users dash_holder">
          <Users size={20} />
          <div className="inner_dash_holder">
          <h1>
          {userData?.roles?.user ?? 0}
          </h1>
          <h3>Users</h3>
          </div>
        </div>

        <div className="ambassadors dash_holder">
          <UserCheck size={20} />
          <div className="inner_dash_holder">
          <h1>{ambassadorData?.roles?.ambassador ?? 0}</h1> 
         <h3>dantasurakshaks</h3>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
