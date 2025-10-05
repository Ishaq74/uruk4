
import React, { useState } from 'react';
import StarRating from './StarRating';
import { Profile } from '../types';

interface ReviewFormProps {
  currentUser: Profile;
  onSubmit: (rating: number, comment: string) => void;
}

const StarInput: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                    aria-label={`Noter ${star} étoiles`}
                >
                    <svg className={`w-8 h-8 transition-colors ${(hoverRating || rating) >= star ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
};


const ReviewForm: React.FC<ReviewFormProps> = ({ currentUser, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0 || comment.trim() === '') return;
        onSubmit(rating, comment);
        setRating(0);
        setComment('');
    };

    return (
        <div className="mt-8 border-t pt-8">
            <div className="flex items-start space-x-4">
                <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-12 h-12 rounded-full" />
                <form onSubmit={handleSubmit} className="flex-1">
                    <h4 className="font-bold text-gray-800">Laissez votre avis, {currentUser.fullName.split(' ')[0]}</h4>
                    <div className="my-2">
                        <StarInput rating={rating} setRating={setRating} />
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Partagez votre expérience..."
                        className="w-full h-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:outline-none transition-shadow"
                        rows={3}
                    />
                    <div className="mt-2 text-right">
                        <button
                            type="submit"
                            disabled={rating === 0 || comment.trim() === ''}
                            className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
                        >
                            Publier l'avis
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
