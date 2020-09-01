import { shippingCost, discountPercentage, inventoryConfig } from "./config";

export function getCountry(countryName) {

}


export function passportValidation(passportNumber) {
    var regEx = "'fjevgrfvb";
    if (passportNumber.length == 12 || passportNumber.length == 13) {
        // some more logic to be implemented here
        return "GERMANY";
    }
    else {
        return false;
    }
}

export function findMinimalSolution(localInventoryQuantity, secondaryInventoryQuantity, orderDetailsObj, localInventory, secondaryInventory, itemType) {

    let transportCost = 0;

    // first localinventory
    let localInventorySalePrice = localInventoryQuantity * localInventory[itemType];
    // END

    // secondaryInventory
    if (orderDetailsObj.PassportNation && (secondaryInventory.inventoryLocation == orderDetailsObj.PassportNation)) {
        transportCost = Math.ceil((secondaryInventoryQuantity / 10)) * (shippingCost - ((discountPercentage / 100) * shippingCost));
    }
    else {
        transportCost = Math.ceil((secondaryInventoryQuantity / 10)) * shippingCost;
    }
    let secondInventorySalePrice = transportCost + (secondaryInventoryQuantity * secondaryInventory[itemType]);
    //  END
    let prepareFinalResultObject = {
        "totalSalePrice": localInventorySalePrice + secondInventorySalePrice
    }
    prepareFinalResultObject[localInventory.inventoryLocation] = (localInventory[itemType == "maskSalePrice" ? "masksQuantity" : "glovesQuantity"] - localInventoryQuantity);
    prepareFinalResultObject[secondaryInventory.inventoryLocation] = (secondaryInventory[itemType == "maskSalePrice" ? "masksQuantity" : "glovesQuantity"] - secondaryInventoryQuantity);
    return prepareFinalResultObject;
}


export function prepareAndSendFinalOutputToStdout(invoice) {
    console.log(("", invoice.masks.totalSalePrice + invoice.gloves.totalSalePrice), ':', invoice.masks.UK, ":", invoice.masks.GERMANY, ":", invoice.gloves.UK, ":", invoice.gloves.GERMANY)
}

export function prepareAndSendOutOfStockOutputToStdout() {
    console.log('OUT_OF_STOCK:', inventoryConfig['UK'].masksQuantity, ":", inventoryConfig['GERMANY'].masksQuantity, ":", inventoryConfig['UK'].glovesQuantity, ":", inventoryConfig['GERMANY'].glovesQuantity)
}