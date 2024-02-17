import { Component } from 'react';
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

export class App extends Component {
  state = {
    images: [],
    fetchInProgress: false,
    activeImageUrl: null,
    searchKeyword: '',
    totalImages: 0,
  };

  handleSearchChange = () => {
    if (this.state.images.length === 0) {
      return;
    }
    this.setState({ images: [] });
  };

  handleSubmit = searchKeyword => {
    this.setState({ searchKeyword }, () => {
      this.getImages();
    });
  };

  getImages = () => {
    const { searchKeyword } = this.state;
    this.setState({ fetchInProgress: true });

    const page = Math.floor(this.state.images.length / IMAGES_PER_PAGE) + 1;
    console.log({ searchKeyword, page });
    fetchImages({ searchKeyword, page })
      .then(({ images, totalImages }) => {
        if (images.length === 0) {
          toast.warning('There is no images matching your request');
          return;
        }

        this.setState(prevState => ({
          images: [...prevState.images, ...images],
          totalImages,
        }));
      })
      .catch(err => {
        console.error(err);
        toast.error(`Request failed with error: ${err.message}`);
      })
      .finally(() => {
        this.setState({ fetchInProgress: false });
      });
  };

  openImageModal = imgId => {
    const { largeImageURL } = this.state.images.find(img => img.id === imgId);
    this.setState({ activeImageUrl: largeImageURL });
  };

  closeImgModal = () => {
    this.setState({ activeImageUrl: null });
  };

  render() {
    const { activeImageUrl, images, fetchInProgress, totalImages } = this.state;
    const isEnd = images.length + IMAGES_PER_PAGE > totalImages;

    return (
      <AppStyled>
        <SearchBar
          onSubmit={this.handleSubmit}
          onChange={this.handleSearchChange}
          submitDisabled={fetchInProgress}
        />

        <GalleryContainerStyled>
          {images.length > 0 && (
            <ImageGallery
              images={images}
              openImageModal={this.openImageModal}
            />
          )}
          {images.length === 0 && fetchInProgress && (
            <div style={{ height: '100%' }}>
              <Loader />
            </div>
          )}

          {images.length > 0 && !isEnd && (
            <LoadMoreBtn onClick={this.getImages} isLoading={fetchInProgress} />
          )}
        </GalleryContainerStyled>

        {activeImageUrl && (
          <ImageModal imgUrl={activeImageUrl} close={this.closeImgModal} />
        )}
        <ToastContainer />
      </AppStyled>
    );
  }
}
