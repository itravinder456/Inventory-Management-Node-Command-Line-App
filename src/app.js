// version     Date             type
// 1.0         Sep-02-2020     newly created

const inquirer = require('inquirer');
const helpers = require("./helpers");
var inventoryConfig = require('./config').inventoryConfig;


var questions = [{
    type: 'input',
    name: 'orderDetails',
    message: "Enter order details:",
}]
//directly calling the processing function from here. The function might kept outside but representational purpose did everything inside a function
process_everything_from_here();

function process_everything_from_here() {
    inquirer.prompt(questions).then(answers => {  // Command line arguments will be recieved from here
        try {

            let inputParameters = answers['orderDetails'];
            inputParameters = inputParameters.trim();
            let orderDetails = inputParameters.split(":");
            if (orderDetails.length < 5 || orderDetails.length > 6) {
                console.info("Invalid input.");
                return false;
            }


            let orderDetails_obj = {}

            let IsPassportAvailbale = helpers.passportValidation(orderDetails[1]);
            /**
             * If passport is not passed from input list then we will skip the passportnumber
             */
            if (!IsPassportAvailbale && orderDetails.length === 5) {
                orderDetails_obj.purchaseCountry = (orderDetails[0]).toUpperCase();
                orderDetails_obj[orderDetails[1].toLowerCase()] = Number(orderDetails[2]);
                orderDetails_obj[orderDetails[3].toLowerCase()] = Number(orderDetails[4]);
            }
            else {
                orderDetails_obj.purchaseCountry = (orderDetails[0]).toUpperCase();
                orderDetails_obj.PassportNation = IsPassportAvailbale;
                orderDetails_obj[orderDetails[2].toLowerCase()] = Number(orderDetails[3]);
                orderDetails_obj[orderDetails[4].toLowerCase()] = Number(orderDetails[5]);
            }

            if (!orderDetails_obj.purchaseCountry || !orderDetails_obj.mask || !orderDetails_obj.gloves) {
                console.info("Invalid input.");
                return false;
            }

            let localInventory = inventoryConfig[orderDetails_obj.purchaseCountry]; //get local inventory by the given purchase country
            let secondaryInventory;
            //get secondary(other country inventory) inventory by the localinventory
            if (localInventory.inventoryLocation == "UK") {
                secondaryInventory = inventoryConfig['GERMANY'];
            }
            else {
                secondaryInventory = inventoryConfig['UK'];
            }


            // validate inventory stock. if the order quantity exceeded the quantiity of sum of all inventories then return as "Out Of Stock" message.
            if ((orderDetails_obj.mask > (localInventory.masksQuantity + secondaryInventory.masksQuantity)) || (orderDetails_obj.gloves > (localInventory.glovesQuantity + secondaryInventory.glovesQuantity))) {
                helpers.prepareAndSendOutOfStockOutputToStdout();
                return false;
            }
            // validate inventory stock END


            // Find minimal price for mask ? START
            let masksQuantityFromLocalInventory = secondaryInventory.masksQuantity - orderDetails_obj.mask;
            let loopExitValueM = masksQuantityFromLocalInventory >= 0 ? orderDetails_obj.mask : localInventory.masksQuantity;
            masksQuantityFromLocalInventory = masksQuantityFromLocalInventory >= 0 ? 0 : -masksQuantityFromLocalInventory;
            let minimalCost = {};

            let maskSalePrice; // Intialize minimal masksSaleprice with empty
            minimalCost.mask = {};

            // iterate through each possible quantity from two inventories but the quantity from two inventories should be match to order quantity from user.
            for (let index = masksQuantityFromLocalInventory; index <= loopExitValueM; index++) { // START FOR

                maskSalePrice = helpers.findMinimalSolution(index, (orderDetails_obj.mask - index), orderDetails_obj, localInventory, secondaryInventory, "maskSalePrice");

                // Store the first possible minmal price
                if (index == masksQuantityFromLocalInventory) {
                    minimalCost.mask = maskSalePrice;
                }

                // compare current possibilty price to the previous minimal price.
                // If it was minimal then replace old minimal price with latest minimal value
                if (maskSalePrice.totalSalePrice < minimalCost.mask.totalSalePrice) {
                    minimalCost.mask = maskSalePrice;
                }

            } // END FOR
            // Find minimal price for mask ? END

            // Find minimal price for gloves ? START
            let glovesQuantityFromLocalInventory = secondaryInventory.glovesQuantity - orderDetails_obj.gloves;
            let loopExitValue = glovesQuantityFromLocalInventory >= 0 ? orderDetails_obj.gloves : localInventory.glovesQuantity;
            glovesQuantityFromLocalInventory = glovesQuantityFromLocalInventory >= 0 ? 0 : -glovesQuantityFromLocalInventory;

            let glovesSalePrice; // Intialize minimal glovesSaleprice with empty
            minimalCost.gloves = {}

            // iterate through each possible quantity from two inventories but the quantity from two inventories should be match to order quantity from user.
            for (let index = glovesQuantityFromLocalInventory; index <= loopExitValue; index++) { //START FOR

                glovesSalePrice = helpers.findMinimalSolution(index, (orderDetails_obj.gloves - index), orderDetails_obj, localInventory, secondaryInventory, "glovesSalePrice");

                // Store the first possible minmal price
                if (index == glovesQuantityFromLocalInventory) {
                    minimalCost.gloves = glovesSalePrice;
                }

                // compare current possibilty price to the previous minimal price.
                // If it was minimal then replace old minimal price with latest minimal value
                if (glovesSalePrice.totalSalePrice < minimalCost.gloves.totalSalePrice) {
                    minimalCost.gloves = glovesSalePrice;

                }
            } // END FOR
            // Find minimal price for gloves ? END

            // deliver final totoal price to the online user
            helpers.prepareAndSendFinalOutputToStdout(minimalCost);

        } catch (error) {
            console.info("Invalid input.");
        }
    })

}