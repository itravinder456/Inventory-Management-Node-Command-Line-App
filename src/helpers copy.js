import { inventoryConfig, shippingCost, discountPercentage } from "./config";

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

export function getFirstMinimalPrice(orderDetails) {
    let localInventory = inventoryConfig[orderDetails['purchaseCountry']];
    let maskSalePrice = 0;
    let totalMaskSalePrice = 0;
    let totalGlovesSalePrice = 0;
    let secondaryMasksInventory;
    let secondaryGlovesInventory;

    let minimalCostQuantity = {
        "UK": 0,
        "GERMANY": 0,
        "totalSalePrice": 0
    };



    if (orderDetails.masks <= localInventory.masksQuantity) {
        totalMaskSalePrice = orderDetails.masks * localInventory.maskSalePrice;
        minimalCostQuantity[localInventory.inventoryLocation] += orderDetails.masks;
    }
    else {
        let quentityToSubtractFromAnotherInventory = orderDetails.masks - localInventory.masksQuantity;
        let masksTransportCost = 0;


        if (localInventory.inventoryLocation == "UK") {
            secondaryMasksInventory = inventoryConfig['GERMANY'];
        }
        else {
            secondaryMasksInventory = inventoryConfig['UK'];
        }
        minimalCostQuantity[secondaryMasksInventory.inventoryLocation] += quentityToSubtractFromAnotherInventory;
        if (orderDetails.PassportNation && (secondaryMasksInventory.inventoryLocation == orderDetails.PassportNation)) {
            masksTransportCost = Math.ceil((quentityToSubtractFromAnotherInventory / 10)) * (shippingCost - ((discountPercentage / 100) * shippingCost));
        }
        else {
            masksTransportCost = Math.ceil((quentityToSubtractFromAnotherInventory / 10)) * shippingCost;
        }

        maskSalePrice = quentityToSubtractFromAnotherInventory * secondaryMasksInventory.maskSalePrice;
        totalMaskSalePrice = maskSalePrice + masksTransportCost + (localInventory.masksQuantity * localInventory.maskSalePrice);
    }

    if (orderDetails.gloves <= localInventory.glovesQuantity) {
        totalGlovesSalePrice = orderDetails.gloves * localInventory.glovesSalePrice;
        minimalCostQuantity[localInventory.inventoryLocation] += orderDetails.gloves;
    }
    else {
        let quentityToSubtractFromAnotherInventory = orderDetails.gloves - localInventory.glovesQuantity;

        let glovesTransportCost = 0;


        if (localInventory.inventoryLocation == "UK") {
            secondaryGlovesInventory = inventoryConfig['GERMANY'];
        }
        else {
            secondaryGlovesInventory = inventoryConfig['UK'];
        }
        minimalCostQuantity[secondaryGlovesInventory.inventoryLocation] += quentityToSubtractFromAnotherInventory;

        if (orderDetails.PassportNation && (secondaryGlovesInventory.inventoryLocation == orderDetails.PassportNation)) {
            glovesTransportCost = Math.ceil((quentityToSubtractFromAnotherInventory / 10)) * (shippingCost - ((discountPercentage / 100) * shippingCost));
        }
        else {
            glovesTransportCost = Math.ceil((quentityToSubtractFromAnotherInventory / 10)) * shippingCost;
        }
        totalGlovesSalePrice = (quentityToSubtractFromAnotherInventory * secondaryGlovesInventory.glovesSalePrice) + glovesTransportCost + (localInventory.glovesQuantity * localInventory.glovesSalePrice);
    }

    minimalCostQuantity['totalSalePrice'] = totalMaskSalePrice + totalGlovesSalePrice;
    return [totalMaskSalePrice, totalGlovesSalePrice, minimalCostQuantity];

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
    console.log((invoice.masks.totalSalePrice + invoice.gloves.totalSalePrice), ':', invoice.masks.UK, ":", invoice.masks.GERMANY, ":", invoice.gloves.UK, ":", invoice.gloves.GERMANY)
}