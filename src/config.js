// version     Date             type
// 1.0         Sep-02-2020     newly created

/**
 * Everything from inventory is globally defined. We can change them as per our requirement 
 * Dynamic configurations like transportCost,discountPercentage,Quantity and salePrice.
 */

exports.inventoryConfig = {
    UK: {
        inventoryLocation: "UK",
        masksQuantity: 100,
        maskSalePrice: 65,
        glovesQuantity: 100,
        glovesSalePrice: 100,
    },
    GERMANY: {
        inventoryLocation: "GERMANY",
        masksQuantity: 100,
        maskSalePrice: 100,
        glovesQuantity: 50,
        glovesSalePrice: 150,
    }
}

exports.transportCost = 400;
exports.discountPercentage = 20;
