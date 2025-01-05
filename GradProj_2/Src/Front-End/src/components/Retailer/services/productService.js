import { productsData } from '../models/ProductData';
import { categories } from '../../Models/Categories';

export const filterProducts = (searchTerm, filters, favorites) => {
    const isCategoryFilterActive = categories.some(category => filters[category.name]);
    
    return productsData.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filters.favorites || favorites.includes(product.id)) &&
        (!isCategoryFilterActive || categories.some(category => filters[category.name] && product.category === category.name))
    );
};

export const filterProductsByCompany = (company) => {
    return productsData.filter(product => product.company === company);
};
