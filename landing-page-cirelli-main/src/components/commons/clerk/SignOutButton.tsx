import { SignOutButton } from "@clerk/nextjs";
import { useLanguage } from '@/contexts/LanguageContext';

export function CustomSignOutButton() {
  const { t } = useLanguage();
  
  return (
    <SignOutButton>
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        {t('auth.signOut')}
      </button>
    </SignOutButton>
  );
}
