import { useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [galleryImages, setGalleryImages] = useState<string[]>(images);

    const handleImageError = (index: number) => {
        const newImages = [...galleryImages];
        // Use a consistent placeholder fallback
        const titleSafe = encodeURIComponent(title || 'Imagem');
        newImages[index] = `https://placehold.co/800x600/1a1a1a/666666?text=${titleSafe}&font=roboto`;
        setGalleryImages(newImages);
    };

    const openGallery = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeGallery = () => {
        setIsOpen(false);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
    };

    // Keyboard navigation
    if (typeof window !== 'undefined') {
        window.addEventListener('keydown', handleKeyDown as any);
    }

    return (
        <>
            {/* Gallery Grid */}
            <div className="space-y-4">
                <div className="relative group cursor-pointer" onClick={() => openGallery(0)}>
                    <div className="aspect-video relative rounded-xl overflow-hidden">
                        <Image
                            src={galleryImages[0]}
                            alt={`${title} - Imagem principal`}
                            fill
                            className="object-cover"
                            onError={() => handleImageError(0)}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                                Clique para abrir galeria
                            </span>
                        </div>
                    </div>
                </div>

                {galleryImages.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                        {galleryImages.slice(1, 4).map((img, idx) => (
                            <div
                                key={idx}
                                className="aspect-square relative rounded-lg overflow-hidden cursor-pointer hover:border-white/30 transition-colors"
                                onClick={() => openGallery(idx + 1)}
                            >
                                <Image
                                    src={img}
                                    alt={`${title} - Imagem ${idx + 2}`}
                                    fill
                                    className="object-cover"
                                    onError={() => handleImageError(idx + 1)}
                                />
                                {idx === 2 && galleryImages.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">+{galleryImages.length - 4}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Carousel Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center"
                        onClick={closeGallery}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeGallery}
                            className="absolute top-6 right-6 z-10 text-white/80 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                        >
                            <FaTimes size={24} />
                        </button>

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToPrevious();
                                    }}
                                    className="absolute left-6 z-10 text-white/80 hover:text-white p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                                >
                                    <FaChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToNext();
                                    }}
                                    className="absolute right-6 z-10 text-white/80 hover:text-white p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                                >
                                    <FaChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Main Image */}
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full max-w-6xl max-h-[80vh] mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={galleryImages[currentIndex]}
                                alt={`${title} - Imagem ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                                onError={() => handleImageError(currentIndex)}
                            />
                        </motion.div>

                        {/* Thumbnail Navigation */}
                        {images.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-md p-3 rounded-full">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentIndex(idx);
                                        }}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-white scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            width={64}
                                            height={64}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Counter */}
                        <div className="absolute top-6 left-6 text-white/80 text-sm font-medium bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
