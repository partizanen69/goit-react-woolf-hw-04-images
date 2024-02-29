import { useEffect } from 'react';
import { ImageModalStyled } from './ImageModal.styled';

export const ImageModal = ({ imgUrl, close }) => {
  useEffect(() => {
    const handlePressEscape = e => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('keydown', handlePressEscape);
    return () => {
      document.removeEventListener('keydown', handlePressEscape);
    };
  }, [close]);

  const handleClickOutside = e => {
    if (e.target.classList.contains('overlay')) {
      close();
    }
  };

  return (
    <ImageModalStyled className="overlay" onClick={handleClickOutside}>
      <div className="modal">
        <img src={imgUrl} alt="" />
      </div>
    </ImageModalStyled>
  );
};
