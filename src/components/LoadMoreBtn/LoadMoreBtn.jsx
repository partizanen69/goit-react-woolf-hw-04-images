import { Loader } from '../Loader/Loader';
import { LoadMoreBtnStyled } from './LoadMoreBtnStyled';

export const LoadMoreBtn = ({ onClick, isLoading }) => {
  return (
    <LoadMoreBtnStyled>
      {isLoading ? <Loader /> : <button onClick={onClick}>Load more</button>}
    </LoadMoreBtnStyled>
  );
};
