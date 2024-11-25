import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { updateProfile } from '../../lib/profile';
import { toast } from 'react-toastify';

const gameSchema = z.object({
  name: z.string().min(1, 'Game name is required'),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'pro']),
  hoursPlayed: z.number().min(0),
  rank: z.string().optional()
});

type GameFormData = z.infer<typeof gameSchema>;

interface AddGameModalProps {
  onClose: () => void;
}

export default function AddGameModal({ onClose }: AddGameModalProps) {
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GameFormData>({
    resolver: zodResolver(gameSchema)
  });

  const onSubmit = async (data: GameFormData) => {
    if (!user) return;

    try {
      const newGame = {
        id: crypto.randomUUID(),
        ...data
      };

      await updateProfile(user.id, {
        gamesPlayed: [...user.gamesPlayed, newGame]
      });

      toast.success('Game added successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to add game');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gaming-card rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-bold text-white">Add Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Game Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
              placeholder="Enter game name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-gaming-accent">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-300 mb-1">
              Skill Level
            </label>
            <select
              {...register('skillLevel')}
              className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
              <option value="pro">Pro</option>
            </select>
            {errors.skillLevel && (
              <p className="mt-1 text-sm text-gaming-accent">{errors.skillLevel.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="hoursPlayed" className="block text-sm font-medium text-gray-300 mb-1">
              Hours Played
            </label>
            <input
              {...register('hoursPlayed', { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
            />
            {errors.hoursPlayed && (
              <p className="mt-1 text-sm text-gaming-accent">{errors.hoursPlayed.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="rank" className="block text-sm font-medium text-gray-300 mb-1">
              Current Rank (optional)
            </label>
            <input
              {...register('rank')}
              type="text"
              className="w-full px-3 py-2 rounded-md bg-gaming-dark border border-gaming-neon/20 text-white focus:outline-none focus:border-gaming-neon"
              placeholder="Enter your current rank"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}