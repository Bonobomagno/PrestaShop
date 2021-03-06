/**
 * This script is based on the scenario described in this test link
 * [id="PS-385"][Name="Buttons in footer product page"]
 **/

const {AccessPageBO} = require('../../../selectors/BO/access_page');
const {AddProductPage} = require('../../../selectors/BO/add_product_page');
const {ProductList} = require('../../../selectors/BO/add_product_page');
const {CatalogPage} = require('../../../selectors/BO/catalogpage/index');
const {productPage} = require('../../../selectors/FO/product_page');
const {Menu} = require('../../../selectors/BO/menu.js');
const common_scenarios = require('../../common_scenarios/product');
let promise = Promise.resolve();
const welcomeScenarios = require('../../common_scenarios/welcome');

let firstProductData = {
  name: 'TEST PRODUCT',
  quantity: '10',
  price: '12',
  image_name: '1.png',
  reference: 'a'
};

scenario('Check product page buttons', () => {

  scenario('Login in the Back Office', client => {
    test('should open the browser', () => client.open());
    test('should login successfully in the Back Office', () => client.signInBO(AccessPageBO));
  }, 'product/product');
  welcomeScenarios.findAndCloseWelcomeModal();
  common_scenarios.createProduct(AddProductPage, firstProductData);

  scenario('Testing "Preview" button', client => {
    test('should click on "Preview" button', () => {
      return promise
        .then(() => client.waitForSymfonyToolbar(AddProductPage, 2000))
        .then(() => client.waitForExistAndClick(AddProductPage.preview_buttons));
    });
    test('should switch to the Front Office', () => client.switchWindow(1));
    common_scenarios.clickOnPreviewLink(client, AddProductPage.preview_link, productPage.product_name);
    test('should check that the product name is equal to "TEST PRODUCT' + date_time + '"', () => client.checkTextValue(productPage.product_name, firstProductData.name, "contain", 1000));
    test('should go to the Back Office', () => client.switchWindow(0));
  }, 'product/product');

  scenario('Testing "Duplicate" button', client => {
    test('should click on the "Duplicate" button', () => {
      return promise
        .then(() => client.waitForExistAndClick(AddProductPage.dropdown_button))
        .then(() => client.waitForExistAndClick(AddProductPage.duplicate_button));
    });
    test('should check the duplication success message', () => client.checkTextValue(AddProductPage.success_panel, "Product successfully duplicated."));
    test('should switch the product "online"', () => client.waitForExistAndClick(AddProductPage.product_online_toggle));
    test('should click on "SAVE" button', () => client.waitForExistAndClick(AddProductPage.save_product_button));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
    scenario('Check that the product is well duplicated', client => {
      test('should go to "Catalog" page', () => client.waitForExistAndClick(Menu.Sell.Catalog.products_submenu));
      test('should search for product by name', () => client.searchProductByName("copy of " + firstProductData.name + date_time));
      test('should check the existence of product name', () => client.checkTextValue(AddProductPage.catalog_product_name, "copy of " + firstProductData.name + date_time));
      test('should check the existence of product category', () => client.checkTextValue(AddProductPage.catalog_product_category, "Home"));
      test('should check the existence of product price TE', () => client.checkProductPriceTE(firstProductData.price));
      test('should check the existence of product quantity', () => client.checkTextValue(AddProductPage.catalog_product_quantity, '0'));
      test('should check the existence of product status', () => client.checkTextValue(AddProductPage.catalog_product_online, 'check'));
      test('should click on the product name', () => client.waitForExistAndClick(AddProductPage.catalog_product_name));
    }, 'product/check_product');
  }, 'product/product');

  scenario('Testing "Delete" button', () => {
    scenario('Check when clicking on "No" of the delete confirmation modal', client => {
      test('should click on "Delete" icon', () => client.waitForExistAndClick(AddProductPage.delete_button));
      test('should click on "No" of the confirmation modal', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'No'), 2000));
      test('should go to "Catalog - products" page', () => client.waitForVisibleAndClick(Menu.Sell.Catalog.products_submenu, 2000));
      test('should search for product by name', () => client.searchProductByName("copy of " + firstProductData.name + date_time));
      test('should click on the product name', () => client.waitForExistAndClick(AddProductPage.catalog_product_name));
    }, 'product/check_product');

    /**
     * This scenario is based on the bug described in this ticket
     * http://forge.prestashop.com/browse/BOOM-4950
     **/
    scenario('Check when clicking on "Yes" of the delete confirmation modal', client => {
      test('should click on "Delete" icon', () => client.waitForExistAndClick(AddProductPage.delete_button));
      test('should click on "Yes" of the confirmation modal', () => client.waitForVisibleAndClick(AddProductPage.delete_confirmation_button.replace('%BUTTON', 'Yes')));
      test('should verify the appearance of the green validation (BOOM-4950)', () => client.checkTextValue(AddProductPage.success_panel, "Product successfully deleted."));
      test('should click on "Reset" button', () => client.waitForExistAndClick(AddProductPage.catalog_reset_filter));
      scenario('Check that the duplicated product is deleted', client => {
        test('should search for product by name', () => client.searchProductByName("copy of " + firstProductData.name + date_time));
        test('should check that there is no result', () => client.checkTextValue(ProductList.search_no_results, 'There is no result for this search. Update your filters to view other products.'));
      }, 'product/check_product');
    }, 'product/check_product');
  }, 'product/product');

  scenario('Check "Go to catalog" button', client => {
    test('should search for product by name', () => client.searchProductByName(firstProductData.name + date_time));
    test('should click on the product name', () => client.waitForExistAndClick(AddProductPage.catalog_product_name));
    test('should click on "Go to catalog" button', () => {
      return promise
        .then(() => client.waitForExistAndClick(AddProductPage.dropdown_button))
        .then(() => client.waitForExistAndClick(AddProductPage.go_to_catalog_button));
    });
    test('should search for product by name', () => client.searchProductByName(firstProductData.name + date_time));
    test('should click on the product name', () => client.waitForExistAndClick(AddProductPage.catalog_product_name));
  }, 'product/check_product');

  scenario('Testing "Add new product" button', client => {
    test('should click on "Add new product" button', () => {
      return promise
        .then(() => client.waitForExistAndClick(AddProductPage.dropdown_button))
        .then(() => client.waitForExistAndClick(AddProductPage.new_product_dropdown_button))
        .then(() => client.pause(5000));
    });
    test('should check the placeholder of the product name', () => client.checkAttributeValue(AddProductPage.product_name_input, 'placeholder', 'Enter your product name'));
    test('should go to "Products" page', () => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.products_submenu));
    test('should search for product by name', () => client.searchProductByName(firstProductData.name + date_time));
    test('should click on the product name', () => client.waitForExistAndClick(AddProductPage.catalog_product_name));
  }, 'product/check_product');

  scenario('Testing "Online" button', client => {
    test('should set the product "Offline"', () => client.waitForExistAndClick(AddProductPage.product_online_toggle));
    test('should check that the success alert message is well displayed', () => client.waitForExistAndClick(AddProductPage.close_validation_button));
    test('should click on "Preview" button', () => client.waitForExistAndClick(AddProductPage.preview_buttons));
    test('should switch to the Preview page in the Front Office', () => client.switchWindow(2));
    test('should check the offline warning message', () => client.checkTextValue(productPage.offline_warning_message, "This product is not visible to your customers.", "contain"));
    test('should go back to the Back Office', () => client.switchWindow(0));
    test('should set the product "Online"', () => client.waitForExistAndClick(AddProductPage.product_online_toggle));
    test('should click on "Preview" button', () => client.waitForExistAndClick(AddProductPage.preview_buttons));
    test('should switch to the Preview page in the Front Office', () => client.switchWindow(3));
    test('should check the warning offline message does not appear', () => client.isNotExisting(productPage.offline_warning_message));
  }, 'product/product');
  scenario('Back to the default product "search"', client => {
    test('should go back to the Back office', () => client.switchWindow(0));
    test('should go to "Products" page', () => client.goToSubtabMenuPage(Menu.Sell.Catalog.catalog_menu, Menu.Sell.Catalog.products_submenu));
    test('should click on "Reset" button', () => client.waitForExistAndClick(CatalogPage.reset_button));
  }, 'product/product');

  scenario('Logout from the Back Office', client => {
    test('should logout successfully from Back Office', () => client.signOutBO());
  }, 'product/product');

}, 'product/product', true);