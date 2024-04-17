/**
 * @link   https://github.com/NazarK0
 * @file   This file define the Stockpile class.
 * @author Nazar Vanivsky.
 * @since  0.0.1
 */

/** jshint undef: true, unused: true, strict: true */
/**
 * Stockpile Class.
 *
 * @since      0.0.1
 * @access     public
 *
 * @constructs Stockpile
 * @augments   none
 */
export default class Stockpile {
  /**
  * title property.
  * 
  * @since  0.0.1
  * @access private
  * @type     {string}
  * @memberof Stockpile
  */
  #title;
  /**
  * group to which belongs stockpile property, store id from database.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof Stockpile
  */
  #group;
  /**
  * date of manufacture of stockpile property.
  *
  * @since  0.0.1
  * @access private
  * @type     {date}
  * @memberof Stockpile
  */
  #dateOfManufacture;
  /**
  * serial number of stockpile property.
  *
  * @since  0.0.1
  * @access private
  * @type     {string}
  * @memberof Stockpile
  */
  #serialNumber;
  /**
  * balance amount of stockpile property.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof Stockpile
  */
  #balanceAmount;
  /**
  * actual amount of stockpile property.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof Stockpile
  */
  #actualAmount;
  /**
  * unit of measurement of stockpile property, store id from database.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof Stockpile
  */
  #integer;
  /**
  * cost of stockpile property.
  *
  * @since  0.0.1
  * @access private
  * @type     {number}
  * @memberof Stockpile
  */
  #cost;

  constructor() {
    this.#title = '';
    this.#group = null;
    this.#serialNumber = '';
    this.#balanceAmount = 0;
    this.#actualAmount = 0;
    this.#integer = null;
    this.#cost = '';
    this.#dateOfManufacture = null;
  }

  /**
   * get/set title of stockpile.
   *
   * @since  0.0.1
   * @access public
   * @type     {string}
   * @memberof Stockpile
   */
  set title(title) {
    this.#title = title;
  }

  /**
   * get/set group id to which belongs stockpile.
   *
   * @since  0.0.1
   * @access public
   * @type     {number}
   * @memberof Stockpile
   */
  set group(group) {
    this.#group = group;
  }
  /**
   * get/set serial number of stockpile.
   *
   * @since  0.0.1
   * @access public
   * @type     {string}
   * @memberof Stockpile
 */
  set serialNumber(num) {
    this.#serialNumber = num;
  }
  /**
   * get/set balance amount of stockpile.
   *
   * @since  0.0.1
   * @access public
   * @type     {number}
   * @memberof Stockpile
 */
  set balanceAmount(amount) {
    if (!amount || Number.isNaN(amount)) {
      this.#balanceAmount = 0;
    } else if (typeof amount === 'number') this.#balanceAmount = amount;
    else if (typeof amount === 'string') {
      const parsed = Number.parseInt(amount);

      if (Number.isNaN(parsed)) {
        this.#balanceAmount = 0;
      } else {
        this.#balanceAmount = parsed;
      }
    } else {
      this.#balanceAmount = amount;
    }
  }

  /**
   * get/set actual amount of stockpile.
   *
   * @since  0.0.1
   * @access public
   * @type     {number}
   * @memberof Stockpile
 */
  set actualAmount(amount) {
    if (!amount || Number.isNaN(amount)) {
      this.#actualAmount = 0;
    } else if (typeof amount === 'number') this.#actualAmount = amount;
    else if (typeof amount === 'string') {
      const parsed = Number.parseInt(amount);

      if (Number.isNaN(parsed)) {
        this.#actualAmount = 0;
      } else {
        this.#actualAmount = parsed;
      }
    } else {
      this.#actualAmount = amount;
    }
  }

  /**
   * get/set unit of measurement id of stockpile.
   *
   * @since  0.0.1
   * @access public
   * @type     {number}
   * @memberof Stockpile
   */
  set integer(integer) {
    this.#integer = integer;
  }

  /**
   * get/set cost of stockpile.
   *
   * @since  0.0.1
   * @access public
   * @type     {number}
   * @memberof Stockpile
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
  * get/set date of manufacture of stockpile.
  *
  * @since  0.0.1
  * @access public
  * @type     {date}
  * @memberof Stockpile
  */
  set dateOfManufacture(date) {
    this.#dateOfManufacture = date;
  }

  get title() {
    return this.#title;
  }

  get group() {
    return this.#group;
  }

  get serialNumber() {
    return this.#serialNumber;
  }

  get balanceAmount() {
    return this.#balanceAmount;
  }

  get actualAmount() {
    return this.#actualAmount;
  }

  get integer() {
    return this.#integer;
  }

  get cost() {
    return this.#cost;
  }

  get dateOfManufacture() {
    return this.#dateOfManufacture;
  }

  /**
   * Stockpile to object.
   *
   * Convert Stockpile class instance to plain javascript object.
   *
   * @since      0.0.1
   * @access     public
   * @class    Stockpile
   * @return {object} Return object with fields that represent stockpile.
   */
  toPOJO() {
    return {
      title: this.title,
      group: this.group,
      serialNumber: this.serialNumber,
      balanceAmount: this.balanceAmount,
      actualAmount: this.actualAmount,
      integer: this.integer,
      cost: this.cost,
      dateOfManufacture: this.dateOfManufacture,
    };
  }

  /**
  * Stockpile to string.
  *
  * Convert Stockpile class instance to JSON string.
  *
  * @since      0.0.1
  * @access     public
  * @class    Stockpile
  * @return {string} Return JSON string with data that represent stockpile.
*/
  toString() {
    return JSON.stringify(this.toPOJO());
  }

  /**
   * Stockpile from object.
   *
   * Convert plain javascript object to Stockpile class instance.
   *
   * @since      0.0.1
   * @access     public
   * @class    Stockpile
   * @param  {object} obj plain javascript object
   * @return {Stockpile} Return Stockpile class instance.
   */
  static fromPOJO(obj) {
    const newObj = new Stockpile();

    const isObjValidStockpile = obj.hasOwnProperty('title') &&
      obj.hasOwnProperty('group') &&
      obj.hasOwnProperty('serialNumber') &&
      obj.hasOwnProperty('balanceAmount') &&
      obj.hasOwnProperty('actualAmount') &&
      obj.hasOwnProperty('integer') &&
      obj.hasOwnProperty('cost') &&
      obj.hasOwnProperty('dateOfManufacture');

    if (isObjValidStockpile) {
      newObj.title = obj.title;
      newObj.group = obj.group;
      newObj.serialNumber = obj.serialNumber;
      newObj.balanceAmount = obj.balanceAmount;
      newObj.actualAmount = obj.actualAmount;
      newObj.integer = obj.integer;
      newObj.cost = obj.cost;
      newObj.dateOfManufacture = obj.dateOfManufacture;

      return newObj;
    } else {
      throw new Error('POJO is not valid Stockpile instance');
    }
  }

  /**
   * Stockpile from JSON string.
   *
   * Convert JSON string to Stockpile class instance.
   *
   * @since      0.0.1
   * @access     public
   * @class    Stockpile
   * @param  {string} str Stringifyied JSON
   * @return {Stockpile} Return Stockpile class instance.
   */
  static fromString(str) {
    const obj = JSON.parse(str);
    return Stockpile.fromPOJO(obj);
  }

  /**
   * Check string or object there are represent Stockpile.
   *
   * @since      0.0.1
   * @access     public
   * @class    Stockpile
   * @param  {(string | object)} data Stringifyied JSON or object
   * @return {boolean} Return validation of data is represent Stockpile class instance.
   */
  static isStockpile(data) {
    if (typeof data === 'string') {
      try {
        return Stockpile.fromString(data) instanceof Stockpile;
      } catch (error) {
        return false;
      }
    } else if (typeof data === 'object') {
      try {
        return Stockpile.fromPOJO(data) instanceof Stockpile;
      } catch (error) {
        return false;
      }
    }
  }
}