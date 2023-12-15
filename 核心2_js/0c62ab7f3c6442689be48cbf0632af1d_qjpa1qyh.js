let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let verifystate = data.verifystate;
    if (verifystate == "2") {
    } else {
      throw new Error("只有审批态单据可以生成销售合同");
    }
    var token = getToken("ce385f373c3a4e1891bd371c14ac9037", "272ee88202264d128c4b0630fa7d41b3");
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    //查询合同是否存在  存在则不能再次生成
    var oldctid = data.xiaoshouhetongid;
    if (oldctid !== undefined) {
      var ctcheck = {
        pageIndex: "1",
        pageSize: "10",
        isSum: "false",
        simpleVOs: [
          {
            value1: oldctid,
            op: "like",
            field: "id"
          }
        ]
      };
      let ctcheckpon = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(ctcheck));
      var ctcheckponjson = JSON.parse(ctcheckpon);
      var ctcheckcode = ctcheckponjson.code;
      if (ctcheckcode !== "200") {
        throw new Error("查询合同错误" + ctcheckponjson.message + JSON.stringify(ctcheck));
      } else {
        var ctcount = ctcheckponjson.data.recordCount;
        if (ctcount !== 0) {
          throw new Error("错误,已生成合同");
        }
      }
    }
    let bvolist = data.saledataList;
    let orgid = data.xiaoshouzuzhi;
    let StaffNew = data.StaffNew;
    let lirunlv = data.lirunlv;
    let zongchengbenjine = data.zongchengbenjine;
    let code = data.code;
    var memo = data.memo;
    if (memo === undefined) {
      memo = "";
    }
    let creatorId = data.creator;
    let ctname = data.xiaoshouhetongmingchen;
    let ctcode = data.ziduan9;
    var myDate = new Date();
    let vouchdate = dateFtt("yyyy-MM-dd hh:mm:ss", myDate);
    let kehu = data.kehu;
    let kehudianhua = data.kehudianhua;
    let kehudizhi = data.kehudizhi;
    let jihuashengxiaoriqi = data.jihuashengxiaoriqi;
    var bodyhead = {
      data: {
        salesOrgId: orgid,
        transactionTypeId: "yourIdHere",
        contractCtrlType: 1,
        name: ctname,
        code: "yuzhi",
        contractStatus: 0,
        signStatus: 0,
        status: 0,
        vouchdate: vouchdate,
        agentId: kehu,
        bussinessTelephone: kehudianhua,
        bussinessAddress: kehudizhi,
        invoiceAgentId: kehu,
        currency: "2390446438699520",
        natCurrency: "2390446438699520",
        exchangeRateType: "2390446197052672",
        exchRate: 1,
        planEffectiveDate: jihuashengxiaoriqi,
        isWfControlled: false,
        verifystate: 0,
        returncount: 0,
        totalPriceTax: 20,
        payMoneyOrigTaxfree: 19.05,
        totalTax: 0.95,
        totalOriReceipts: 0,
        creatorId: creatorId,
        memo: "利润率:" + lirunlv + "成本金额:" + zongchengbenjine + "报价单单号:" + code + "备注:" + memo,
        _status: "Insert"
      }
    };
    var jsonbs = [];
    for (let j = 0; j < bvolist.length; j++) {
      var bvo1 = bvolist[j];
      var jsonb = {
        _status: "Insert",
        productId: bvo1.wuliao,
        skuId: bvo1.bizFlowName,
        masterUnitId: bvo1.source_billtype,
        saleunitId: bvo1.source_billtype,
        cqtUnitId: bvo1.source_billtype,
        cqtUnitExchangeType: 0,
        invPriceExchRate: 1,
        saleUnitExchangeType: 0,
        invExchRate: 1,
        taxcCodeId: bvo1.taxccodeid,
        taxRate: bvo1.taxRate,
        stockOrgId: orgid,
        finOrgId: orgid,
        oriUnitPrice: bvo1.oriUnitPrice,
        oriTaxUnitPrice: bvo1.oriTaxUnitPrice,
        oriMoney: bvo1.oriMoney,
        oriSum: bvo1.oriSum,
        oriTax: bvo1.oriTax,
        natUnitPrice: bvo1.oriUnitPrice,
        natTaxUnitPrice: bvo1.oriTaxUnitPrice,
        natMoney: bvo1.oriMoney,
        natTax: bvo1.oriTax,
        natSum: bvo1.oriSum,
        qty: bvo1.qty,
        subQty: bvo1.qty,
        priceQty: bvo1.qty,
        idKey: null
      };
      jsonbs.push(jsonb);
    }
    bodyhead.data.childs = jsonbs;
    var jsonjson = JSON.stringify(bodyhead);
    let apiResponse1ct = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(bodyhead));
    var apiResponse1jsonct = JSON.parse(apiResponse1ct);
    var queryCode1ct = apiResponse1jsonct.code;
    if (queryCode1ct !== "200") {
      throw new Error("保存合同错误" + apiResponse1jsonct.message + JSON.stringify(bodyhead));
    } else {
      var billid = data.id;
      var xiaoshouhetongid = apiResponse1jsonct.data.id + "";
      var ctcode1 = apiResponse1jsonct.data.code;
      var object = { id: billid, xiaoshouhetongbianma: ctcode1, xiaoshouhetongid: xiaoshouhetongid };
      var res = ObjectStore.updateById("GT46349AT1.GT46349AT1.salebaojai", object);
    }
    throw new Error("生成销售合同成功!");
    //获取token方法
    function getToken(yourappkey, yourappsecrect) {
      //设置返回的access_token
      var access_token;
      // 获取token的url
      const token_url = "https://www.example.com/";
      const appkey = yourappkey;
      const appsecrect = yourappsecrect;
      // 当前时间戳
      let timestamp = new Date().getTime();
      const secrectdata = "appKey" + appkey + "timestamp" + timestamp;
      //加密算法------------------------------------------------------------------------------------------
      var CryptoJS =
        CryptoJS ||
        (function (h, i) {
          var e = {},
            f = (e.lib = {}),
            l = (f.Base = (function () {
              function a() {}
              return {
                extend: function (j) {
                  a.prototype = this;
                  var d = new a();
                  j && d.mixIn(j);
                  d.$super = this;
                  return d;
                },
                create: function () {
                  var a = this.extend();
                  a.init.apply(a, arguments);
                  return a;
                },
                init: function () {},
                mixIn: function (a) {
                  for (var d in a) a.hasOwnProperty(d) && (this[d] = a[d]);
                  a.hasOwnProperty("toString") && (this.toString = a.toString);
                },
                clone: function () {
                  return this.$super.extend(this);
                }
              };
            })()),
            k = (f.WordArray = l.extend({
              init: function (a, j) {
                a = this.words = a || [];
                this.sigBytes = j != i ? j : 4 * a.length;
              },
              toString: function (a) {
                return (a || m).stringify(this);
              },
              concat: function (a) {
                var j = this.words,
                  d = a.words,
                  c = this.sigBytes,
                  a = a.sigBytes;
                this.clamp();
                if (c % 4) for (var b = 0; b < a; b++) j[(c + b) >>> 2] |= ((d[b >>> 2] >>> (24 - 8 * (b % 4))) & 255) << (24 - 8 * ((c + b) % 4));
                else if (65535 < d.length) for (b = 0; b < a; b += 4) j[(c + b) >>> 2] = d[b >>> 2];
                else j.push.apply(j, d);
                this.sigBytes += a;
                return this;
              },
              clamp: function () {
                var a = this.words,
                  b = this.sigBytes;
                a[b >>> 2] &= 4294967295 << (32 - 8 * (b % 4));
                a.length = h.ceil(b / 4);
              },
              clone: function () {
                var a = l.clone.call(this);
                a.words = this.words.slice(0);
                return a;
              },
              random: function (a) {
                for (var b = [], d = 0; d < a; d += 4) b.push((4294967296 * h.random()) | 0);
                return k.create(b, a);
              }
            })),
            o = (e.enc = {}),
            m = (o.Hex = {
              stringify: function (a) {
                for (var b = a.words, a = a.sigBytes, d = [], c = 0; c < a; c++) {
                  var e = (b[c >>> 2] >>> (24 - 8 * (c % 4))) & 255;
                  d.push((e >>> 4).toString(16));
                  d.push((e & 15).toString(16));
                }
                return d.join("");
              },
              parse: function (a) {
                for (var b = a.length, d = [], c = 0; c < b; c += 2) d[c >>> 3] |= parseInt(a.substr(c, 2), 16) << (24 - 4 * (c % 8));
                return k.create(d, b / 2);
              }
            }),
            q = (o.Latin1 = {
              stringify: function (a) {
                for (var b = a.words, a = a.sigBytes, d = [], c = 0; c < a; c++) d.push(String.fromCharCode((b[c >>> 2] >>> (24 - 8 * (c % 4))) & 255));
                return d.join("");
              },
              parse: function (a) {
                for (var b = a.length, d = [], c = 0; c < b; c++) d[c >>> 2] |= (a.charCodeAt(c) & 255) << (24 - 8 * (c % 4));
                return k.create(d, b);
              }
            }),
            r = (o.Utf8 = {
              stringify: function (a) {
                try {
                  return decodeURIComponent(escape(q.stringify(a)));
                } catch (b) {
                  throw Error("Malformed UTF-8 data");
                }
              },
              parse: function (a) {
                return q.parse(unescape(encodeURIComponent(a)));
              }
            }),
            b = (f.BufferedBlockAlgorithm = l.extend({
              reset: function () {
                this._data = k.create();
                this._nDataBytes = 0;
              },
              _append: function (a) {
                "string" == typeof a && (a = r.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes;
              },
              _process: function (a) {
                var b = this._data,
                  d = b.words,
                  c = b.sigBytes,
                  e = this.blockSize,
                  g = c / (4 * e),
                  g = a ? h.ceil(g) : h.max((g | 0) - this._minBufferSize, 0),
                  a = g * e,
                  c = h.min(4 * a, c);
                if (a) {
                  for (var f = 0; f < a; f += e) this._doProcessBlock(d, f);
                  f = d.splice(0, a);
                  b.sigBytes -= c;
                }
                return k.create(f, c);
              },
              clone: function () {
                var a = l.clone.call(this);
                a._data = this._data.clone();
                return a;
              },
              _minBufferSize: 0
            }));
          f.Hasher = b.extend({
            init: function () {
              this.reset();
            },
            reset: function () {
              b.reset.call(this);
              this._doReset();
            },
            update: function (a) {
              this._append(a);
              this._process();
              return this;
            },
            finalize: function (a) {
              a && this._append(a);
              this._doFinalize();
              return this._hash;
            },
            clone: function () {
              var a = b.clone.call(this);
              a._hash = this._hash.clone();
              return a;
            },
            blockSize: 16,
            _createHelper: function (a) {
              return function (b, d) {
                return a.create(d).finalize(b);
              };
            },
            _createHmacHelper: function (a) {
              return function (b, d) {
                return g.HMAC.create(a, d).finalize(b);
              };
            }
          });
          var g = (e.algo = {});
          return e;
        })(Math);
      (function (h) {
        var i = CryptoJS,
          e = i.lib,
          f = e.WordArray,
          e = e.Hasher,
          l = i.algo,
          k = [],
          o = [];
        (function () {
          function e(a) {
            for (var b = h.sqrt(a), d = 2; d <= b; d++) if (!(a % d)) return !1;
            return !0;
          }
          function f(a) {
            return (4294967296 * (a - (a | 0))) | 0;
          }
          for (var b = 2, g = 0; 64 > g; ) e(b) && (8 > g && (k[g] = f(h.pow(b, 0.5))), (o[g] = f(h.pow(b, 1 / 3))), g++), b++;
        })();
        var m = [],
          l = (l.SHA256 = e.extend({
            _doReset: function () {
              this._hash = f.create(k.slice(0));
            },
            _doProcessBlock: function (e, f) {
              for (var b = this._hash.words, g = b[0], a = b[1], j = b[2], d = b[3], c = b[4], h = b[5], l = b[6], k = b[7], n = 0; 64 > n; n++) {
                if (16 > n) m[n] = e[f + n] | 0;
                else {
                  var i = m[n - 15],
                    p = m[n - 2];
                  m[n] = (((i << 25) | (i >>> 7)) ^ ((i << 14) | (i >>> 18)) ^ (i >>> 3)) + m[n - 7] + (((p << 15) | (p >>> 17)) ^ ((p << 13) | (p >>> 19)) ^ (p >>> 10)) + m[n - 16];
                }
                i = k + (((c << 26) | (c >>> 6)) ^ ((c << 21) | (c >>> 11)) ^ ((c << 7) | (c >>> 25))) + ((c & h) ^ (~c & l)) + o[n] + m[n];
                p = (((g << 30) | (g >>> 2)) ^ ((g << 19) | (g >>> 13)) ^ ((g << 10) | (g >>> 22))) + ((g & a) ^ (g & j) ^ (a & j));
                k = l;
                l = h;
                h = c;
                c = (d + i) | 0;
                d = j;
                j = a;
                a = g;
                g = (i + p) | 0;
              }
              b[0] = (b[0] + g) | 0;
              b[1] = (b[1] + a) | 0;
              b[2] = (b[2] + j) | 0;
              b[3] = (b[3] + d) | 0;
              b[4] = (b[4] + c) | 0;
              b[5] = (b[5] + h) | 0;
              b[6] = (b[6] + l) | 0;
              b[7] = (b[7] + k) | 0;
            },
            _doFinalize: function () {
              var e = this._data,
                f = e.words,
                b = 8 * this._nDataBytes,
                g = 8 * e.sigBytes;
              f[g >>> 5] |= 128 << (24 - (g % 32));
              f[(((g + 64) >>> 9) << 4) + 15] = b;
              e.sigBytes = 4 * f.length;
              this._process();
            }
          }));
        i.SHA256 = e._createHelper(l);
        i.HmacSHA256 = e._createHmacHelper(l);
      })(Math);
      (function () {
        var h = CryptoJS,
          i = h.enc.Utf8;
        h.algo.HMAC = h.lib.Base.extend({
          init: function (e, f) {
            e = this._hasher = e.create();
            "string" == typeof f && (f = i.parse(f));
            var h = e.blockSize,
              k = 4 * h;
            f.sigBytes > k && (f = e.finalize(f));
            for (var o = (this._oKey = f.clone()), m = (this._iKey = f.clone()), q = o.words, r = m.words, b = 0; b < h; b++) (q[b] ^= 1549556828), (r[b] ^= 909522486);
            o.sigBytes = m.sigBytes = k;
            this.reset();
          },
          reset: function () {
            var e = this._hasher;
            e.reset();
            e.update(this._iKey);
          },
          update: function (e) {
            this._hasher.update(e);
            return this;
          },
          finalize: function (e) {
            var f = this._hasher,
              e = f.finalize(e);
            f.reset();
            return f.finalize(this._oKey.clone().concat(e));
          }
        });
      })();
      function Base64stringify(wordArray) {
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;
        var map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        wordArray.clamp();
        var base64Chars = [];
        for (var i = 0; i < sigBytes; i += 3) {
          var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
          var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
          var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
          var triplet = (byte1 << 16) | (byte2 << 8) | byte3;
          for (var j = 0; j < 4 && i + j * 0.75 < sigBytes; j++) {
            base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
          }
        }
        var paddingChar = map.charAt(64);
        if (paddingChar) {
          while (base64Chars.length % 4) {
            base64Chars.push(paddingChar);
          }
        }
        return base64Chars.join("");
      }
      //加密算法------------------------------------------------------------------------------------------
      var sha256 = CryptoJS.HmacSHA256(secrectdata, appsecrect);
      const base64 = Base64stringify(sha256);
      // 获取签名
      const signature = encodeURIComponent(base64);
      const requestUrl = token_url + "?appKey=" + appkey + "&timestamp=" + timestamp + "&signature=" + signature;
      const header = {
        "Content-Type": "application/json"
      };
      var strResponse = postman("GET", requestUrl, JSON.stringify(header), null);
      //获取token
      var responseObj = JSON.parse(strResponse);
      if ("00000" == responseObj.code) {
        access_token = responseObj.data.access_token;
      }
      return access_token;
    }
    function dateFtt(fmt, date) {
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": "00", //小时
        "m+": "00", //分
        "s+": "00", //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return fmt;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });