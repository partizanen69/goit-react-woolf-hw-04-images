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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchKeyword !== prevState.searchKeyword) {
      this.getImages();
    }
  }

  handleSubmit = searchKeyword => {
    if (searchKeyword === this.state.searchKeyword) {
      toast.warning(`You already see results by word: ${searchKeyword}`);
      return;
    }

    this.setState({
      searchKeyword,
      images: [],
      totalImages: 0,
      activeImageUrl: null,
    });
  };

  getImages = () => {
    const searchKeyword = this.state.searchKeyword;
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

  openImageModal = largeImageURL => {
    this.setState({ activeImageUrl: largeImageURL });
  };

  closeImgModal = () => {
    this.setState({ activeImageUrl: null });
  };

  render() {
    const { activeImageUrl, images, fetchInProgress, totalImages } = this.state;
    const isEnd = totalImages <= images.length;

    return (
      <AppStyled>
        <SearchBar
          onSubmit={this.handleSubmit}
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
