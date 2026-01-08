export const CATEGORY_GRADIENTS: Record<string, string> = {
    'AI': 'from-purple-900/50 to-indigo-900/50',
    'WEB': 'from-blue-900/50 to-cyan-900/50',
    'GAME DEV': 'from-rose-900/50 to-pink-900/50',
    'MENTORIA': 'from-amber-900/50 to-orange-900/50',
    'BOOK': 'from-emerald-900/50 to-teal-900/50',
    'ENTREPRENEUR': 'from-fuchsia-900/50 to-purple-900/50',
    'DEFAULT': 'from-gray-900 to-black'
};

export const getCategoryGradient = (category?: string) => {
    return CATEGORY_GRADIENTS[category?.toUpperCase() || ''] || CATEGORY_GRADIENTS['DEFAULT'];
};

export const getCategoryColor = (catId?: string) => {
    switch (catId) {
        case 'AI': return 'border-cyan-500/50 text-cyan-400 bg-cyan-950/30';
        case 'WEB': return 'border-blue-500/50 text-blue-400 bg-blue-950/30';
        case 'GAME DEV': return 'border-purple-500/50 text-purple-400 bg-purple-950/30';
        case 'BOOK': return 'border-yellow-500/50 text-yellow-400 bg-yellow-950/30';
        case 'MENTORIA': return 'border-green-500/50 text-green-400 bg-green-950/30';
        default: return 'border-white/20 text-white/80 bg-black/50';
    }
};
