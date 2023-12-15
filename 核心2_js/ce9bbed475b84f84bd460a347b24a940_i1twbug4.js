let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    var str =
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5VdFThSvx0F+PDZGg0OrCImNmFGZe7395hD/K9FRp2fkhWVSzkD4Ck6AVWKtE18/OIuVDPoGsmTxUML+QfIUTmIDQSYahxbE6c5iiHegqzYXBadqUg/dRjLvztCut99J8Redit7xpt6XEzOGSgsgVOnK11f0R4eUsjhu2GxaOckQ1IMR0oeS/y5wEbRfj2DQALcCkwnfgq2Nl6PxFA9Yte1F48hqtRaxEskLgxF8QQtQKDVr0Tmw5NjfR0dU2Kmw8qbxa/OeB3++9rnRFqa+pZME1sPzeDR9Z0PJv0byuIHUeKdXeYMVggOw/D6Y1Yh0EbEIh8AgBGWQyzrhk7ApMQIDAQAB"; //这里填公钥
    var pwd = "e41a82b276e647aaa230"; //这里填si钥
    if (str == "") return "";
    str = escape(str);
    if (!pwd || pwd == "") {
      var pwd = "1234";
    }
    pwd = escape(pwd);
    if (pwd == null || pwd.length <= 0) {
      alert("Please enter a password with which to encrypt the message.");
      return null;
    }
    var prand = "";
    for (var I = 0; I < pwd.length; I++) {
      prand += pwd.charCodeAt(I).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.ceil(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
      alert("Algorithm cannot find a suitable hash. Please choose a different password. /n Possible considerations are to choose a more complex or longer password.");
      return null;
    }
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
      var a = parseInt(prand.substring(0, 10));
      var b = parseInt(prand.substring(10, prand.length));
      var c = a + b;
      c = c.toString();
      prand = c;
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (var I = 0; I < str.length; I++) {
      var aI = str.charCodeAt(I);
      var bI = Math.floor((prand / modu) * 255);
      var cI = aI ^ bI;
      enc_chr = parseInt(cI);
      if (enc_chr < 16) {
        enc_str += "0" + enc_chr.toString(16);
      } else enc_str += enc_chr.toString(16);
      prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8) salt = "0" + salt;
    enc_str += salt;
    return enc_str;
    return {};
  }
}
exports({ entryPoint: MyTrigger });