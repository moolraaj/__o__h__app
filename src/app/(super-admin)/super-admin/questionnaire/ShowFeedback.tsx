 
import { Questionnaire } from '@/utils/Types';
import React, { useState } from 'react';
import { FaCommentAlt } from 'react-icons/fa';

export const FeedbackButton = ({ el }:{el:Questionnaire}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="feedback-container">
    
      <button 
        className="feedback-btn"
        onClick={() => setShowFeedback(!showFeedback)}
      >
        <FaCommentAlt /> View Feedback
      </button>

     
      {showFeedback && (
        <div className="feedback-popup">
          <div className="popup-content">
            <button 
              className="close-btn"
              onClick={() => setShowFeedback(false)}
            >
              ×
            </button>

            <div className="feedback_model_wrapper">
               
                <h1 className='feedback_heading_main'>{el.case_number?el.case_number:'Not Found'}<span>Questionary feedback given by {el.assignTo ? el.assignTo?.name : 'Not found'}</span></h1>
              
 
            </div>
            
            <ul className='feedback_by_admin'>
              {el.questionary_type && (
                <li>
                  Questionary Type: <span>{el.questionary_type}</span>
                </li>
              )}
              
              {el.diagnosis_notes && (
                <li>
                  Diagnosis Notes: <span>{el.diagnosis_notes}</span>
                </li>
              )}
              
              {el.recomanded_actions && (
                <li>
                  Recomanded Actions: <span>{el.recomanded_actions}</span>
                </li>
              )}
              
              {el.comments_or_notes && (
                <li>
                  Comments or Notes: <span>{el.comments_or_notes}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
