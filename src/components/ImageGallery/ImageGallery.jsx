import { ImagGalleryStyled } from './ImageGallery.styled';
import { ImageGalleryItem } from './ImageGalleryItem/ImageGalleryItem';

export const ImageGallery = ({ images, openImageModal }) => {
  return (
    <ImagGalleryStyled>
      {images.map(img => (
        <ImageGalleryItem
          key={img.id}
          img={img}
          openImageModal={openImageModal}
        />
      ))}
    </ImagGalleryStyled>
  );
};
