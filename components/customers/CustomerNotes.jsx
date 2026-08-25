import React from 'react';
import { Edit2, Trash2, FileText, Lock } from 'lucide-react';

export const CustomerNotes = ({ notes, onAddNote, onEditNote, onDeleteNote }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-text">
          <FileText className="w-5 h-5 text-primary" />
          Private Notes
          <div className="w-5 h-5 rounded-full bg-surface flex items-center justify-center" title="Private - Only visible to you">
             <Lock className="w-3 h-3 text-text/40" />
          </div>
        </div>
        <button 
          onClick={onAddNote}
          className="text-sm font-medium text-primary hover:text-secondary transition-colors"
        >
          + Add Note
        </button>
      </div>

      {(!notes || notes.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-60">
          <FileText className="w-8 h-8 text-text/30 mb-3" />
          <p className="text-sm text-text/70">No notes added yet.</p>
          <p className="text-xs text-text/40 mt-1 max-w-[200px]">Keep track of customer preferences, allergies, or special requests here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
          {notes.map((note) => (
            <div key={note.id} className="bg-surface/50 p-4 rounded-2xl relative group border border-border/50 hover:border-primary/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-text/50">
                  {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEditNote(note)} className="p-1.5 text-text/40 hover:text-primary rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDeleteNote(note.id)} className="p-1.5 text-text/40 hover:text-danger rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text/80 whitespace-pre-wrap">{note.note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
