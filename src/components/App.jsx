import { useState, useEffect, useCallback } from 'react';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import Loader from './Loader/Loader';

import { searchImages } from '../services/pixabay-api';

export const App = () => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [fullSize, setFullSize] = useState('');
  const [tags, setTags] = useState('');
  const [total, setTotal] = useState(0);

  // componentDidUpdate(prevProps, prevState) {
  //   const { search, page } = this.state;
  //   if (prevState.search !== search || prevState.page !== page) {
  //     this.fetchPosts();
  //   }
  // }
  useEffect(() => {
    if (!search) {
      return;
    }

    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await searchImages(search, page);
        setItems(prevItems => [...prevItems, ...data.hits]);
        setTotal(data.totalHits);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [search, page, setLoading, setItems, setError]);

  const onSearchImages = query => {
    if (query.search !== search) {
      setSearch(query.search);
      setItems([]);
      setPage(1);
    }
  };

  const loadMore = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  const showImage = useCallback(data => {
    setFullSize(data);
    setTags(data);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setFullSize('');
  }, []);

  const totalPage = Math.ceil(total / 12);

  return (
    <>
      <Searchbar onSubmit={onSearchImages} />
      <ImageGallery items={items} showImage={showImage} />
      {error && <p>{error}</p>}
      {items.length > 0 && page < totalPage && !loading && (
        <Button loadMore={loadMore} />
      )}

      {loading && <Loader text="Loading..." />}

      {showModal && (
        <Modal close={closeModal}>
          <img src={fullSize} alt={tags} />
        </Modal>
      )}
    </>
  );
};
