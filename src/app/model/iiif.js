const IMAGE_PREFIX = 'https://iiif.rism.digital/image/dlib/CH_E_925_03/pyr_';
const IMAGE_SUFFIX = '.tif';

export const toImageUri = pageId => `${IMAGE_PREFIX}${pageId}${IMAGE_SUFFIX}`;

export const toPageId = imageUri => {
    if (!imageUri.startsWith(IMAGE_PREFIX) || !imageUri.endsWith(IMAGE_SUFFIX)) {
        return null;
    }

    return imageUri.slice(IMAGE_PREFIX.length, -IMAGE_SUFFIX.length);
};
