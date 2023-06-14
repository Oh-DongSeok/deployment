/**
 * @fileoverview Base64を用いて文字列のエンコードおよびデコードを行う<br>
 * 以下のメソッドを提供する<br>
 * encode<br>
 * decode
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 2.1.1
 * @lang ja
 */
 /**
 * @fileoverview Encodes/decodes string using Base64.<br>
 * Provides the following methods:<br>
 * encode<br>
 * decode
 * @author Copyright(C) 2021 FUJIFILM Business Innovation Corp. All rights reserved.<br>
 * @version 2.1.1
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
function Base64Lib(){
  /**
   *  @private
   */
  this.utf = new Base64Lib.UTF();
}

/**
 * 
 * @private
 */
Base64Lib.charTable = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];

/**
 * 
 * @private
 */
Base64Lib.isAscii = true;//true:ASCII false:マルチバイト

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
Base64Lib.AsciiCode = {
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
 * @base Base64Lib
 * @param {String} srcStr base64エンコードを行いたい文字列
 * @return {String} encodeの処理が成功(srcStrが存在)したらencodeStrが返る<br>
 * 失敗(srcStrが空文字またはnull、undefind)したら""が返る
 * @lang ja
 */
/**
 * Encodes string
 * @base Base64Lib
 * @param {String} srcStr String to encode using base64
 * @return {String} If decoding is successful (i.e. if srcStr exists), encodeStr is returned. <br>
 * Otherwise (i.e. if srcStr is empty string, null or undefined), "" is returned.
 * @lang en
 */
Base64Lib.prototype.encode = function(srcStr){
  if (!srcStr) {
    return "";
  }
  var utf8Arr = this.utf.unpackUTF8(srcStr);
  var leng = utf8Arr.length;
  var encodeStr = "";
  for (var i = 0; i < leng; i += 3){
    encodeStr += Base64Lib.charTable[(utf8Arr[i] >> 2) & 0x3f];
    encodeStr += Base64Lib.charTable[((utf8Arr[i] & 0x03) << 4) | ((utf8Arr[i + 1] & 0xf0) >> 4)];
    if ((i + 2) == (leng + 1)){
      encodeStr += "=";
    } else {
      encodeStr += Base64Lib.charTable[((utf8Arr[i + 1] & 0x0f) << 2) | ((utf8Arr[i + 2] & 0xc0) >> 6)];
    }

    if (((i + 2) == (leng + 1)) || ((i + 2) == leng)){
      encodeStr += "=";
    } else {
      encodeStr += Base64Lib.charTable[utf8Arr[i + 2] & 0x3f];
    }
  }
  return encodeStr;
};
/**
 * 文字列のデコード
 * @base Base64Lib
 * @param {String} srcStr デコードを行いたい文字列
 * @return {String} decodeの処理が成功(srcStrが存在)したらdecodeStrが返る<br>
 * 失敗(srcStrが空文字またはnull、undefind)したら""が返る
 * @lang ja
 */
/**
 * Decodes string
 * @base Base64Lib
 * @param {String} srcStr String to decode
 * @return {String} If decoding is successful (i.e. if srcStr exists), decodeStr is returned. <br>
 * Otherwise (i.e. if srcStr is empty string, null or undefined), "" is returned.
 * @lang en
 */

Base64Lib.prototype.decode = function(srcStr){
  var bitEnd = 0;
  var destStr = new Array();
  var decodeStr = "";
//  var b64leng = Base64Lib.charTable.length;
  var mulcnt = 0;
  var charNum = 4;
  var asccnt = 0;
  var cnt_str = 0;
  if (!srcStr) {
    return "";
  } 
  var leng = srcStr.length;
  var bit = new Array();

  for (var i = 0; i < leng; i++){
    if ((Base64Lib.AsciiCode.minUpperAlpha < srcStr.charCodeAt(i)) && (srcStr.charCodeAt(i) < Base64Lib.AsciiCode.maxUpperAlpha)){
      bit[i] = srcStr.charCodeAt(i) - Base64Lib.AsciiCode.b64UpperAlpha;
    } else if ((Base64Lib.AsciiCode.minLowerAlpha < srcStr.charCodeAt(i)) && (srcStr.charCodeAt(i) < Base64Lib.AsciiCode.maxLowerAlpha)){
      bit[i] = srcStr.charCodeAt(i) - Base64Lib.AsciiCode.b64LowerAlpha;
    } else if ((Base64Lib.AsciiCode.minDigit < srcStr.charCodeAt(i)) && (srcStr.charCodeAt(i) < Base64Lib.AsciiCode.maxDigit)){
      bit[i] = srcStr.charCodeAt(i) + Base64Lib.AsciiCode.b64Digit;
    } else if (srcStr.charCodeAt(i) == Base64Lib.AsciiCode.markPlus){
      bit[i] = Base64Lib.AsciiCode.b64MarkPlus;
    } else if (srcStr.charCodeAt(i) == Base64Lib.AsciiCode.markEqual){
      bit[i] = Base64Lib.AsciiCode.b64MarkEqual;
    } else {
      break;
    }
  }

  leng = bit.length;
  while (cnt_str < leng){ 
    if (bit[cnt_str + 1] == null) {
      break;
    }
    switch (bitEnd){
    case 0:
      destStr[cnt_str] = (bit[cnt_str] << 2) | ((bit[cnt_str + 1] & 0xf0) >> 4);
      break;
    case 2:
      destStr[cnt_str] = ((bit[cnt_str] & 0x03) << 6) | bit[cnt_str + 1];
      break;
    case 4:
      destStr[cnt_str] = ((bit[cnt_str] & 0x0f) << 4) | ((bit[cnt_str + 1] & 0x3c) >> 2);
      break;
    default:
      break;
    }
    //ASCII文字の処理
    if (destStr[cnt_str] <= 0x7f) {
      switch (bitEnd){
      case 0:
        bitEnd = 4;
        charNum = 5;
        break;
      case 2:
        bitEnd = 0;
        charNum = 4;
        break;
      case 4:
        bitEnd = 2;
        charNum = 5;
        break;
      default:
        break;
      }
      decodeStr += String.fromCharCode(destStr[cnt_str]);
      asccnt++;
      cnt_str++;
      if (asccnt % 3 == 0){
        cnt_str++;
      }
      Base64Lib.isAscii = true;
    } else { //マルチバイト文字の処理
      var mul = new Array();
      for (i = 0; i < charNum; i++){
        mul[i] = bit[cnt_str];
        if ((bitEnd != 0) && (i == (charNum - 1))){
          break;
        }
        cnt_str++;
      }
      if (bitEnd == 0){
        destStr = this.utf.finBit(mul);
      } else {
        destStr = this.utf.remainBit(mul, bitEnd);
      }
      decodeStr += this.utf.packUTF8(destStr);
      mulcnt++;
      Base64Lib.isAscii = false;
    }
  }
  return decodeStr;
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
Base64Lib.UTF = function(){};
/**
 * マルチバイト文字をISO Latin文字コードに変換
 * @base Base64Lib.UTF
 * @param {String} srcStr マルチバイト文字列
 * @return {String} unpackUTF8の処理が成功(srcStrが存在)したらutf8が返る<br>
 * 失敗したら""が返る
 * @lang ja
 */
/**
 * Converts multibyte characters to ISO Latin character codes.
 * @base Base64Lib.UTF
 * @param {String} srcStr String of multibyte characters.
 * @return {String} If unpackUTF8 processing is successful (i.e. if srcStr exists), utf8 is returned.<br>
 * Otherwise, "" is returned.
 * @lang en
 */
Base64Lib.UTF.prototype.unpackUTF8 = function(srcStr){
  if (!srcStr) {
    return "";
  }
  var leng = srcStr.length;
  var unpack16 = new Array();
  for (var i = 0; i < leng; i++){
    unpack16[i] = srcStr.charCodeAt(i);
  }
  var j = 0;
  leng = unpack16.length;
  var bit;
  var utf8 = new Array();
  for (i = 0; i < leng; i++){
    bit = unpack16[i];
    if (bit <= 0x7f){
      utf8[j++] = bit;
    } else {
      utf8[j++] = 0xe0 | (bit >>> 12);
      utf8[j++] = 0x80 | ((bit >>> 6) & 0x3f);
      utf8[j++] = 0x80 | (bit & 0x3f);
    }
  }
  return utf8;
};
/**
 * ISO Latin文字コードをマルチバイト文字に変換
 * @base Base64Lib.UTF
 * @param {String} srcStr ISO_Latin文字コード
 * @return {String} packUTF8の処理が成功(srcStrが存在)したらdestStrが返る<br>
 * 失敗したら""が返る
 * @lang ja
 */
/**
 * Converts ISO Latin character codes to multibyte characters.
 * @base Base64Lib.UTF
 * @param {String} srcStr ISO_Latin character code.
 * @return {String} If packUTF8 processing is successful (i.e. if srcStr exists), destStr is returned.<br>
 * Otherwise, "" is returned.
 * @lang en
 */
Base64Lib.UTF.prototype.packUTF8 = function (srcStr){
  if (!srcStr){
    return "";
  }
  var j = 0;
  var leng = srcStr.length;
  var utf16 = new Array();
  var destStr = "";
  var ascii = "";
  for (var i = 0; i < leng; i += 3){
    utf16[j++] = (srcStr[i] & 0x0f) << 12;
    utf16[j++] = (srcStr[i + 1] & 0x3f) << 6;
    utf16[j++] = (srcStr[i + 2] & 0x3f);
    ascii = utf16[i] + utf16[i + 1] + utf16[i + 2];
    destStr += String.fromCharCode(ascii);
  }
  return destStr;
};

/**
 * 直前のビットがすべて使用されている際のbase64文字列をISO Latin文字コードに変換(マルチバイトのみ)
 * @base Base64Lib.UTF
 * @param {String} srcStr base64文字列
 * @return {String} finBitの処理が成功(srcStrが存在)したらdestStrが返る<br>
 *  失敗したら""が返る
 * @lang ja
 */
/**
 * Converts base64 string with all preceding bits occupied to ISO Latin character codes (multibyte only).
 * @base Base64Lib.UTF
 * @param {String} srcStr base64 string.
 * @return {String} If finBit processing is successful (i.e. if srcStr exists), destStr is returned.<br>
 * Otherwise, "" is returned.
 * @lang en
 */
Base64Lib.UTF.prototype.finBit = function (srcStr){
  if (!srcStr) {
    return "";
  }
  var destStr = new Array();
  var j = 0;
  var leng = srcStr.length;
  for (var i = 0; i < leng; i += 4){ //end:0
    destStr[j++] = (srcStr[i] << 2) | ((srcStr[i + 1] & 0xf0) >> 4);
    destStr[j++] = ((srcStr[i + 1] & 0x0f) << 4) | (srcStr[i + 2] >> 2);
    destStr[j++] = ((srcStr[i + 2] & 0x03) << 6) | (srcStr[i + 3]);
  }
  return destStr;
};
/**
 * 直前のビットが2ビットまたは4ビットあまりのbase64文字列をISO Latin文字コードに変換(マルチバイトのみ)
 * @base Base64Lib.UTF
 * @param {String} srcStr base64文字列
 * @return {String} remainBitの処理が成功(srcStrが存在)したらdestStrが返る<br>
 * 失敗したら""が返る
 * @lang ja
 */
 /**
 * Converts base64 string with 2 or 4 preceding bits to ISO Latin character codes (multibyte only).s
 * @base Base64Lib.UTF
 * @param {String} srcStr base64 string
 * @return {String} If remainBit processing is successful (i.e. if srcStr exists), destStr is returned.<br>
 * Otherwise, "" is returned.
 * @lang en
 */
Base64Lib.UTF.prototype.remainBit = function(srcStr, end){
  if (!srcStr){
    return "";
  }
  var destStr = new Array();
  var j = 0;
  var leng = srcStr.length;
  if (end == 4){
    for (var i = 0; i < leng; i += 5){
      destStr[j++] = ((srcStr[i] & 0x0f) << 4) | ((srcStr[i + 1] & 0x3c) >> 2);
      destStr[j++] = ((srcStr[i + 1] & 0x03) << 6) | (srcStr[i + 2]);
      destStr[j++] = (srcStr[i + 3] << 2) | ((srcStr[i + 4] & 0x30) >> 4);
    }
  } else if (end == 2){
    for (var i = 0; i < leng; i += 5){
      destStr[j++] = ((srcStr[i] & 0x03) << 6) | srcStr[i + 1];
      destStr[j++] = (srcStr[i + 2] << 2)| ((srcStr[i + 3] & 0x30) >> 4);
      destStr[j++] = ((srcStr[i + 3] & 0x0f) << 4) | ((srcStr[i + 4] & 0x3c) >> 2);
    }
  }
  return destStr;
};