// Configuração Cloudinary
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const PLACEHOLD_FALLBACK =
  "https://placehold.co/800x600/EEE/31343C?font=open-sans&text=Portfolio";

export const normalizeImage = (
  url: string | undefined | null,
  label: string
) => {
  const safeLabel = encodeURIComponent(label || "Imagem");
  
  // Se não tem URL, usa placeholder com o nome e dimensão
  if (!url) {
    const text = `${safeLabel} (800x600)`;
    return `https://placehold.co/800x600/1a1a1a/666666?text=${text}&font=roboto`;
  }

  // Se vier placeholder padrão, troca para placehold.co com nome do produto
  if (/placeholder\.com/i.test(url)) {
    return `https://placehold.co/800x600/1a1a1a/666666?text=${safeLabel}&font=roboto`;
  }

  return url;
};

// Cloudinary Image Transformations
export interface CloudinaryTransformations {
  width?: number;
  height?: number;
  crop?: "fill" | "crop" | "scale" | "fit";
  quality?: number | "auto";
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  gravity?: "auto" | "face" | "center";
  radius?: number;
  effect?: string;
  opacity?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

export const buildCloudinaryUrl = (
  publicId: string,
  transformations: CloudinaryTransformations = {}
): string => {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity,
    radius,
    effect,
    opacity,
    brightness,
    contrast,
    saturation,
  } = transformations;

  let transformString = "";

  if (width) transformString += `w_${width},`;
  if (height) transformString += `h_${height},`;
  if (crop) transformString += `c_${crop},`;
  if (gravity) transformString += `g_${gravity},`;
  if (quality) transformString += `q_${quality},`;
  if (format) transformString += `f_${format},`;
  if (radius !== undefined) transformString += `r_${radius},`;
  if (effect) transformString += `e_${effect},`;
  if (opacity !== undefined) transformString += `o_${opacity},`;
  if (brightness !== undefined)
    transformString += `e_brightness:${brightness},`;
  if (contrast !== undefined) transformString += `e_contrast:${contrast},`;
  if (saturation !== undefined)
    transformString += `e_saturation:${saturation},`;

  // Remove trailing comma
  transformString = transformString.replace(/,$/, "");

  return `${CLOUDINARY_BASE_URL}/${transformString}/${publicId}`;
};

// Funções utilitárias para diferentes tipos de imagem
export const getOptimizedImage = (
  publicId: string,
  width?: number,
  height?: number
): string => {
  return buildCloudinaryUrl(publicId, {
    width,
    height,
    quality: "auto",
    format: "auto",
  });
};

export const getThumbnail = (publicId: string, size: number = 300): string => {
  return buildCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: "fill",
    quality: 80,
    format: "webp",
  });
};

export const getHeroImage = (publicId: string): string => {
  return buildCloudinaryUrl(publicId, {
    width: 1920,
    height: 1080,
    crop: "fill",
    quality: "auto",
    format: "auto",
  });
};

export const getBlurredPlaceholder = (
  publicId: string,
  size: number = 50
): string => {
  return buildCloudinaryUrl(publicId, {
    width: size,
    height: size,
    quality: 10,
    effect: "blur:1000",
  });
};

// Imagens geradas por IA via Cloudinary
export const getAIGeneratedImage = (
  prompt: string,
  options: Partial<CloudinaryTransformations> = {}
): string => {
  // Usar o prompt como public_id para imagens geradas por IA
  const safePrompt = prompt.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  return buildCloudinaryUrl(`ai/${safePrompt}`, {
    width: 800,
    height: 600,
    quality: "auto",
    format: "webp",
    ...options,
  });
};

// Imagens aleatórias (usando unsplash como fallback inteligente)
export const getRandomImage = (
  topic: string = "technology",
  width: number = 800,
  height: number = 600
): string => {
  // Tentar Cloudinary primeiro
  const safeTopic = topic.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  try {
    return buildCloudinaryUrl(`random/${safeTopic}_${Date.now()}`, {
      width,
      height,
      crop: "fill",
      quality: "auto",
      format: "webp",
    });
  } catch {
    // Fallback para unsplash
    return `https://source.unsplash.com/random/${width}x${height}?${topic}`;
  }
};

// Imagens por pasta/categoria
export const getImageByFolder = (
  folder: string,
  filename: string,
  transformations: CloudinaryTransformations = {}
): string => {
  const publicId = `${folder}/${filename}`;
  return buildCloudinaryUrl(publicId, transformations);
};

// Imagens locais (fallback para public/images)
export const getLocalImage = (
  path: string,
  transformations: CloudinaryTransformations = {}
): string => {
  // Se não temos Cloudinary configurado, usar imagens locais
  if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === "demo") {
    return `/${path}`;
  }

  // Tentar Cloudinary primeiro
  const publicId = `local/${path
    .replace(/\//g, "_")
    .replace(/\.(jpg|png|webp|jpeg)$/i, "")}`;
  return buildCloudinaryUrl(publicId, transformations);
};

// Efeitos especiais para imagens
export const applyImageEffect = (
  publicId: string,
  effect:
    | "blur"
    | "sepia"
    | "grayscale"
    | "brightness"
    | "contrast"
    | "saturation",
  intensity: number = 50
): string => {
  const effectMap = {
    blur: `blur:${intensity}`,
    sepia: `sepia`,
    grayscale: `grayscale`,
    brightness: `brightness:${intensity}`,
    contrast: `contrast:${intensity}`,
    saturation: `saturation:${intensity}`,
  };

  return buildCloudinaryUrl(publicId, {
    effect: effectMap[effect],
    quality: "auto",
    format: "webp",
  });
};

// Progressive image loading helper
export const getProgressiveImageSrc = (
  publicId: string,
  fullSize: number = 1920
) => {
  const placeholder = getBlurredPlaceholder(publicId, 50);
  const fullImage = getOptimizedImage(publicId, fullSize);

  return {
    placeholder,
    src: fullImage,
    blurDataURL: placeholder,
  };
};

//  explique como funciona o normalizeImage
//  o normalizeImage é uma função que normaliza a imagem para ser usada no projeto
//  ela recebe uma url e um label e retorna uma url segura para ser usada no projeto
//  ela verifica se a url é um placeholder e se é, retorna um placeholder com o nome do produto
//  se não for, retorna a url original
//  ela usa o encodeURIComponent para garantir que a url seja segura
//  ela usa o placehold.co para gerar um placeholder com o nome do produto
//  ela usa o open-sans para o font do placeholder
//  ela usa o EEE/31343C para o color do placeholder
//  ela usa o 800x600 para o tamanho do placeholder
//  ela usa o ?font=open-sans para o font do placeholder
//  ela usa o ?text= para o texto do placeholder
//  ela usa o ?text=${safeLabel} para o texto do placeholder
// como usar: exemplo de uso
// import { normalizeImage } from '@/lib/media';
// const url = normalizeImage('https://example.com/image.jpg', 'Product Name');
// console.log(url);  // https://placehold.co/800x600/EEE/31343C?font=open-sans&text=Product%20Name
// exemplo de uso:
// <Image src={normalizeImage(url, 'Product Name')} alt="Product Name" width={800} height={600} />
// exemplo de uso:

/*

ADICIONE INTEGRAÇÃO PARA CHAMAR IMAGENS DO CLOUDINARY, TANTO IMAGEMS Q JÁ EXISTEM, QNTO PARA PEDI PRA API DELES DAR UMA IMAGEM RANDOMICA, NÃO SEI SE É POSSIVEL

RESPOSTA DE INTERNET:
Cloudinary offers a powerful, free-for-life tier that provides an API for uploading, storing, transforming, and delivering high-quality images and videos. This service goes beyond simple image hosting, offering advanced features to create "nice photos" through automated processes and AI-powered transformations. 
Key Features of the Free Cloudinary API
Generous Free Plan: Cloudinary provides a free tier that is sufficient for personal projects or small applications. No credit card is required to sign up.
Image Transformations & Enhancements: You can programmatically apply various effects to your images on the fly by simply modifying the image URL or using SDKs. Features include:
Automatic resizing, cropping, and formatting (e.g., converting JPEG to WebP or AVIF).
AI-powered enhancements like image upscaling, background removal, object replacement, and color restoration for old photos.
Real-time filters, watermarking, and object-aware cropping.
Easy Integration: Cloudinary provides comprehensive APIs and SDKs for various programming languages and frameworks (JavaScript, React, Vue, PHP, etc.) for easy integration into your website or mobile application.
Optimized Delivery: All your assets are delivered through a fast Content Delivery Network (CDN), ensuring optimal performance and speed for users on different devices and network conditions


*/
