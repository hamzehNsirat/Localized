import React, { createContext, useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppColors from '../Theme/AppColors';

const FavoriteContext = createContext();

export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const handleFavorite = (productName,productId) => {
        if (favorites.includes(productId)) {
            setFavorites(favorites.filter(id => id !== productId));
            console.log('removed from fav');
            toast(`${productName} removed from favorites!`, {
                progressStyle: { background: AppColors.primaryColor },
            });
        } else {
            setFavorites([...favorites, productId]);
            console.log('added to fav');
            toast(`${productName} added to favorites!`, {
                progressStyle: { background: AppColors.primaryColor },
            });
        }
    };

    return (
        <FavoriteContext.Provider value={{ favorites, handleFavorite }}>
            {children}
            <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} />
        </FavoriteContext.Provider>
    );
};
