import { useCallback, useState } from 'react';

export const useModal = (initialState = false) => {
  const [isModalOpen, setModalOpen] = useState(initialState);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const openModal = useCallback(() => setModalOpen(true), []);
  const toggleModal = useCallback(() => setModalOpen((prev) => !prev), []);

  return { isModalOpen, openModal, closeModal, toggleModal };
};
