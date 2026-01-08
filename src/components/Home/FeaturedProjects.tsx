import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import MagneticButton from "@/components/ui/MagneticButton";
import { TextMotion } from "@/components/ui/TextMotion";
import { useEffect, useRef, useState } from "react";
import { PostData } from "@/lib/posts";
import { FaRobot, FaGlobe, FaBook, FaGamepad, FaChalkboardTeacher, FaRocket, FaFilter } from "react-icons/fa";

interface FeaturedProjectsProps {
  posts: PostData[];
}

const CATEGORIES = [
  { id: "Todos", label: "Todos", icon: FaFilter },
  { id: "AI", label: "AI & SaaS", icon: FaRobot },
  { id: "WEB", label: "Web Services", icon: FaGlobe },
  { id: "GAME DEV", label: "Game Dev", icon: FaGamepad },
  { id: "BOOK", label: "Books", icon: FaBook },
  { id: "MENTORIA", label: "Mentoria", icon: FaChalkboardTeacher },
  { id: "ENTREPRENEUR", label: "Entrepreneur", icon: FaRocket },
];

export const FeaturedProjects = ({ posts }: FeaturedProjectsProps) => {
  const { t } = useLanguage();
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);

  // Filter posts logic
  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== "Todos") {
      filtered = posts.filter(post =>
        post.category?.toUpperCase() === selectedCategory
      );
    }

    // Sort by featured first, then date
    filtered = filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Limit to 6 items for the home page to keep it clean
    setFilteredPosts(filtered.slice(0, 6));
  }, [selectedCategory, posts]);

  useEffect(() => {
    import("vanilla-tilt").then((VanillaTilt) => {
      // Re-init tilt on filtered items
      tiltRefs.current.forEach((ref) => {
        if (ref) {
          VanillaTilt.default.init(ref, {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.1,
            scale: 1.02,
          });
        }
      });
    });

    return () => {
      tiltRefs.current.forEach((ref) => {
        if (ref && (ref as any).vanillaTilt) {
          (ref as any).vanillaTilt.destroy();
        }
      });
    };
  }, [filteredPosts]); // Re-run when posts change

  return (
    <div className="relative w-full h-full min-h-screen">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 pb-24">
        <div className="text-center mb-12">
          {/* Badge: Catálogo */}
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide">
              Catálogo de Soluções
            </span>
          </div>

          {/* Title */}
          <h2
            className="text-4xl md:text-5xl font-semibold text-white mb-6"
            style={{
              fontFamily: "Noto Serif Variable, serif",
              lineHeight: "1.3",
            }}
          >
            🚀{" "}
            <TextMotion trigger={true} stagger={0.05}>
              Explore e Construa
            </TextMotion>
          </h2>

          {/* Description */}
          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-10">
            De boilerplates de IA a mentorias de carreira, encontre a ferramenta certa para o seu próximo nível.
          </p>

          {/* CATEGORY TABS */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300
                    ${isActive
                      ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"}
                  `}
                >
                  {Icon && <Icon className={isActive ? "text-blue-600" : ""} />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/catalogo/${post.slug}`}
                onClick={() =>
                  trackEvent(
                    "click",
                    "Project Card",
                    `Project ${post.slug} - Home`
                  )
                }
                className="group relative block h-full flex flex-col"
              >
                <div
                  ref={(el) => {
                    if (el) {
                      tiltRefs.current[index] = el;
                    }
                  }}
                  className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Dynamic Background Gradient based on Category */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-500
                    ${post.category === 'AI' ? 'from-purple-900 to-indigo-900' :
                      post.category === 'WEB' ? 'from-blue-900 to-cyan-900' :
                        post.category === 'GAME DEV' ? 'from-pink-900 to-rose-900' :
                          post.category === 'MENTORIA' ? 'from-amber-900 to-orange-900' :
                            post.category === 'BOOK' ? 'from-emerald-900 to-teal-900' :
                              'from-gray-800 to-gray-900'}
                  `} />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-bold border border-white/20">
                      Ver Detalhes
                    </span>
                  </div>

                  {/* Icon/Visual Placeholder */}
                  <div className="text-6xl text-white/20 group-hover:text-white/40 transition-colors duration-500 transform group-hover:scale-110">
                    {post.category === 'AI' ? <FaRobot /> :
                      post.category === 'WEB' ? <FaGlobe /> :
                        post.category === 'GAME DEV' ? <FaGamepad /> :
                          post.category === 'MENTORIA' ? <FaChalkboardTeacher /> :
                            post.category === 'BOOK' ? <FaBook /> :
                              post.category === 'ENTREPRENEUR' ? <FaRocket /> :
                                <FaGlobe />}
                  </div>

                  {post.featured && (
                    <span className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/30 z-20 backdrop-blur-sm">
                      ⭐ Destaque
                    </span>
                  )}

                  {post.category && (
                    <span className="absolute top-4 left-4 bg-white/10 text-white/80 text-xs font-bold px-3 py-1 rounded-full border border-white/10 z-20 backdrop-blur-sm">
                      {post.category}
                    </span>
                  )}
                </div>

                <div className="mt-6 space-y-3 flex-1">
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm line-clamp-2">
                    {post.description || "Clique para ver mais detalhes sobre este projeto."}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-white/40">
              <p>Nenhum item encontrado nesta categoria.</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <MagneticButton>
            <Link
              href="/catalogo"
              onClick={() =>
                trackEvent("click", "CTA", "View All Items - Home")
              }
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 font-medium py-4 px-8 rounded-full transition-all duration-300"
            >
              Ver Catálogo Completo
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};
