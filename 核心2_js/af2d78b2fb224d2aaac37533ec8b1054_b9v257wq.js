let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let res = { code: 200, log: "" };
    try {
      let url = "http://49.232.238.93";
      let appKey = "yourKeyHere";
      let appSecret = "yourSecretHere";
      let hotelGroupCode = "MCSCG";
      let token = "";
      let signStr = "";
      let header = { "Content-Type": "application/x-www-form-urlencoded" };
      //获取token
      let body = {};
      body.appKey = appKey;
      body.usercode = "yjyMCSCGhy";
      body.password = "yourpasswordHere";
      body.method = "user.login";
      body.v = "3.0";
      body.format = "json";
      body.hotelGroupCode = hotelGroupCode;
      body.local = "zh_CN";
      //接口调用参数签名1
      signStr = this.GetSignStr(body, appSecret);
      body.sign = this.GetSign(signStr);
      let strPost = this.GetPostData(body);
      let strResponse = postman("post", url + ":8102/ipmsgroup/router", JSON.stringify(header), strPost);
      let response = JSON.parse(strResponse);
      if (response.resultCode == 0) {
        token = response.resultInfo;
      } else {
        throw new Error("token:" + response.resultMsg);
      }
      //补充必要参数
      body = request.body;
      body.hotelGroupCode = hotelGroupCode;
      body.appKey = appKey;
      body.sessionId = token;
      signStr = this.GetSignStr(body, appSecret);
      body.sign = this.GetSign(signStr);
      strPost = this.GetPostData(body);
      strResponse = postman("post", url + request.url, JSON.stringify(header), strPost);
      try {
        //日志记录异常不管
        let func = extrequire("AT18623B800920000A.rule.getGateway");
        let getGatewayInfo = func.execute();
        let baseurl = getGatewayInfo.data.gatewayUrl; //网关
        let poststr = { cbustype: request.cbustype || "", ccode: request.ccode || "", ctype: "绿云crm", url: url + request.url, post: strPost, res: strResponse };
        openLinker("POST", baseurl + "/b9v257wq/jz/crmjz01/logSave", "AT18623B800920000A", JSON.stringify(poststr));
      } catch (e) {}
      response = JSON.parse(strResponse);
      if (response.resultCode != undefined && response.resultCode != 0) {
        throw new Error(response.resultMsg);
      } else {
        res.data = response;
      }
    } catch (e) {
      res.code = 999;
      res.msg = "调用异常" + e.toString();
    } finally {
      return res;
    }
  }
  GetPostData(body) {
    let bodystr = "";
    Object.keys(body).forEach(function (key) {
      bodystr += key + "=" + body[key] + "&";
    });
    bodystr = bodystr.substring(0, bodystr.length - 1);
    return bodystr;
  }
  GetSignStr(parms, appSecret) {
    var s = "";
    Object.keys(parms)
      .sort()
      .forEach(function (key) {
        s += key + parms[key];
      });
    s = appSecret + s + appSecret;
    return s;
  }
  GetSign(s) {
    try {
      var i,
        j,
        t,
        r = [],
        c,
        x;
      for (i = 0; i < s.length; i++)
        if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
        else if (c < 0x800) r.push(0xc0 + ((c >> 6) & 0x1f), 0x80 + (c & 0x3f));
        else {
          if ((x = c ^ 0xd800) >> 10 == 0)
            //对四字节UTF-16转换为Unicode
            (c = (x << 10) + (s.charCodeAt(++i) ^ 0xdc00) + 0x10000), r.push(0xf0 + ((c >> 18) & 0x7), 0x80 + ((c >> 12) & 0x3f));
          else r.push(0xe0 + ((c >> 12) & 0xf));
          r.push(0x80 + ((c >> 6) & 0x3f), 0x80 + (c & 0x3f));
        }
      var data = new Uint8Array(r);
      var l = (((data.length + 8) >>> 6) << 4) + 16,
        s = new Uint8Array(l << 2);
      s.set(new Uint8Array(data.buffer)), (s = new Uint32Array(s.buffer));
      for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2);
      s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
      s[l - 1] = data.length << 3;
      var w = [],
        f = [
          function () {
            return (m[1] & m[2]) | (~m[1] & m[3]);
          },
          function () {
            return m[1] ^ m[2] ^ m[3];
          },
          function () {
            return (m[1] & m[2]) | (m[1] & m[3]) | (m[2] & m[3]);
          },
          function () {
            return m[1] ^ m[2] ^ m[3];
          }
        ],
        rol = function (n, c) {
          return (n << c) | (n >>> (32 - c));
        },
        k = [1518500249, 1859775393, -1894007588, -899497514],
        m = [1732584193, -271733879, null, null, -1009589776];
      (m[2] = ~m[0]), (m[3] = ~m[1]);
      for (i = 0; i < s.length; i += 16) {
        var o = m.slice(0);
        for (j = 0; j < 80; j++)
          (w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)),
            (t = (rol(m[0], 5) + f[(j / 20) | 0]() + m[4] + w[j] + k[(j / 20) | 0]) | 0),
            (m[1] = rol(m[1], 30)),
            m.pop(),
            m.unshift(t);
        for (j = 0; j < 5; j++) m[j] = (m[j] + o[j]) | 0;
      }
      t = new DataView(new Uint32Array(m).buffer);
      for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);
      var hex = Array.prototype.map
        .call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
          return (e < 16 ? "0" : "") + e.toString(16);
        })
        .join("");
      return hex.toUpperCase();
    } catch (e) {
      return e.toString();
    }
  }
}
exports({ entryPoint: MyAPIHandler });