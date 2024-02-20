import { ImageGalleryItemStyled } from './ImageGalleryItem.styled';

export const ImageGalleryItem = ({ img, openImageModal }) => {
  const { webformatURL, tags, largeImageURL } = img;

  return (
    <ImageGalleryItemStyled>
      <img
        src={webformatURL}
        alt={tags}
        onClick={() => openImageModal(largeImageURL)}
      />
    </ImageGalleryItemStyled>
  );
};
