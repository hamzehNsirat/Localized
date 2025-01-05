import React, { createContext, useContext, useState } from 'react';

const RequestedProductsContext = createContext();

export const useRequestedProducts = () => useContext(RequestedProductsContext);

export const RequestedProductsProvider = ({ children }) => {
    const [requestedProducts, setRequestedProducts] = useState([]);

    return (
        <RequestedProductsContext.Provider value={{ requestedProducts, setRequestedProducts }}>
            {children}
        </RequestedProductsContext.Provider>
    );
};

