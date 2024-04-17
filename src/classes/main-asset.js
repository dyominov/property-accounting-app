/**
 * @link   https://github.com/NazarK0
 * @file   This file define the MainAsset class.
 * @author Nazar Vanivsky.
 * @since  0.0.1
 */

/** jshint undef: true, unused: true, strict: true */
/**
 * MainAsset Class.
 *
 * @since      0.0.1
 * @access     public
 *
 * @constructs MainAsset
 * @augments   none
 */
export default class MainAsset {
  /**
  * title property.
  * 
  * @since  0.0.1
  * @access private
  * @type     {string}
  * @memberof MainAsset
  */
  #title;
  /**
  * group to which belongs main asset property, store id from database.
  *
  * @since  0.0.1
  * @access private
  * @type     {string}
  * @memberof MainAsset
  */
  #group;
  /**
  * inventory number of main asset property.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof MainAsset
  */
  #inventoryNumber;
  /**
  * serial number of main asset property.
  *
  * @since  0.0.1
  * @access private
  * @type     {string}
  * @memberof MainAsset
  */
  #serialNumber;
  /**
  * category of main asset property, store id from database.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof MainAsset
  */
  #category;
  /**
  * unit of measurement of main asset property, store id from database.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof MainAsset
  */
  #integer;
  /**
  * cost of main asset property.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof MainAsset
  */
  #cost;
  /**
  * amount of wear and tear property, calculate by formula.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof MainAsset
  */
  #aowat;
  /**
  * date of manufacture of main asset property.
  *
  * @since  0.0.1
  * @access private
  * @type     {date}
  * @memberof MainAsset
  */
  #dateOfManufacture;
  /**
  * date of start operation of main asset property.
  *
  * @since  0.0.1
  * @access private
  * @type     {date}
  * @memberof MainAsset
  */
  #dateOfStartOperation;


  constructor() {
    this.#title = '';
    this.#group = null;
    this.#inventoryNumber = '';
    this.#serialNumber = '',
    this.#category = null;
    this.#integer = null;
    this.#cost = '';
    this.#aowat = Math.random() * 100;
    this.#dateOfManufacture = null;
    this.#dateOfStartOperation = new Date().toISOString();
  }

  /**
   * get/set title of main asset.
   *
   * @since  0.0.1
   * @access public
   * @type     {string}
   * @memberof MainAsset
   */
  set title(title) {
    this.#title = title;
  }

  /**
   * get/set group id to which belongs main asset.
   *
   * @since  0.0.1
   * @access public
   * @type     {number}
   * @memberof MainAsset
   */
  set group(group) {
    this.#group = group;
  }

  /**
   * get/set inventory number of main asset.
   *
   * @since  0.0.1
   * @access public
   * @type     {string}
   * @memberof MainAsset
   */
  set inventoryNumber(num) {
    this.#inventoryNumber = num;
  }

  /**
   * get/set serial number of main asset.
   *
   * @since  0.0.1
   * @access public
   * @type     {string}
   * @memberof MainAsset
 */
  set serialNumber(num) {
    this.#serialNumber = num;
  }

  /**
   * get/set category id of main asset.
   *
   * @since  0.0.1
   * @access public
   * @type     {number}
   * @memberof MainAsset
   */
  set category(category) {
    this.#category = category;
  }

  /**
   * get/set unit of measurement id of main asset.
   *
   * @since  0.0.1
   * @access public
   * @type     {number}
   * @memberof MainAsset
   */
  set integer(integer) {
    this.#integer = integer;
  }

  /**
   * get/set cost of main asset.
   *
   * @since  0.0.1
   * @access public
   * @type     {number}
   * @memberof MainAsset
 */
  set cost(cost) {
    const numb = cost.match(/[0-9]+[\.,]?[0-9]*/g);

    if (numb) {
      this.#cost = numb[0].replace(',', '.');
    } else {
      this.#cost = '';
    }
  }

  /**
  * get/set date of manufacture of main asset.
  *
  * @since  0.0.1
  * @access public
  * @type     {date}
  * @memberof MainAsset
  */
  set dateOfManufacture(date) {
    this.#dateOfManufacture = date;
  }

  /**
  * get/set date of start operation of main asset.
  *
  * @since  0.0.1
  * @access public
  * @type     {date}
  * @memberof MainAsset
  */
  set dateOfStartOperation(date) {
    this.#dateOfStartOperation = date;
  }

  get title() {
    return this.#title;
  }

  get group() {
    return this.#group;
  }

  get inventoryNumber() {
    return this.#inventoryNumber;
  }

  get serialNumber() {
    return this.#serialNumber;
  }

  get category() {
    return this.#category;
  }

  get integer() {
    return this.#integer;
  }

  get cost() {
    return this.#cost;
  }

  get aowat() {
    return this.#aowat;
  }

  get dateOfManufacture() {
    return this.#dateOfManufacture;
  }

  get dateOfStartOperation() {
    return this.#dateOfStartOperation;
  }

  /**
   * MainAsset to object.
   *
   * Convert MainAsset class instance to plain javascript object.
   *
   * @since      0.0.1
   * @access     public
   * @class    MainAsset
   * @return {object} Return object with fields that represent main asset.
   */
  toPOJO() {
    return {
      title: this.title,
      group: this.group,
      inventoryNumber: this.inventoryNumber,
      serialNumber: this.serialNumber,
      category: this.category,
      integer: this.integer,
      cost: this.cost,
      aowat: this.aowat,
      dateOfManufacture: this.dateOfManufacture,
      dateOfStartOperation: this.dateOfStartOperation,
    };
  }

  /**
  * MainAsset to string.
  *
  * Convert MainAsset class instance to JSON string.
  *
  * @since      0.0.1
  * @access     public
  * @class    MainAsset
  * @return {string} Return JSON string with data that represent main asset.
*/
  toString() {
    return JSON.stringify(this.toPOJO());
  }

  /**
   * MainAsset from object.
   *
   * Convert plain javascript object to MainAsset class instance.
   *
   * @since      0.0.1
   * @access     public
   * @class    MainAsset
   * @param  {object} obj plain javascript object
   * @return {MainAsset} Return MainAsset class instance.
   */
  static fromPOJO(obj) {
    const newObj = new MainAsset();

    const isObjValidMainAsset = obj.hasOwnProperty('title') &&
      obj.hasOwnProperty('group') &&
      obj.hasOwnProperty('inventoryNumber') &&
      obj.hasOwnProperty('serialNumber') &&
      obj.hasOwnProperty('category') &&
      obj.hasOwnProperty('integer') &&
      obj.hasOwnProperty('cost') &&
      obj.hasOwnProperty('dateOfManufacture') &&
      obj.hasOwnProperty('dateOfStartOperation');

    if (isObjValidMainAsset) {
      newObj.title = obj.title;
      newObj.group = obj.group;
      newObj.inventoryNumber = obj.inventoryNumber;
      newObj.serialNumber = obj.serialNumber;
      newObj.category = obj.category;
      newObj.integer = obj.integer;
      newObj.cost = obj.cost;
      newObj.dateOfManufacture = obj.dateOfManufacture;
      newObj.dateOfStartOperation = obj.dateOfStartOperation;

      return newObj;
    } else {
      throw new Error('POJO is not valid MainAsset instance');
    }
  }

  /**
   * MainAsset from JSON string.
   *
   * Convert JSON string to MainAsset class instance.
   *
   * @since      0.0.1
   * @access     public
   * @class    MainAsset
   * @param  {string} str Stringifyied JSON
   * @return {MainAsset} Return MainAsset class instance.
   */
  static fromString(str) {
    if (!str) return new MainAsset();

    const obj = JSON.parse(str);
    return MainAsset.fromPOJO(obj);
  }

  /**
   * Check string or object there are represent MainAsset.
   *
   * @since      0.0.1
   * @access     public
   * @class    MainAsset
   * @param  {(string | object)} data Stringifyied JSON or object
   * @return {boolean} Return validation of data is represent MainAsset class instance.
   */
  static isMainAsset(data) {
    if (typeof data === 'string') {
      try {
        return MainAsset.fromString(data) instanceof MainAsset;
      } catch (error) {
        return false;
      }
    } else if (typeof data === 'object') {
      try {
        return MainAsset.fromPOJO(data) instanceof MainAsset;
      } catch (error) {
        return false;
      }
    }
  }
}