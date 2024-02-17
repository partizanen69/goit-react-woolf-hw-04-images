import axios from 'axios';
import { IMAGES_PER_PAGE } from '../components/App.consts';

const pixabayBaseUrl = 'https://pixabay.com/api/';
const apiKey = '40905594-bd576ff041a6f87471d33ae04';

export const fetchImages = async ({ searchKeyword, page = 1 }) => {
  const result = await axios.get(pixabayBaseUrl, {
    params: {
      ...(searchKeyword ? { q: searchKeyword } : null),
      page,
      key: apiKey,
      image_type: 'photo',
      orientation: 'horizontal',
      per_page: IMAGES_PER_PAGE,
    },
  });
  return { images: result.data.hits, totalImages: result.data.totalHits };
};
