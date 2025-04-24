
'use client';

import { useGetAllLesionsQuery } from '@/(store)/services/lesion/lesionApi';
 
import React from 'react';


export default function LesionList() {
    const { data, isLoading, isError } = useGetAllLesionsQuery({ page: 1, limit: 1000 });

    if (isLoading) return <p>Loading lesions…</p>;
    if (isError) return <p>Failed to load lesions.</p>;

  

    const lesions = data?.lesions ?? [];

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">All Lesions</h2>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">patient Name</th>
                        <th className="p-2 border">Age</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Submitted By</th>

                        <th className="p-2 border">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {lesions.map((lesion) => (
                        <tr key={lesion._id}>
                            <td className="p-2 border">{lesion.fullname}</td>
                            <td className="p-2 border">{lesion.age}</td>
                            <td className="p-2 border">{lesion.status}</td>
                            <td className="p-2 border">{lesion.submitted_by}</td>

                            <td className="p-2 border">
                                {new Date(lesion.createdAt).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
