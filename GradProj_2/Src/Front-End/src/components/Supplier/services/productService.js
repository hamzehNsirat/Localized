import { productsData } from '../models/ProductData';

export const filterProducts = (searchTerm) => {
  return productsData.filter((product) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return (
      product.title.toLowerCase().includes(lowerCaseTerm) ||
      product.company.toLowerCase().includes(lowerCaseTerm)
    );
  });
};