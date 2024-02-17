import { Oval } from 'react-loader-spinner';
import { LoaderStyled } from './Loader.styled';

export const Loader = () => {
  return (
    <LoaderStyled>
      <Oval
        visible={true}
        height="80"
        width="80"
        color="#3f51b5"
        secondaryColor={null}
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </LoaderStyled>
  );
};
