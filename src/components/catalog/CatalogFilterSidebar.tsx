import { FaFilter } from 'react-icons/fa';

interface Category {
    id: string;
    label: string;
    icon: any;
}

interface CatalogFiltersProps {
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
}

export const CatalogFilterSidebar = ({
    categories,
    selectedCategory,
    onSelectCategory,
}: CatalogFiltersProps) => {
    return (
        <aside className="w-full">
            <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                    <FaFilter className="text-yellow-500" />
                    <h3 className="text-white font-bold text-lg tracking-wide">Filtros</h3>
                </div>

                <div className="space-y-2">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = selectedCategory === cat.id;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.id)}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left group cursor-pointer
                  ${isActive
                                        ? 'bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 font-bold shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                                        : 'bg-transparent border border-transparent text-gray-400 hover:bg-white/5 hover:text-white'}
                `}
                            >
                                {Icon && (
                                    <span className={`text-lg transition-colors ${isActive ? 'text-yellow-400' : 'text-gray-500 group-hover:text-white'}`}>
                                        <Icon />
                                    </span>
                                )}
                                <span className="flex-1">{cat.label}</span>

                                {isActive && (
                                    <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_5px_#eab308]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};
