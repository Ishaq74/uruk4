import React, { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportData: { targetId: string; targetType: string; reason: string; comment: string }) => void;
  targetId: string;
  targetType: string;
}

const reportReasons = [
  'Spam ou contenu publicitaire',
  'Contenu inapproprié ou offensant',
  'Fausses informations',
  'Violation de droits d\'auteur',
  'Autre (préciser)',
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, targetId, targetType }) => {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      alert('Veuillez sélectionner une raison.');
      return;
    }
    onSubmit({ targetId, targetType, reason, comment });
    setReason('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Signaler un contenu</h2>
          <p className="text-sm text-gray-500">Aidez-nous à maintenir une communauté sûre et respectueuse.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Raison du signalement</label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
            >
              <option value="">-- Choisissez une raison --</option>
              {reportReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Commentaire (facultatif)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="Fournissez plus de détails si nécessaire..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300"
              disabled={!reason}
            >
              Envoyer le signalement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
