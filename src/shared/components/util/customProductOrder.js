// Utility to filter and sort products according to the custom order used in WarehouseStatusList.js

const customOrder = [  1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 9, 14 ];

/**
 * Filters out product with id 13 and sorts the list according to the custom order.
 * @param {Array} products - Array of product objects with at least an 'id' or 'product_id' property.
 * @returns {Array} - Filtered and sorted array.
 */
export function filterAndSortProducts(products) {
  if (!Array.isArray(products)) return [];
  // Support both 'id' and 'product_id' keys
  return products
    .filter(
      (item) => (item.id !== 13 && item.product_id !== 13)
    )
    .sort((a, b) => {
      const aId = a.id !== undefined ? a.id : a.product_id;
      const bId = b.id !== undefined ? b.id : b.product_id;
      return customOrder.indexOf(aId) - customOrder.indexOf(bId);
    });
}

export { customOrder }; 