'use client';

import Loader from '@/(common)/Loader';

import { useGetQuestionnaireQuery } from '@/(store)/services/questionnaire/questionnaireApi';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { PAGE_PER_ITEMS } from '@/utils/const';
import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { FeedbackButton } from './ShowFeedback';
import { Questionnaire } from '@/utils/Types';
 

export default function QuestionnaireList() {
    const [page, setPage] = useState(1)

    const { data, isLoading, isError } = useGetQuestionnaireQuery({ page, limit: PAGE_PER_ITEMS });
    const { setRightContent } = useBreadcrumb();

    useEffect(() => {
        if (!data) return;

        setRightContent(
            <div className="total-count-wrapper">
                <i><FaBook size={18} color="#56235E" /></i>
                <span className="total-count"> {data.totalResults} Questionnaire</span>
            </div>
        );

        return () => setRightContent(null);
    }, [data, setRightContent, page]);

    if (isLoading) return <Loader />;
    if (isError) return <p className="lesion-status error">Failed to load questionnaire.</p>;
    const questionnaire = data?.data ?? [];
    const totalResults = data.totalResults;
    const totalPages = Math.ceil(totalResults / PAGE_PER_ITEMS);
    const shouldShowPagination = totalResults > PAGE_PER_ITEMS;

    console.log(`questionnaire`)
    console.log(questionnaire)

    return (
        <div className="lesion-wrapper">
            <div className="lesion-table-container">
                <table className="lesion-table">
                    <thead>
                        <tr>
                            <th>Submitted By (Dantasurakshaks)</th>
                            <th>Assign To (Admin)</th>
                            <th>Feedback By (Admin)</th>
                            <th>Patient Name</th>
                            <th>Patient Number</th>
                            <th>Age</th>
                            <th>Created At</th>

                        </tr>
                    </thead>
                        
                    <tbody>
                        
                        {questionnaire.map((el:Questionnaire) => (
                            
                            <tr key={el._id}>
                                <td>{el.submitted_by ? el.submitted_by.name : 'Not found'} ({el.submitted_by ? el.submitted_by?.phoneNumber : 'Not found'})</td>
                                <td>{el.assignTo ? el.assignTo?.name : 'Not found'} ({el.assignTo ? el.assignTo?.phoneNumber : 'Not found'})</td>
                                <td>
                                    {el?.send_email_to_dantasurakshaks === true ? (<FeedbackButton el={el} />) : ('No Feedback Found')}
                                </td>
                                <td>{el.name}</td>
                                <td>{el.phoneNumber}</td>
                                <td>{el.age}</td>
                                <td>{new Date(el.createdAt).toLocaleString()}</td>
                            </tr>
                            
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination_steps">
                {shouldShowPagination && (
                    <div className="pagination-controls mt-4 flex items-center justify-center space-x-4">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className={`px-3 py-1 border rounded disabled:opacity-50 ${page === 1 ? 'disable_prev' : ''}`}
                        >
                            Prev
                        </button>



                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className={`px-3 py-1 border rounded disabled:opacity-50 ${page === totalPages ? 'disable_next' : ''}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
