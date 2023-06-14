/**
 * @fileoverview UTF-16文字列とBase64でエンコードされたUTF-8文字列との変換を行う<br>
 * 以下のメソッドを提供する<br>
 * encode<br>
 * decode
 * @author Copyright (c) 2021 FUJIFILM Business Innovation Corporation, All rights reserved.<br>
 * @version 2.0.0
 * @lang ja
 */
 /**
 * @fileoverview Converts between UTF-16 string and Base64 encoded UTF-8 string.<br>
 * Provides the following methods:<br>
 * encode<br>
 * decode
 * @author Copyright (c) 2021 FUJIFILM Business Innovation Corporation, All rights reserved.<br>
 * @version 2.0.0
 * @lang en
 */

/**
 * 文字列のエンコード・デコード
 * @constructor
 * @class 文字列のエンコードおよびデコードを行う
 * @lang ja
 */
/**
 * String encoding/decoding.
 * @constructor
 * @class Encodes/decodes string.
 * @lang en
 */
function Base64(){
  /**
   *  @private
   */
  this.utf = new UTF();
}

/**
 * 
 * @private
 */
Base64.charTable = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];

/**
 * ASCII文字コード(デコード用)
 * @private
 * @lang ja
 */
/**
 * ASCII character codes (for decoding)
 * @private
 * @lang en
 */
Base64.AsciiCode = {
  minUpperAlpha : 64,
  maxUpperAlpha : 91,
  b64UpperAlpha : 65,
  minLowerAlpha : 96,
  maxLowerAlpha : 123,
  b64LowerAlpha : 71,
  minDigit    : 47,
  maxDigit    : 58,
  b64Digit    : 4,
  markPlus    : 43,
  b64MarkPlus   : 62,
  markEqual   : 47,
  b64MarkEqual  : 63
};


/**
 * 文字列のエンコード
 * @base Base64
 * @param {String} srcStr base64エンコードを行いたい文字列
 * @return {String} encodeの処理が成功(srcStrが存在)したらencodeStrが返る<br>
 * 失敗(srcStrが空文字またはnull、undefind)したら""が返る
 * @lang ja
 */
/**
 * Encodes string
 * @base Base64
 * @param {String} srcStr String to encode using base64
 * @return {String} If decoding is successful (i.e. if srcStr exists), encodeStr is returned. <br>
 * Otherwise (i.e. if srcStr is empty string, null or undefined), "" is returned.
 * @lang en
 */
Base64.prototype.encode = function(srcStr){
  if (!srcStr) {
    return "";
  }
  var utf8Arr = this.utf.unpackUTF8(srcStr);
  var end = utf8Arr.length - 2;
  var encoded = "";
  var i = 0;
  for (i = 0; i < end; i += 3){
    encoded += Base64.charTable[(utf8Arr[i] >> 2) & 0x3f];
    encoded += Base64.charTable[((utf8Arr[i] & 0x03) << 4) | ((utf8Arr[i + 1] & 0xf0) >> 4)];
    encoded += Base64.charTable[((utf8Arr[i + 1] & 0x0f) << 2) | ((utf8Arr[i + 2] & 0xc0) >> 6)];
    encoded += Base64.charTable[utf8Arr[i + 2] & 0x3f];
  }
  if (i >= utf8Arr.length) {
    // do nothing.
  } else if (i+1 >= utf8Arr.length) {
    encoded += Base64.charTable[(utf8Arr[i] >> 2) & 0x3f];
    encoded += Base64.charTable[((utf8Arr[i] & 0x03) << 4)];
    encoded += "=";
    encoded += "=";
  } else if (i+2 >= utf8Arr.length) {
    encoded += Base64.charTable[(utf8Arr[i] >> 2) & 0x3f];
    encoded += Base64.charTable[((utf8Arr[i] & 0x03) << 4) | ((utf8Arr[i + 1] & 0xf0) >> 4)];
    encoded += Base64.charTable[((utf8Arr[i + 1] & 0x0f) << 2)];
    encoded += "=";
  }  

  return encoded;
};
/**
 * 文字列のデコード
 * @base Base64
 * @param {String} srcStr デコードを行いたい文字列
 * @return {String} decodeの処理が成功(srcStrが存在)したらdecodeStrが返る<br>
 * 失敗(srcStrが空文字またはnull、undefind)したら""が返る
 * @lang ja
 */
/**
 * Decodes string
 * @base Base64
 * @param {String} srcStr String to decode
 * @return {String} If decoding is successful (i.e. if srcStr exists), decodeStr is returned. <br>
 * Otherwise (i.e. if srcStr is empty string, null or undefined), "" is returned.
 * @lang en
 */

Base64.prototype.decode = function(srcStr){

  if (!srcStr || (srcStr.length == 0)) {
    return "";
  } 
  
  if ( (srcStr.length % 4) != 0) {
    return ""; // error return.
  }
  var leng = srcStr.length;
  var utf8 = new Array();
  var j = 0;
  
  var tmp = 0;
  var i = 0;
  
  function codeToValue(code) {
    if ((Base64.AsciiCode.minUpperAlpha < code) && (code < Base64.AsciiCode.maxUpperAlpha)){
      value = code - Base64.AsciiCode.b64UpperAlpha;
    } else if ((Base64.AsciiCode.minLowerAlpha < code) && (code < Base64.AsciiCode.maxLowerAlpha)){
      value = code - Base64.AsciiCode.b64LowerAlpha;
    } else if ((Base64.AsciiCode.minDigit < code) && (code < Base64.AsciiCode.maxDigit)){
      value = code + Base64.AsciiCode.b64Digit;
    } else if (code == Base64.AsciiCode.markPlus){
      value = Base64.AsciiCode.b64MarkPlus;
    } else if (code == Base64.AsciiCode.markEqual){
      value = Base64.AsciiCode.b64MarkEqual;
    } else {
      value = 0;
    }
    return value;
  }
  
  for (i = 0; i < leng; i+= 4) {
    tmp = (codeToValue(srcStr.charCodeAt(i)) << 18) + (codeToValue(srcStr.charCodeAt(i+1)) << 12) + (codeToValue(srcStr.charCodeAt(i+2)) << 6) + codeToValue(srcStr.charCodeAt(i+3));
    utf8[j] = tmp >>> 16;
    utf8[j+1] = (tmp >>> 8) & 0xFF;
    utf8[j+2] = tmp & 0xFF;
    j += 3;
  }
  if (srcStr[i-2] == "=") {
    utf8.pop();
    utf8.pop();
  } else if (srcStr[i-1] == "=") {
    utf8.pop();
  }


  return this.utf.packUTF8(utf8);
};

/**
 * UTF-8変換(マルチバイト文字の処理)
 * @class UTF-8変換を行う
 * @private
 * @lang ja
 */
 /**
 * UTF-8 conversion (multibyte character processing)
 * @class Performs UTF-8 conversion.
 * @private
 * @lang en
 */
UTF = function(){};
/**
 * マルチバイト文字をISO Latin文字コードに変換
 * @base UTF
 * @param {String} srcStr マルチバイト文字列
 * @return {String} unpackUTF8の処理が成功(srcStrが存在)したらutf8が返る<br>
 * 失敗したら""が返る
 * @lang ja
 */
/**
 * Converts multibyte characters to ISO Latin character codes.
 * @base UTF
 * @param {String} srcStr String of multibyte characters.
 * @return {String} If unpackUTF8 processing is successful (i.e. if srcStr exists), utf8 is returned.<br>
 * Otherwise, "" is returned.
 * @lang en
 */
UTF.prototype.unpackUTF8 = function(srcStr){
  if (!srcStr) {
    return "";
  }
  var j;
  var unicode;
  var utf8 = new Array();
  var j = 0;
  
  var leng = srcStr.length;

  for (var i = 0; i < leng; i++){
    unicode = srcStr.charCodeAt(i);
    if ((0xD800 <= unicode)&&(unicode < 0xDC00)) {
      // assuming high surrogates char comes first.
      if ( i+1 >= leng ) return "";  // error return.
      unicode = 0x10000 + (srcStr.charCodeAt(i) - 0xD800)*0x400 + (srcStr.charCodeAt(i+1) - 0xDC00);
      i++;
    }
    if (unicode <= 0x7F) {
      utf8[j++] = unicode;
    } else if (unicode <= 0x7FF) {
      utf8[j++] = 0xC0 | (unicode >>> 6);
      utf8[j++] = 0x80 | (unicode & 0x3F);
    } else if (unicode <= 0xFFFF) {
      utf8[j++] = 0xE0 | (unicode >>> 12);
      utf8[j++] = 0x80 | ((unicode >>> 6) & 0x3F);
      utf8[j++] = 0x80 | (unicode & 0x3F);
    } else {
      utf8[j++] = 0xF0 | (unicode >>> 18);
      utf8[j++] = 0x80 | ((unicode >>> 12) & 0x3F);
      utf8[j++] = 0x80 | ((unicode >>> 6) & 0x3F);
      utf8[j++] = 0x80 | (unicode & 0x3F);
    } 
  }
  return utf8;
};
/**
 * ISO Latin文字コードをマルチバイト文字に変換
 * @base UTF
 * @param {String} srcStr ISO_Latin文字コード
 * @return {String} packUTF8の処理が成功(srcStrが存在)したらdestStrが返る<br>
 * 失敗したら""が返る
 * @lang ja
 */
/**
 * Converts ISO Latin character codes to multibyte characters.
 * @base UTF
 * @param {String} srcStr ISO_Latin character code.
 * @return {String} If packUTF8 processing is successful (i.e. if srcStr exists), destStr is returned.<br>
 * Otherwise, "" is returned.
 * @lang en
 */
UTF.prototype.packUTF8 = function (utf8){
  if (!utf8){
    return "";
  }

  var leng = utf8.length;
  var str = "";
  
  var firstByte;
  for (var i = 0; i < leng; ) {
    firstByte = utf8[i];
    if ( firstByte <= 0x7F ) {
      str += String.fromCharCode(firstByte);
      i++;
    } else if ((0xC2 <= firstByte)&&(firstByte <= 0xDF)) {
      str += String.fromCharCode( ((firstByte & 0x1F) << 6) + (utf8[i+1] & 0x3F));
      i += 2;
    } else if ((0xE0 <= firstByte)&&(firstByte <= 0xEF)) {
      str += String.fromCharCode( ((firstByte & 0x0F) << 12) + ((utf8[i+1] & 0x3F)<< 6) + (utf8[i+2] & 0x3F));
      i += 3;
    } else if ((0xF0 <= firstByte)&&(firstByte <= 0xF7)) {
      code = ((firstByte & 0x07) << 18) + ((utf8[i+1] & 0x3F)<< 12) + ((utf8[i+2] & 0x3F)<< 6) + (utf8[i+3] & 0x3F);
      if ((0x10000 <= code ) && ( code <= 0x10FFFF )) {
        str += String.fromCharCode( ((code - 0x10000) >>> 10) + 0xD800) +  String.fromCharCode( ((code - 0x10000) & 0x3FF ) + 0xDC00); 
      } else {
        return "";// error return.
      }
      i += 4;
    } else {
      return "";// error return.
    }
  }

  return str;
};
