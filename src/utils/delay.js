/**
 * Make a delay of s seconds.
 *
 * @param {number} s The number of seconds to delay.
 * @return {Promise} Promise object represents the delay of s seconds.
 */
const delay = s => new Promise(res => setTimeout(res, s * 1000));

export default delay;
