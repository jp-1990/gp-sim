import sharp from 'sharp';

/**
 * Formats the incomming image stream to webp, and applies the following resize:
 * {
 *   width: 400,
 *   height: 400,
 *   fit: 'contain',
 *   background: { r: 0, g: 0, b: 0, alpha: 0 },
     withoutEnlargement: true
 * }
 *
 * Intended to be used to save profile images
 * 
 * @returns A configured sharp instance which can be used as part of a node pipeline
 */
export const defaultUserImageTransform = () => {
  return sharp()
    .resize({
      width: 400,
      height: 400,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      withoutEnlargement: true
    })
    .toFormat('webp');
};
