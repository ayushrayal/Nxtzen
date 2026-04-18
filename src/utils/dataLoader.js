import shirts from '../data/shirts.json';
import jeans from '../data/jeans.json';
import tshirts from '../data/tshirts.json';

export const getAllProducts = () => {
  return [...shirts, ...jeans, ...tshirts];
};

export const getProductsByCategory = (category) => {
  // Can optimize if categories strictly match file names,
  // but a simple filter on the combined array is very robust.
  const all = getAllProducts();
  if (category === 'All') return all;
  return all.filter(p => p.category === category);
};

export const getProductById = (id) => {
  return getAllProducts().find(p => p.id === id);
};
