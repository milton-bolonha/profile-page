// Client-safe settings - provides fallback data for client-side rendering
// The actual data should be passed from server-side via props when possible

export function getSeoSettings() {
  return {
    title: "Portfolio",
    description: "Professional Portfolio",
    keywords: ["portfolio", "web developer"]
  };
}

export function getBusinessSettings() {
  return {
    brandName: "Guilherme Cirelli Lopes",
    brandEmail: "guilopes.030206@gmail.com",
    brandPhone: "+55 43 99157-5781"
  };
}

export function getGeneralSettings() {
  return {
    siteName: "Portfolio",
    siteUrl: ""
  };
}

export function getLinkTreeData() {
  return {
    linkTree: [
      {
        href: "https://linkedin.com",
        label: "LinkedIn",
        icon: "FaLinkedin"
      },
      {
        href: "https://github.com",
        label: "GitHub",
        icon: "FaGithub"
      }
    ]
  };
}

export function getMainMenuData() {
  return {
    items: [
      { label: "Home", href: "/" },
      { label: "About", href: "/sobre" },
      { label: "Projects", href: "/projetos" },
      { label: "Contact", href: "/contato" }
    ]
  };
}

export function getMainMenu() {
  return getMainMenuData();
}

export function getThemeSettings() {
  return {
    primaryColor: "#3b82f6",
    darkMode: true
  };
}

export function getLogosData() {
  return {
    main: "/logo.png",
    alt: "Logo"
  };
}

export function getLogos() {
  return getLogosData();
}
