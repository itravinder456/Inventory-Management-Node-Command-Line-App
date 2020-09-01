const inquirer = require('inquirer');
import { passportValidation, findMinimalSolution, prepareAndSendFinalOutputToStdout, prepareAndSendOutOfStockOutputToStdout } from './helpers';
import { inventoryConfig } from './config';


var questions = [{
    type: 'input',
    name: 'orderDetails',
    message: "Enter order details:",
}]

export function cli(args) {
    process_everything_from_here();
}

function process_everything_from_here() {

    inquirer.prompt(questions).then(answers => {

        let inputParameters = answers['orderDetails'];
        inputParameters = inputParameters.trim();
        let orderDetails = inputParameters.split(":");
        if (orderDetails.length < 5 || orderDetails.length > 6) {
            console.info("invalid number of parameters");
            return false;
        }


        let orderDetails_obj = {}

        let IsPasssportAvailbale = passportValidation(orderDetails[1]);
        if (!IsPasssportAvailbale) {
            orderDetails_obj.purchaseCountry = (orderDetails[0]).toUpperCase();
            orderDetails_obj[orderDetails[1].toLowerCase()] = orderDetails[2];
            orderDetails_obj[orderDetails[3].toLowerCase()] = orderDetails[4];
        }
        else {
            orderDetails_obj.purchaseCountry = (orderDetails[0]).toUpperCase();
            orderDetails_obj.PassportNation = IsPasssportAvailbale;
            orderDetails_obj[orderDetails[2].toLowerCase()] = orderDetails[3];
            orderDetails_obj[orderDetails[4].toLowerCase()] = orderDetails[5];
        }

        let localInventory = inventoryConfig[orderDetails_obj.purchaseCountry];
        let secondaryInventory;
        if (localInventory.inventoryLocation == "UK") {
            secondaryInventory = inventoryConfig['GERMANY'];
        }
        else {
            secondaryInventory = inventoryConfig['UK'];
        }


        // validate inventory stock
        if ((orderDetails_obj.masks > (localInventory.masksQuantity + secondaryInventory.masksQuantity)) || (orderDetails_obj.gloves > (localInventory.glovesQuantity + secondaryInventory.glovesQuantity))) {
            prepareAndSendOutOfStockOutputToStdout();
            return false;
        }
        // validate inventory stock END

        // masks

        let masksQuantityFromLocalInventory = secondaryInventory.masksQuantity - orderDetails_obj.masks;
        let conditionLoop = masksQuantityFromLocalInventory >= 0 ? orderDetails_obj.masks : localInventory.masksQuantity;
        masksQuantityFromLocalInventory = masksQuantityFromLocalInventory >= 0 ? 0 : -masksQuantityFromLocalInventory;
        let minimalCost = {};

        let maskSalePrice;
        minimalCost.masks = {};
        for (let index = masksQuantityFromLocalInventory; index <= conditionLoop; index++) {
            maskSalePrice = findMinimalSolution(index, (orderDetails_obj.masks - index), orderDetails_obj, localInventory, secondaryInventory, "maskSalePrice");
            if (index == masksQuantityFromLocalInventory) {
                minimalCost.masks = maskSalePrice;
            }
            if (maskSalePrice.totalSalePrice < minimalCost.masks.totalSalePrice) {
                minimalCost.masks = maskSalePrice;
            }

        }
        //  END

        // Gloves
        let glovesQuantityFromLocalInventory = secondaryInventory.glovesQuantity - orderDetails_obj.gloves;
        let conditionLoopGloves = glovesQuantityFromLocalInventory >= 0 ? orderDetails_obj.gloves : localInventory.glovesQuantity;
        glovesQuantityFromLocalInventory = glovesQuantityFromLocalInventory >= 0 ? 0 : -glovesQuantityFromLocalInventory;
        let glovesSalePrice;
        minimalCost.gloves = {}
        for (let index = glovesQuantityFromLocalInventory; index <= conditionLoopGloves; index++) {
            glovesSalePrice = findMinimalSolution(index, (orderDetails_obj.gloves - index), orderDetails_obj, localInventory, secondaryInventory, "glovesSalePrice");
            if (index == glovesQuantityFromLocalInventory) {
                minimalCost.gloves = glovesSalePrice;
            }
            if (glovesSalePrice.totalSalePrice < minimalCost.gloves.totalSalePrice) {
                minimalCost.gloves = glovesSalePrice;

            }
        }
        // END

        prepareAndSendFinalOutputToStdout(minimalCost);

    })

}