import { SignInButton } from "@clerk/nextjs";
import { useLanguage } from '@/contexts/LanguageContext';

export function CustomSignInButton() {
  const { t } = useLanguage();
  
  return (
    <SignInButton mode="modal">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {t('auth.signIn')}
      </button>
    </SignInButton>
  );
}
