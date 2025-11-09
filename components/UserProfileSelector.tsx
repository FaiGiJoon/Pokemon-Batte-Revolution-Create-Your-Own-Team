import React from 'react';
import type { UserProfile } from '../types';

interface UserProfileSelectorProps {
    profiles: UserProfile[];
    activeProfileId: number | null;
    onSelectProfile: (id: number) => void;
}

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const UserProfileSelector: React.FC<UserProfileSelectorProps> = ({ profiles, activeProfileId, onSelectProfile }) => {

    const totalSlots = 4;
    const profileMap = new Map(profiles.map(p => [p.id, p]));

    return (
        <div className="bg-zinc-800 rounded-lg p-4 shadow-lg border border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-200 mb-4">User Profiles</h3>
            <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: totalSlots }).map((_, index) => {
                    const profileId = index + 1;
                    const profile = profileMap.get(profileId);
                    const isActive = activeProfileId === profileId;
                    
                    if (profile) {
                        return (
                            <button
                                key={profile.id}
                                onClick={() => onSelectProfile(profile.id)}
                                className={`p-3 rounded-lg text-left transition-all duration-200 border-2 ${isActive ? 'bg-accent-red/20 border-accent-red shadow-md' : 'bg-zinc-700 hover:bg-zinc-600 border-transparent'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-zinc-100">{profile.name}</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-accent-red text-white' : 'bg-zinc-600 text-zinc-300'}`}>
                                        {profile.team.length} / 6
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-400 mt-1">Click to view team</div>
                            </button>
                        );
                    }

                    return (
                        <div key={profileId} className="p-3 rounded-lg bg-zinc-700/50 border-2 border-dashed border-zinc-600 opacity-60">
                             <div className="flex items-center justify-between">
                                <span className="font-bold text-zinc-400">Trainer {profileId}</span>
                             </div>
                             <div className="text-sm text-zinc-500 mt-1">Empty Slot</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserProfileSelector;
