import React, { useState } from 'react';
import { Edit2, Trash2, Building2 } from 'lucide-react';
import { ReviewReplyForm } from './ReviewReplyForm';

export const ReplyCard = ({ reply, cafeName, onUpdate, onDelete, isUpdating }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/20">
         <h4 className="font-semibold text-primary mb-4">Edit Your Reply</h4>
         <ReviewReplyForm 
           defaultValues={{ reply: reply.text }} 
           onSubmit={(data) => {
             onUpdate(data);
             setIsEditing(false);
           }}
           onCancel={() => setIsEditing(false)}
           isSubmitting={isUpdating}
         />
      </div>
    );
  }

  return (
    <div className="bg-primary/5 p-6 md:p-8 rounded-3xl border border-primary/20 relative group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-text">Response from {cafeName || 'Owner'}</h4>
            <span className="text-xs text-text/50">{new Date(reply.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-text/50 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Edit Reply"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-text/50 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
            title="Delete Reply"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-text/80 text-sm leading-relaxed whitespace-pre-wrap pl-13 md:pl-[52px]">
        {reply.text}
      </p>
    </div>
  );
};
