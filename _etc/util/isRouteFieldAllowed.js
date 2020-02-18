module.exports = function isRouteFieldAllowed(RequestBody, AcceptedFieldStringArray) {
  /**
   * 1) get enumerable string from req.body
   * 2) use .every() to check if each of it's value exists within the accepted field array
   * 3) if one false is returned, then return false... a field was added to the payload that should never exist.
   */
  return Object.keys(RequestBody).every(update => AcceptedFieldStringArray.includes(update));
};