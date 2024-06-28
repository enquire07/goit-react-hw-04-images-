import React, { useState, useEffect } from 'react';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { getAPI } from 'pixabay-api';
import styles from './App.module.css';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await getAPI(searchQuery, currentPage);
        const { totalHits, hits } = response;

        setImages(prevImages =>
          currentPage === 1 ? hits : [...prevImages, ...hits]
        );
        setIsEnd(prevImages => prevImages.length + hits.length >= totalHits);
        setIsLoading(false);

        if (hits.length === 0) {
          toast.error("This didn't work.");
        }
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        toast.error(`An error occurred while fetching data: ${error}`);
      }
    };

    if (searchQuery !== '') {
      fetchData();
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
    }

    if (normalizedQuery === normalizedCurrentQuery) {
      toast.success('Successfully toasted!');
      return;
    }

    setSearchQuery(normalizedQuery);
    setCurrentPage(1);
    setImages([]);
    setIsEnd(false);
  };

  const handleLoadMore = () => {
    if (!isEnd) {
      setCurrentPage(prevPage => prevPage + 1);
    } else {
      alert("You've reached the end of the search results");
    }
  };

  // async componentDidUpdate(_prevProps, prevState) {
  //   const { searchQuery, currentPage } = this.state;

  //   if (
  //     prevState.searchQuery !== searchQuery ||
  //     prevState.currentPage !== currentPage
  //   ) {
  //     await this.fetchImages();
  //   }
  // }

  // fetchImages = async () => {
  //   this.setState({ isLoading: true, isError: false });

  //   const { searchQuery, currentPage } = this.state;

  //   try {
  //     const response = await getAPI(searchQuery, currentPage);
  //     console.log(response);
  //     const { totalHits, hits } = response;

  //     this.setState(prevState => ({
  //       images: currentPage === 1 ? hits : [...prevState.images, ...hits],
  //       isLoading: false,
  //       isEnd: prevState.images.length + hits.length >= totalHits,
  //     }));

  //     if (hits.length === 0) {
  //       toast.error("This didn't work.");
  //       return;
  //     }
  //   } catch (error) {
  //     this.setState({ isLoading: false, isError: true });
  //     toast(`An error occurred while fetching data: ${error}`);
  //   }
  // };

  // handleSearchSubmit = query => {
  //   const normalizedQuery = query.trim().toLowerCase();
  //   const normalizedCurrentQuery = this.state.searchQuery.toLowerCase();

  //   if (normalizedQuery === '') {
  //     toast('Hello Darkness!', {
  //       icon: '👏',
  //       style: {
  //         borderRadius: '10px',
  //         background: '#333',
  //         color: '#fff',
  //       },
  //     });
  //   }

  //   if (normalizedQuery === normalizedCurrentQuery) {
  //     toast.success('Successfully toasted!');

  //     return;
  //   }

  //   if (normalizedQuery !== normalizedCurrentQuery) {
  //     this.setState({
  //       searchQuery: normalizedQuery,
  //       currentPage: 1,
  //       images: [],
  //       isEnd: false,
  //     });
  //   }
  // };

  // handleLoadMore = () => {
  //   if (!this.state.isEnd) {
  //     this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
  //   } else {
  //   }
  // };

  // render() {
  //   const { images, isLoading, isError, isEnd } = this.state;
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
