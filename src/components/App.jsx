import { useCallback, useEffect, useState } from 'react';
import { AppStyled } from './App.styled';
import { SearchBar } from './SearchBar/SearchBar';
import { fetchImages } from '../api/fetchImages';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { GalleryContainerStyled } from './GalleryContainer.styled';
import { ImageModal } from './Modal/ImageModal';
import { LoadMoreBtn } from './LoadMoreBtn/LoadMoreBtn';
import { IMAGES_PER_PAGE } from './App.consts';

export const App = () => {
  const [images, setImages] = useState([]);
  const [fetchInProgress, setFetchInProgress] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(null);
  const [isShowLoadMore, setIsShowLoadMore] = useState(false);

  useEffect(() => {
    if (searchKeyword === '' || currentPage === null) {
      return;
    }

    // пояснення цієї перевірки у catch
    // if (images.length === currentPage * IMAGES_PER_PAGE) {
    //   return;
    // }
    // але ця перевірка неможлива без вказування images.length у масиві залежностей
    // а вказування images.length у масиві залежностей взагалі робить неможливим виклик запиту у цьому useEffect

    const getImages = async () => {
      setFetchInProgress(true);

      try {
        const { images: newImages, totalImages } = await fetchImages({
          searchKeyword,
          page: currentPage,
        });

        if (newImages.length === 0) {
          toast.warning('There is no images matching your request');
          return;
        }

        setImages(prevImages => [...prevImages, ...newImages]);
        setIsShowLoadMore(currentPage * IMAGES_PER_PAGE < totalImages);
      } catch (err) {
        console.error(err);
        toast.error(`Request failed with error: ${err.message}`);
        // оскільки у нас виникла помилка, то поточний currentPage вже не валідний і його треба відкотити назад
        // якщо його не відкотити, подальщі натискання на load more "розірвуть" дані з бекенда
        // теоретично треба зробити щось таке
        // setCurrentPage(prevCurrentPage =>
        //   prevCurrentPage === 1 ? null : prevCurrentPage - 1
        // );
        // але це спричиняє необхідність додаткової перевірки на вході в useEffect, яка по суті неможлива (дивись закоментовану перевірку)

        // а ще, у разі помилки, треба скинути searchKeyword до попереднього
        // і тут вже починається повний бардак

        // висновок, використання useEffect для цього запиту, робить неможливим нормальну обробку помилки
        // якщо її не хендлити так як я написав вище, дані з бекенду розірвуться, тобто у них будуть дірки, наприклад юзер буде бачити картикни 1-12 а потім 24-36
        // і так далі
        // юзеру залишається тільки робити refresh сторінки що є дуже поганим UX як мені видається

        // але є ще один варіант - можна виключити лінтер на рядок масиву залежностей :)
        // і тоді і useEffect можна буде використовувати помилку нормально обробляти

        // простіше, не використовувати useEffect а робити запит у event handler
      } finally {
        setFetchInProgress(false);
      }
    };

    getImages();
  }, [searchKeyword, currentPage]);

  const handleSubmit = newSearchKeyword => {
    if (newSearchKeyword === searchKeyword) {
      toast.warning(`You already see results by word: ${newSearchKeyword}`);
      return;
    }

    if (newSearchKeyword === '') {
      toast.error('Please enter search keyword');
      return;
    }

    setImages([]);
    setCurrentPage(1);
    setActiveImageUrl(null);
    setSearchKeyword(newSearchKeyword);
  };

  const openImageModal = largeImageURL => {
    setActiveImageUrl(largeImageURL);
  };

  const closeImgModal = useCallback(() => {
    setActiveImageUrl(null);
  }, []);

  return (
    <AppStyled>
      <SearchBar onSubmit={handleSubmit} submitDisabled={fetchInProgress} />

      <GalleryContainerStyled>
        {images.length > 0 && (
          <ImageGallery images={images} openImageModal={openImageModal} />
        )}
        {images.length === 0 && fetchInProgress && (
          <div style={{ height: '100%' }}>
            <Loader />
          </div>
        )}

        {images.length > 0 && isShowLoadMore && (
          <LoadMoreBtn
            onClick={() => setCurrentPage(prevCurPage => prevCurPage + 1)}
            isLoading={fetchInProgress}
          />
        )}
      </GalleryContainerStyled>

      {activeImageUrl && (
        <ImageModal imgUrl={activeImageUrl} close={closeImgModal} />
      )}
      <ToastContainer />
    </AppStyled>
  );
};
