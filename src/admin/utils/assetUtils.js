export const getPublicAssetUrl = (assetId) => {
  if (!assetId) return null;
  const baseUrl = import.meta.env.VITE_API_URL || '';
  return `${baseUrl}/api/public/assets/${assetId}`;
};
