exports.encrypt = function(src, key) {
  var enc, encrypted, i, _i, _ref;
  encrypted = [];
  for (i = _i = 0, _ref = src.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    enc = src.charCodeAt(i) ^ key.charCodeAt(i);
    encrypted.push(enc);
  }
  return encrypted;
};

exports.decrypt = function(encrypted, key) {
  var dec, decrypted, i, _i, _ref;
  decrypted = "";
  for (i = _i = 0, _ref = encrypted.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    dec = encrypted[i] ^ key.charCodeAt(i);
    decrypted += String.fromCharCode(dec);
  }
  return decrypted;
};
