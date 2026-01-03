import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaPaperPlane } from 'react-icons/fa';
import { SquareAd } from '../commons/SquareAd'; // Import SquareAd

const OPTIONS = [
    'Freelancer (Contratar)',
    'Freelancer (Aprender)',
    'IA',
    'Desenvolvimento Web',
    'Game Dev',
    'Mentoria',
    'Outros'
];

export const PollSection = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [email, setEmail] = useState('');
    const [otherText, setOtherText] = useState('');
    const [step, setStep] = useState<'options' | 'email' | 'success'>('options');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // New State for fallback Ad
    const [showSquareAd, setShowSquareAd] = useState(false);

    useEffect(() => {
        const hasInteracted = localStorage.getItem('hasInteractedWithPoll');
        if (!hasInteracted) {
            // If NOT interacted, show Poll (delayed)
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            // If already interacted, show SquareAd
            setShowSquareAd(true);
        }
    }, []);

    const toggleOption = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(prev => prev.filter(o => o !== option));
        } else {
            if (selectedOptions.length < 2) {
                setSelectedOptions(prev => [...prev, option]);
            }
        }
    };

    const handleOptionSubmit = () => {
        if (selectedOptions.length > 0) {
            setStep('email');
        }
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && !validateEmail(email)) {
            setEmailError('Email inválido');
            return;
        }

        setIsSubmitting(true);

        // Construct data
        const finalOptions = selectedOptions.map(o => o === 'Outros' ? `Outros: ${otherText}` : o).join(', ');

        try {
            await fetch('/__forms.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'form-name': 'poll-feedback',
                    'interests': finalOptions,
                    'email': email
                }).toString()
            });
            setStep('success');
        } catch (err) {
            console.error("Poll error", err);
            setEmailError('Erro ao enviar. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setStep('options');
        setSelectedOptions([]);
        setEmail('');
        setOtherText('');
        setIsVisible(true);
    };

    useEffect(() => {
        if (step === 'success') {
            localStorage.setItem('hasInteractedWithPoll', 'true');
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000); // Auto close after 3s
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Render SquareAd if poll already interacted
    if (showSquareAd) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <SquareAd />
            </div>
        );
    }

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto px-4 relative flex flex-col items-center justify-center pointer-events-auto"
        >

            {/* Ultra Minimal Glass Card - Light Theme for Black Text */}
            <div className="relative w-full bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-6 overflow-hidden transition-all duration-300">

                <AnimatePresence mode="wait">

                    {/* STEP 1: OPTIONS */}
                    {step === 'options' && (
                        <motion.div
                            key="options"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center"
                        >
                            <h2 className="text-sm font-bold text-center text-black mb-1 tracking-tight" style={{ fontFamily: '"Inter Variable", sans-serif', fontSize: '20px', lineHeight: '1.2' }}>
                                O Que Você Quer Ver Mais?
                            </h2>
                            <p className="text-gray-500 mb-6 text-[10px] uppercase tracking-widest font-mono">
                                Até 2 opções
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
                                {OPTIONS.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => toggleOption(opt)}
                                        className={`
                      relative px-3 py-1.5 rounded-lg border transition-all duration-200 text-xs font-bold cursor-pointer
                      ${selectedOptions.includes(opt)
                                                ? 'bg-black text-white border-black shadow-md'
                                                : 'bg-gray-200 text-gray-600 border-gray-200 hover:bg-gray-300 hover:text-black'}
                    `}
                                    >
                                        {opt}
                                        {selectedOptions.includes(opt) && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white text-black rounded-full flex items-center justify-center text-[8px] font-bold">
                                                <FaCheck />
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {selectedOptions.includes('Outros') && (
                                <input
                                    type="text"
                                    placeholder="Outros..."
                                    value={otherText}
                                    onChange={(e) => setOtherText(e.target.value)}
                                    className="mb-4 w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                                    autoFocus
                                />
                            )}

                            {selectedOptions.length > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleOptionSubmit}
                                    className="w-full py-2 bg-black text-white text-sm font-bold rounded hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                    Continuar
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 2: EMAIL */}
                    {step === 'email' && (
                        <motion.div
                            key="email"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                            className="flex flex-col items-center w-full"
                        >
                            <h3 className="text-sm font-bold text-black mb-2 font-sans">Quer receber novidades?</h3>
                            <p className="text-gray-500 mb-4 text-[10px] text-center px-4">Deixe seu email se quiser (Opcional).</p>

                            <form
                                onSubmit={handleEmailSubmit}
                                className="w-full relative"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (validateEmail(e.target.value)) setEmailError('');
                                        }}
                                        placeholder="seu@email.com"
                                        className={`
                            w-full px-4 py-2.5 rounded bg-gray-50 border text-sm text-black outline-none transition-all placeholder-gray-400
                            ${email && validateEmail(email)
                                                ? 'border-green-500/50'
                                                : 'border-gray-200 focus:border-gray-400'}
                        `}
                                    />
                                    <button
                                        type="submit" // Changed to type="submit"
                                        disabled={email ? !validateEmail(email) || isSubmitting : isSubmitting} // Disable if email is present and invalid, or if submitting
                                        className={`
                            absolute right-1 top-1 bottom-1 px-3 rounded text-xs font-bold transition-all flex items-center gap-2 cursor-pointer
                            ${email && validateEmail(email)
                                                ? 'bg-black text-white hover:bg-gray-800'
                                                : 'bg-transparent text-gray-400 cursor-not-allowed'}
                        `}
                                    >
                                        {isSubmitting ? '...' : <FaPaperPlane />}
                                    </button>
                                </div>
                                {emailError && <p className="text-red-400 text-xs mt-2 ml-1">{emailError}</p>}

                                <button
                                    type="button"
                                    onClick={handleEmailSubmit} // Allow skip/submit empty if strictly optional? User logic implied submit.
                                    className="mt-4 text-xs text-gray-400 hover:text-black underline w-full text-center cursor-pointer transition-colors"
                                >
                                    Enviar sem email
                                </button>
                            </form>

                        </motion.div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-4"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-3 shadow-lg"
                            >
                                <FaCheck className="text-xl" />
                            </motion.div>
                            <h3 className="text-lg font-bold text-black font-sans">Recebido!</h3>
                            <p className="text-gray-500 text-xs mt-1">Obrigado pelo feedback.</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Hidden Netlify Form */}
            <form name="poll-feedback" data-netlify="true" hidden>
                <input type="text" name="interests" />
                <input type="email" name="email" />
            </form>
        </motion.div>
    );
};


