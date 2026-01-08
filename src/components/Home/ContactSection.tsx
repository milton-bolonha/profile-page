import { CopyButton } from '@/components/commons/CopyButton';
import React, { useState } from 'react';
import { Footer } from '@/components/commons/Footer';
import { FaDownload } from 'react-icons/fa';

export interface Contact {
  name: string;
  link: string;
  isMail?: boolean;
  isDownload?: boolean;
}

export interface ContactSectionProps {
  contacts: Contact[];
  title?: string;
  formTitle?: string;
}

export default function ContactSection({
  contacts,
  title = "Contatos",
  formTitle = "Envie uma Mensagem"
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_NETLIFY_FUNCTION_URL || '/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setFormData({
          name: '',
          email: '',
          message: '',
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Grid Pattern Restored */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_90%)] pointer-events-none" />

      <div className="flex-grow flex flex-col justify-center max-w-7xl mx-auto px-6 w-full py-24 relative z-10">
        <div className="text-center mb-12">
          {/* Added Badge */}
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide">Contato</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-semibold mb-4 text-white">
            {title}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Entre em contato, estou à disposição.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Links */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">Meus Links</h3>
            <ul className="space-y-4">
              {contacts.map(({ link, name, isMail, isDownload }, idx) => (
                <li
                  key={name + idx}
                  className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-2xl">
                    {isMail ? "📧" : isDownload ? <FaDownload /> : "🔗"}
                  </span>
                  <a
                    href={isMail ? `mailto:${link}` : link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white/80 transition-colors font-medium text-lg flex-1"
                    download={isDownload}
                  >
                    {name}
                  </a>
                  {isMail && <CopyButton textToCopy={link} />}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Form */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">{formTitle}</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                  Nome:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  placeholder="Seu Nome"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  placeholder="seu.email@exemplo.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                  Mensagem:
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/5 backdrop-blur-sm text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all resize-none"
                  placeholder="Sua mensagem..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
