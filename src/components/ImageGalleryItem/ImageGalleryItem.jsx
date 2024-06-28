import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../Modal/Modal';
import styles from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ image }) => {
  const { webformatURL, largeImageURL, tags } = image;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleGalleryPointerEvents = () => {
      const gallery = document.querySelector('.js-gallery');
      if (!gallery) return;

      gallery.style.pointerEvents = showModal ? 'none' : 'auto';
    };

    handleGalleryPointerEvents();

    // Cleanup function to reset pointer events on unmount or state change
    return () => {
      const gallery = document.querySelector('.js-gallery');
      if (gallery) {
        gallery.style.pointerEvents = 'auto';
      }
    };
  }, [showModal]);

  const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  return (
    <li className={styles.galleryItem} onClick={toggleModal}>
      <img src={webformatURL} alt={tags} />
      {showModal && (
        <Modal image={largeImageURL} tags={tags} onClose={toggleModal} />
      )}
    </li>
  );
};

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string,
  }).isRequired,
};

export default ImageGalleryItem;
