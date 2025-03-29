"use client";

import { useGetUsersQuery } from "@/(store)/services/user/userApi";
import { useState } from "react";
import { UserCheck } from "lucide-react";
import { Users } from "@/utils/Types";

 

export default function AdminLists() {
  const { data: adminData, isLoading: ambassadorLoading, refetch: refetchAmbassadors } = useGetUsersQuery({
    page: 1,
    limit: 15,
    role: 'admin'
  });

  const [actionLoading, setActionLoading] = useState(false);

  const updateUser = async (id: string, action: "approved" | "rejected", currentRole: string) => {
    setActionLoading(true);
    const body = {
      status: action,
      role: action === "approved"
        ? (currentRole === "admin" || currentRole === "ambassador" ? currentRole : "admin")
        : "user"
    };

    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        refetchAmbassadors();
      } else {
        alert(data.error || "Failed to update user.");
      }
    } catch (err) {
      if(err instanceof Error){

        alert(err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (ambassadorLoading) return <p>Loading...</p>;

  return (
    <div className="ambassa_outer outer_wrapper">
      <div className="ambassa_inner">
        <div className="ambassa_wrapper">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <UserCheck size={20} /> Admins
          </h2>

          <div className="ambass_wrapper">
            {adminData?.users.map((ele: Users) => (
              <div key={ele._id} className="s_ambassa border p-3 mb-4 rounded shadow">
                <ul className="ambass_list u_lists">
                  <li><strong>Name:</strong> {ele.name}</li>
                  <li><strong>Email:</strong> {ele.email}</li>
                  <li><strong>Phone:</strong> {ele.phoneNumber}</li>
                  <li><strong>Role:</strong> {ele.role}</li>
                  <li><strong>Status:</strong> {ele.status}</li>
                </ul>

                <div className="actions mt-2">
                  <button
                    disabled={actionLoading || ele.status !== 'pending'}
                    onClick={() => updateUser(ele._id, 'approved', ele.role)}
                    style={{
                      marginRight: '10px',
                      backgroundColor: ele.status === 'approved' ? 'gray' : 'green',
                      color: '#fff',
                      padding: '5px 10px',
                      cursor: ele.status === 'pending' ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Approve
                  </button>

                  <button
                    disabled={actionLoading || ele.status !== 'pending'}
                    onClick={() => updateUser(ele._id, 'rejected', ele.role)}
                    style={{
                      backgroundColor: ele.status === 'rejected' ? 'gray' : 'red',
                      color: '#fff',
                      padding: '5px 10px',
                      cursor: ele.status === 'pending' ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
