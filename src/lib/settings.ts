// Smart settings loader that works both server-side and client-side
// Uses fs on server, fallback data on client

const isServer = typeof window === 'undefined';

let serverSettings: any = null;

// Dynamically import server settings only on server-side
if (isServer) {
  try {
    const fs = require('fs');
    const path = require('path');
    const settingsDirectory = path.join(process.cwd(), 'content', 'settings');

    serverSettings = {
      getSeoSettings: () => {
        const fullPath = path.join(settingsDirectory, 'seo.json');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      },
      getBusinessSettings: () => {
        const fullPath = path.join(settingsDirectory, 'business.json');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      },
      getGeneralSettings: () => {
        const fullPath = path.join(settingsDirectory, 'general.json');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      },
      getLinkTreeData: () => {
        const fullPath = path.join(settingsDirectory, 'linkTree.json');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      },
      getMainMenuData: () => {
        const fullPath = path.join(settingsDirectory, 'mainMenu.json');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      },
      getThemeSettings: () => {
        const fullPath = path.join(settingsDirectory, 'theme.json');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      },
      getLogosData: () => {
        const fullPath = path.join(settingsDirectory, 'logos.json');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      },
      getNavigatorSettings: () => {
        const fullPath = path.join(settingsDirectory, 'navegador.json');
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      },
      getCategoriesSettings: (lang: string = 'pt') => {
        const fileName = lang === 'en' ? 'categories.json' : 'categorias.json';
        const fullPath = path.join(settingsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents);
      }
    };
  } catch (error) {
    console.error('Error loading server settings:', error);
  }
}

// Client-side fallback data
const clientSettings = {
  getSeoSettings: () => ({
    title: "Portfolio",
    description: "Professional Portfolio",
    keywords: ["portfolio", "web developer"]
  }),
  getBusinessSettings: () => ({
    brandName: "Milton Bolonha",
    brandEmail: "miltonbolonha@gmail.com",
    brandPhone: "+55 43 99157-5781"
  }),
  getGeneralSettings: () => ({
    siteName: "Portfolio",
    siteUrl: ""
  }),
  getLinkTreeData: () => ({
    linkTree: [
      {
        href: "https://linkedin.com/in/miltonbolonha",
        label: "LinkedIn",
        icon: "FaLinkedin"
      },
      {
        href: "https://github.com/milton-bolonha",
        label: "GitHub",
        icon: "FaGithub"
      }
    ]
  }),
  getMainMenuData: () => ({
    items: [
      { label: "Home", href: "/" },
      { label: "About", href: "/sobre" },
      { label: "Projects", href: "/projetos" },
      { label: "Contact", href: "/contato" }
    ]
  }),
  getThemeSettings: () => ({
    primaryColor: "#3b82f6",
    darkMode: true
  }),
  getLogosData: () => ({
    main: "/logo.png",
    alt: "Logo"
  }),
  getCategoriesSettings: () => ({
    categories: [
      { id: "AI", label: "AI & SaaS", icon: "FaRobot", description: "Intelligent AI solutions" },
      { id: "WEB", label: "Web Services", icon: "FaGlobe", description: "High-performance web development" },
      { id: "GAME DEV", label: "Game Dev", icon: "FaGamepad", description: "Games and 3D experiences" }
      // { id: "BOOK", label: "Books", icon: "FaBook", description: "Technical books" },
      // { id: "MENTORIA", label: "Mentoring", icon: "FaChalkboardTeacher", description: "Developer mentoring" },
      // { id: "ENTREPRENEUR", label: "Entrepreneur", icon: "FaRocket", description: "Entrepreneurial projects" }
    ]
  })
};

// Export functions that route to appropriate implementation
const settings = isServer && serverSettings ? serverSettings : clientSettings;

export const getSeoSettings = settings.getSeoSettings;
export const getBusinessSettings = settings.getBusinessSettings;
export const getGeneralSettings = settings.getGeneralSettings;
export const getLinkTreeData = settings.getLinkTreeData;
export const getMainMenuData = settings.getMainMenuData;
export const getMainMenu = settings.getMainMenuData;
export const getThemeSettings = settings.getThemeSettings;
export const getLogosData = settings.getLogosData;
export const getLogos = settings.getLogosData;
export const getNavigatorSettings = settings.getNavigatorSettings;
export const getCategoriesSettings = settings.getCategoriesSettings;
