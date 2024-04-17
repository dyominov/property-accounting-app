const runOnce = (function () {
  let executed = false;


  /**
   * Run passed function only once.
   *
   * @param {function(): void} fn The function to run.
   * @return {void}
   */
  return function (fn) {
    
    if (!executed) {
      executed = true;
      fn();
    }
  };
})();


export default runOnce;