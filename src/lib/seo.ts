export const SITE_URL = "https://sistema.appbus.online";
export const ROOT_URL = "https://appbus.online";

export const SEO_TITLE = "AppBus Online — Gestão Operacional para Transporte Urbano";

export const SEO_DESCRIPTION =
  "Plataforma operacional para gestão de frota, avarias, serviços terceirizados, motoristas, escalas, relatórios e indicadores estratégicos para empresas de transporte urbano.";

export const SEO_KEYWORDS = [
  "gestão de frota",
  "transporte urbano",
  "controle operacional",
  "manutenção de veículos",
  "serviços terceirizados",
  "escala operacional",
  "relatórios operacionais",
  "gestão de avarias",
  "indicadores de frota",
  "painel executivo",
].join(", ");

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AppBus Online",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description: SEO_DESCRIPTION,
  inLanguage: "pt-BR",
  isAccessibleForFree: false,
  creator: {
    "@type": "Organization",
    name: "AppBus Online",
    url: ROOT_URL,
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "BRL",
    availability: "https://schema.org/InStock",
  },
};
