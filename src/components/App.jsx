import { useState, useEffect } from 'react';

import React, { Component } from 'react';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { getAPI } from 'pixabay-api';
import styles from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';

//
const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await getAPI(searchQuery, currentPage);
        const { totalHits, hits } = response;

        setImages(prevImages =>
          currentPage === 1 ? hits : [...prevImages, ...hits]
        );
        setIsEnd(prevImages => prevImages.length + hits.length >= totalHits);

        if (hits.length === 0) {
          toast.error("This didn't work.");
        }
      } catch (error) {
        setIsError(true);
        toast(`An error occurred while fetching data: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchQuery) {
      fetchImages();
    }
  }, [searchQuery, currentPage]);

  const handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();
    const normalizedCurrentQuery = searchQuery.toLowerCase();

    if (normalizedQuery === '') {
      toast('Hello Darkness!', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }

    if (normalizedQuery === normalizedCurrentQuery) {
      toast.success('Successfully toasted!');
      return;
    }

    if (normalizedQuery !== normalizedCurrentQuery) {
      setSearchQuery(normalizedQuery);
      setCurrentPage(1);
      setImages([]);
      setIsEnd(false);
    }
  };

  const handleLoadMore = () => {
    if (!isEnd) {
      setCurrentPage(prevPage => prevPage + 1);
    } else {
      alert("You've reached the end of the search results");
    }
  };

  return (
    <div className={styles.App}>
      <SearchBar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} />
      {isLoading && <Loader />}
      {!isLoading && !isError && images.length > 0 && !isEnd && (
        <Button onClick={handleLoadMore} />
      )}
      {isError && <p>Something went wrong. Please try again later.</p>}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
