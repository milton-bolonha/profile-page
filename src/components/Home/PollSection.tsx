import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaPaperPlane } from 'react-icons/fa';

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

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
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

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto px-4 relative flex flex-col items-center justify-center pointer-events-auto"
        >

            {/* Ultra Minimal Glass Card */}
            <div className="relative w-full bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-black/50">

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
                            <h2 className="text-xl font-bold text-center text-white mb-1 tracking-tight">
                                O Que Você Quer Ver Mais?
                            </h2>
                            <p className="text-white/40 mb-6 text-xs uppercase tracking-widest font-mono">
                                Até 2 opções
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
                                {OPTIONS.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => toggleOption(opt)}
                                        className={`
                      relative px-3 py-1.5 rounded-lg border transition-all duration-200 text-xs font-medium
                      ${selectedOptions.includes(opt)
                                                ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                                                : 'bg-white/5 text-white/60 border-white/5 hover:border-white/20 hover:bg-white/10'}
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
                                    className="w-full py-2 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors"
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
                            <h3 className="text-lg font-bold text-white mb-2">Quer receber novidades?</h3>
                            <p className="text-white/40 mb-4 text-xs text-center px-4">Deixe seu email se quiser (Opcional).</p>

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
                            w-full px-4 py-2.5 rounded bg-white/5 border text-sm text-white outline-none transition-all
                            ${email && validateEmail(email)
                                                ? 'border-green-500/50'
                                                : 'border-white/10 focus:border-white/30'}
                        `}
                                    />
                                    <button
                                        type="submit" // Changed to type="submit"
                                        disabled={email ? !validateEmail(email) || isSubmitting : isSubmitting} // Disable if email is present and invalid, or if submitting
                                        className={`
                            absolute right-1 top-1 bottom-1 px-3 rounded text-xs font-bold transition-all flex items-center gap-2
                            ${email && validateEmail(email)
                                                ? 'bg-white text-black hover:bg-gray-200'
                                                : 'bg-transparent text-white/20 cursor-not-allowed'}
                        `}
                                    >
                                        {isSubmitting ? '...' : <FaPaperPlane />}
                                    </button>
                                </div>
                                {emailError && <p className="text-red-400 text-xs mt-2 ml-1">{emailError}</p>}

                                <button
                                    type="button"
                                    onClick={handleEmailSubmit} // Allow skip/submit empty if strictly optional? User logic implied submit.
                                    className="mt-4 text-xs text-white/30 hover:text-white/60 underline w-full text-center"
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
                                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            >
                                <FaCheck className="text-xl" />
                            </motion.div>
                            <h3 className="text-lg font-bold text-white">Recebido!</h3>
                            <p className="text-white/40 text-xs mt-1">Obrigado pelo feedback.</p>
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

