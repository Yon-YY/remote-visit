import CryptoJS from 'tripledes';

//DES加密（BCB模式）、Base64加密
function encryptByDES(message, key, iv) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var ivHex = CryptoJS.enc.Utf8.parse(iv);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

module.exports = {
  encryptByDES: encryptByDES
}