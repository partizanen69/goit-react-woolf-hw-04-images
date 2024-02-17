import { Component } from 'react';
import { ImageModalStyled } from './ImageModal.styled';

export class ImageModal extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handlePressEscape);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handlePressEscape);
  }

  handlePressEscape = e => {
    if (e.key === 'Escape') {
      this.props.close();
    }
  };

  handleClickOutside = e => {
    if (e.target.classList.contains('overlay')) {
      this.props.close();
    }
  };

  render() {
    const { imgUrl } = this.props;

    return (
      <ImageModalStyled className="overlay" onClick={this.handleClickOutside}>
        <div className="modal">
          <img src={imgUrl} alt="" />
        </div>
      </ImageModalStyled>
    );
  }
}
