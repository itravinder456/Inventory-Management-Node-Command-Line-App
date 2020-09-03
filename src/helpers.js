// version     Date             type
// 1.0         Sep-02-2020     newly created

const inventoryConfig = require("./config").inventoryConfig;
const discountPercentage = require("./config").discountPercentage;
const transportCost = require("./config").transportCost;



/**
 * 
 * @param {User Passport Number} passportNumber 
 * @function checks with the passport number and validate whether it is valida or not then return country name which it is belongs to
 * @returns {country name} UK/GERMANY
 */
const passportValidation = function (passportNumber) {
    let ukPassportNumberRegex = /^[B]+([0-9]{3})+([A-z]{2})(\w{7})$/; // Manual Rgular Expression for UK Passport Number
    let GermanyPassportNumberRegex = /^[A]+([A-z ]{2})+(\w{9})$/; // Manual Rgular Expression for GERMANY Passport Number

    if (ukPassportNumberRegex.test(passportNumber)) {
        return "UK";
    }
    else if (GermanyPassportNumberRegex.test(passportNumber)) {
        return "GERMANY";
    }
    else {
        return false;
    }
}
/**
 * 
 * @param {Quantity of the items to purchase from country inventory} localInventoryQuantity 
 * @param {Quantity of the items to purchase from other country inventory} secondaryInventoryQuantity 
 * @param {Input order details {mask,gloves,purchase country,passport number if applicable}} orderDetailsObj 
 * @param {inventory of purchase country} localInventory 
 * @param {inventory from the other country} secondaryInventory 
 * @param {Masks or gloves} itemType 
 * @returns {total salePrice for selected quantity from both inventories}
 */
const findMinimalSolution = function (localInventoryQuantity, secondaryInventoryQuantity, orderDetailsObj, localInventory, secondaryInventory, itemType) {

    let totalTransportCost = 0;

    // first localinventory
    let localInventorySalePrice = localInventoryQuantity * localInventory[itemType];
    // END

    // secondaryInventory
    /**
     * if passsport is belongs to the targeted/secondary inventory then transport cost will be reduced by 205 for every 10 same item types.
     */
    if (orderDetailsObj.PassportNation && (secondaryInventory.inventoryLocation == orderDetailsObj.PassportNation)) {
        totalTransportCost = Math.ceil((secondaryInventoryQuantity / 10)) * (transportCost - ((discountPercentage / 100) * transportCost));
    }
    else {
        totalTransportCost = Math.ceil((secondaryInventoryQuantity / 10)) * transportCost;
    }
    let secondInventorySalePrice = totalTransportCost + (secondaryInventoryQuantity * secondaryInventory[itemType]);
    //  END
    let prepareFinalResultObject = {
        "totalSalePrice": localInventorySalePrice + secondInventorySalePrice
    }
    prepareFinalResultObject[localInventory.inventoryLocation] = (localInventory[itemType == "maskSalePrice" ? "masksQuantity" : "glovesQuantity"] - localInventoryQuantity);
    prepareFinalResultObject[secondaryInventory.inventoryLocation] = (secondaryInventory[itemType == "maskSalePrice" ? "masksQuantity" : "glovesQuantity"] - secondaryInventoryQuantity);
    return prepareFinalResultObject;
}

/**
 * 
 * @param {final order invoice with minimal sale price} invoice 
 */
const prepareAndSendFinalOutputToStdout = function (invoice) {
    console.log(("", invoice.mask.totalSalePrice + invoice.gloves.totalSalePrice), ':', invoice.mask.UK, ":", invoice.mask.GERMANY, ":", invoice.gloves.UK, ":", invoice.gloves.GERMANY)
}

/**
 * std error when user ordered quantity exceeded the the inventory quantity of both countries.
 */
const prepareAndSendOutOfStockOutputToStdout = function () {
    console.log('OUT_OF_STOCK:', inventoryConfig['UK'].masksQuantity, ":", inventoryConfig['GERMANY'].masksQuantity, ":", inventoryConfig['UK'].glovesQuantity, ":", inventoryConfig['GERMANY'].glovesQuantity)
}

module.exports = { passportValidation, findMinimalSolution, prepareAndSendFinalOutputToStdout, prepareAndSendOutOfStockOutputToStdout };