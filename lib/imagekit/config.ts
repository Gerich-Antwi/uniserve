export const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
};

// Helper function to get optimized image URL
export function getImageKitUrl(path: string, transformations?: string) {
  const baseUrl = imagekitConfig.urlEndpoint;
  if (transformations) {
    return `${baseUrl}/tr:${transformations}/${path}`;
  }
  return `${baseUrl}/${path}`;
}

// Example: getImageKitUrl('announcement-banner.jpg', 'w-400,h-300,fo-auto')