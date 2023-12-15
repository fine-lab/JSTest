let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //加密参数----------------------------begin
    var hexcase = 0;
    var b64pad = "";
    var chrsz = 8;
    var token = getToken();
    //加密参数----------------------------end
    //需要处理部分------------------------begin
    var hmd_req_resources_path = "/homedo-yonsuite-service/orderSubmit";
    //注意需要大写
    var hmd_req_type = "POST";
    //需要处理部分------------------------end
    var ticket = getTicket();
    var hmd_base_path = "https://open-api.homedo.com";
    var hmd_AccessKey = "yourKeyHere";
    var hmd_AccessSecret = "yourSecretHere";
    var hmd_contenttype = "application/json;charset=UTF-8";
    var hmd_md5 = "";
    var hmd_gmtdate = datetostring();
    var hmd_Authorization = "OPENPLATFORM ";
    var encodeStr = hmd_req_type.concat("\n", hmd_md5, "\n", hmd_contenttype, "\n", hmd_gmtdate, "\n", hmd_req_resources_path);
    //开始加密
    var signature = b64_hmac_sha1(hmd_AccessSecret, encodeStr) + "=";
    //使用Authorization
    var buildAuthorization = hmd_Authorization.concat(hmd_AccessKey, ":", signature);
    //组装请求头
    let hmdheader = {
      ticket: ticket,
      Authorization: buildAuthorization,
      Date: hmd_gmtdate,
      "Content-Type": hmd_contenttype,
      CanonicalizedResource: hmd_req_resources_path
    };
    //请求数据
    var contenttype = "application/json;charset=UTF-8";
    var req_buylist = "https://www.example.com/" + token;
    var header = {
      "Content-Type": contenttype
    };
    //获取所有分类
    var listbody = {
      pageIndex: 1,
      pageSize: 10
    };
    var listbuy1 = postman(hmd_req_type, req_buylist, JSON.stringify(header), JSON.stringify(listbody));
    var listbuy = listbuy1.replace(/!/g, "_");
    var listbuyData = JSON.parse(listbuy).data;
    var buyarray = listbuyData.recordList;
    var buyData = new Array();
    busAllData();
    var res = ObjectStore.insertBatch("GT1281AT3.GT1281AT3.receive", buyData, "ea39bd44");
    var s = res;
    function busAllData() {
      buyarray.forEach((data) => {
        var listbuyMap = {};
        if (data.headItem != undefined) {
          if (data.headItem.define30 != undefined) {
            listbuyMap["yscode"] = data.code;
            listbuyMap["ysid"] = data.id;
            listbuyMap["hmdorderid"] = data.headItem.define30;
            listbuyMap["isconfirm"] = "2";
            buyData.push(listbuyMap);
          }
        }
      });
    }
    function getToken() {
      var appcontext = JSON.parse(AppContext());
      var tenantId = "yourIdHere";
      var hmd_req_resources_path = "/homedo-yonsuite-service/getToken?tenantId=" + tenantId;
      //注意需要大写
      var hmd_req_type = "GET";
      //需要处理部分------------------------end
      var hmd_base_path = "https://open-api.homedo.com";
      var hmd_AccessKey = "yourKeyHere";
      var hmd_AccessSecret = "yourSecretHere";
      var hmd_contenttype = "application/json;charset=UTF-8";
      var hmd_md5 = "";
      var hmd_gmtdate = datetostring();
      var hmd_Authorization = "OPENPLATFORM ";
      var encodeStr = hmd_req_type.concat("\n", hmd_md5, "\n", hmd_contenttype, "\n", hmd_gmtdate, "\n", hmd_req_resources_path);
      //开始加密
      var signature = b64_hmac_sha1(hmd_AccessSecret, encodeStr) + "=";
      //使用Authorization
      var buildAuthorization = hmd_Authorization.concat(hmd_AccessKey, ":", signature);
      //组装请求头
      let header = {
        Authorization: buildAuthorization,
        Date: hmd_gmtdate,
        "Content-Type": hmd_contenttype,
        CanonicalizedResource: hmd_req_resources_path
      };
      //请求数据
      let apiResponse = postman(hmd_req_type, hmd_base_path.concat(hmd_req_resources_path), JSON.stringify(header), null);
      var token = JSON.parse(apiResponse).data.token;
      return token;
    }
    //数据转换-----------------------end
    function datetostring() {
      var date = new Date();
      var hmd_dategmtstr = date.toString();
      var gmtdatearr = hmd_dategmtstr.split(/ /);
      var chours = addZero(date.getHours().toString());
      var minutes = addZero(date.getMinutes().toString());
      var Seconds = addZero(date.getSeconds().toString());
      var hours = chours + ":" + minutes + ":" + Seconds;
      var gmtdate = gmtdatearr[0] + ", " + gmtdatearr[2] + " " + gmtdatearr[1] + " " + gmtdatearr[3] + " " + hours + " " + gmtdatearr[5].substring(0, gmtdatearr[5].length - 5);
      return gmtdate;
    }
    function addZero(s) {
      var result = "";
      if (s.length == 1) {
        result = "0" + s;
      } else {
        result = s;
      }
      return result;
    }
    function getTicket() {
      var hmd_req_resources_path = "/homedo-yonsuite-service/login";
      //注意需要大写
      var hmd_req_type = "POST";
      //需要处理部分------------------------end
      //加密参数----------------------------begin
      var hexcase = 0;
      var b64pad = "";
      var chrsz = 8;
      //加密参数----------------------------end
      var hmd_base_path = "https://open-api.homedo.com";
      var hmd_AccessKey = "yourKeyHere";
      var hmd_AccessSecret = "yourSecretHere";
      var hmd_contenttype = "application/json;charset=UTF-8";
      var hmd_md5 = "";
      var hmd_gmtdate = datetostring();
      var hmd_Authorization = "OPENPLATFORM ";
      var encodeStr = hmd_req_type.concat("\n", hmd_md5, "\n", hmd_contenttype, "\n", hmd_gmtdate, "\n", hmd_req_resources_path);
      //开始加密
      var signature = b64_hmac_sha1(hmd_AccessSecret, encodeStr) + "=";
      //使用Authorization
      var buildAuthorization = hmd_Authorization.concat(hmd_AccessKey, ":", signature);
      //组装请求头
      let header = {
        Authorization: buildAuthorization,
        Date: hmd_gmtdate,
        "Content-Type": hmd_contenttype,
        CanonicalizedResource: hmd_req_resources_path
      };
      var body = {
        mobile: "13854541101"
      };
      //请求数据
      let apiResponse = postman("post", hmd_base_path.concat(hmd_req_resources_path), JSON.stringify(header), JSON.stringify(body));
      var recdata = JSON.parse(apiResponse).data;
      var ticket1 = "";
      if (recdata != null) {
        var ticket1 = recdata.ticket;
      }
      return ticket1;
    }
    function hex_sha1(s) {
      return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
    }
    function b64_sha1(s) {
      return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
    }
    function str_sha1(s) {
      return binb2str(core_sha1(str2binb(s), s.length * chrsz));
    }
    function hex_hmac_sha1(key, data) {
      return binb2hex(core_hmac_sha1(key, data));
    }
    function b64_hmac_sha1(key, data) {
      return binb2b64(core_hmac_sha1(key, data));
    }
    function str_hmac_sha1(key, data) {
      return binb2str(core_hmac_sha1(key, data));
    }
    function sha1_vm_test() {
      return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
    }
    function core_sha1(x, len) {
      x[len >> 5] |= 0x80 << (24 - (len % 32));
      x[(((len + 64) >> 9) << 4) + 15] = len;
      var w = Array(80);
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;
      var e = -1009589776;
      for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for (var j = 0; j < 80; j++) {
          if (j < 16) w[j] = x[i + j];
          else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
          var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
          e = d;
          d = c;
          c = rol(b, 30);
          b = a;
          a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
      }
      return Array(a, b, c, d, e);
    }
    function sha1_ft(t, b, c, d) {
      if (t < 20) return (b & c) | (~b & d);
      if (t < 40) return b ^ c ^ d;
      if (t < 60) return (b & c) | (b & d) | (c & d);
      return b ^ c ^ d;
    }
    function sha1_kt(t) {
      return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
    }
    function core_hmac_sha1(key, data) {
      var bkey = str2binb(key);
      if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);
      var ipad = Array(16),
        opad = Array(16);
      for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5c5c5c5c;
      }
      var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
      return core_sha1(opad.concat(hash), 512 + 160);
    }
    function safe_add(x, y) {
      var lsw = (x & 0xffff) + (y & 0xffff);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xffff);
    }
    function rol(num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
    }
    function str2binb(str) {
      var bin = Array();
      var mask = (1 << chrsz) - 1;
      for (var i = 0; i < str.length * chrsz; i += chrsz) bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
      return bin;
    }
    function binb2str(bin) {
      var str = "";
      var mask = (1 << chrsz) - 1;
      for (var i = 0; i < bin.length * 32; i += chrsz) str += String.fromCharCode((bin[i >> 5] >>> (24 - (i % 32))) & mask);
      return str;
    }
    function binb2hex(binarray) {
      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) + hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
      }
      return str;
    }
    function binb2b64(binarray) {
      var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var str = "";
      for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet =
          (((binarray[i >> 2] >> (8 * (3 - (i % 4)))) & 0xff) << 16) |
          (((binarray[(i + 1) >> 2] >> (8 * (3 - ((i + 1) % 4)))) & 0xff) << 8) |
          ((binarray[(i + 2) >> 2] >> (8 * (3 - ((i + 2) % 4)))) & 0xff);
        for (var j = 0; j < 4; j++) {
          if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
          else str += tab.charAt((triplet >> (6 * (3 - j))) & 0x3f);
        }
      }
      return str;
    }
    return { apiResponse: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });