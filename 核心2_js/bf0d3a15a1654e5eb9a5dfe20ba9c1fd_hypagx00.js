let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var queryStoreID = request.storeID;
    var queryDate = request.date1;
    var message = "拉取成功";
    var yzUrl = "https://www.example.com/";
    //新测试环境
    //生产环境
    var yourappkey = "yourkeyHere";
    var yourappsecrect = "7268c112fe2049b6a812fa59c26e6123";
    //本地
    var access_token = getToken(yourappkey, yourappsecrect);
    //结算方式对照列表查询
    var settlemethodcontrastUrl = "https://www.example.com/" + access_token;
    //企业现金账户详情查询
    var cashAccountUrl = "https://www.example.com/" + access_token;
    //企业银行账户详情查询
    var cardAccountUrL = "https://www.example.com/" + access_token;
    var appId = "yourIdHere";
    var app = "yongyou-ys";
    var header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    //营业日期
    var bussDate = replace(queryDate, "-", "");
    //获取所有的门店id
    var sign = MD5Encode(appId + bussDate + queryStoreID);
    var body = {
      body: {
        storeId: queryStoreID,
        bussDate: queryDate,
        sign: sign
      },
      header: {
        app: "yongyou-ys"
      }
    };
    console.log("请求入参: {}", JSON.stringify(body));
    var queryResponse = postman("post", yzUrl, JSON.stringify(header), JSON.stringify(body));
    var queryResponseJson = JSON.parse(queryResponse);
    console.log("返回信息: {}", JSON.stringify(queryResponseJson));
    var queryCode = queryResponseJson.header.code;
    if (queryCode == "10000") {
      //查询成功，拼接日结单数据
      let body = queryResponseJson.body;
      //转换组织信息
      let erporgcode = "";
      let erporgname = "";
      let orgId = "";
      let queryYSOrgInfo = "select orgCode,ysOrgName,ysOrgCode from GT31971AT37.GT31971AT37.orgCodeConfig where yzOrgCode = '" + body.storeId + "' and dr='0'";
      let queryYSOrgInfoResponse = ObjectStore.queryByYonQL(queryYSOrgInfo);
      if (queryYSOrgInfoResponse.length == 1) {
        erporgcode = queryYSOrgInfoResponse[0].orgCode;
        erporgname = queryYSOrgInfoResponse[0].ysOrgName;
        orgId = queryYSOrgInfoResponse[0].ysOrgCode;
      }
      let settleBody = {
        pageSize: 100,
        pageIndex: 0,
        orgId: [orgId]
      };
      //获取门店的现金账户和银行账户
      let cashAccountName = "";
      let cardAccountName = "";
      let cash = "";
      let card = "";
      let settlemethodcontrasResult = postman("post", settlemethodcontrastUrl, JSON.stringify(header), JSON.stringify(settleBody));
      let settlemethodcontrasResultJson = JSON.parse(settlemethodcontrasResult);
      let settleMethodList = settlemethodcontrasResultJson.data.recordList;
      settleMethodList.forEach((settleMethod) => {
        if (settleMethod.settleMethodId_name == "现金") {
          cashAccountName = settleMethod.cashAccountId_name;
          let cashAccountId = settleMethod.cashAccountId;
          let cashAccountUrlResult = postman("get", cashAccountUrl + "&id=" + URLEncoder(cashAccountId), null, null);
          let cashAccountUrlResultJson = JSON.parse(cashAccountUrlResult);
          cash = cashAccountUrlResultJson.data.code;
        } else if (
          settleMethod.settleMethodId_name == "银行卡（卡户）" ||
          settleMethod.settleMethodId_name == "银行卡（收入公户）" ||
          settleMethod.settleMethodId_name == "银行卡（支出公户）" ||
          settleMethod.settleMethodId_name == "银行卡（公户）"
        ) {
          cardAccountName = settleMethod.bankAccountId_name;
          let cardAccountId = settleMethod.bankAccountId;
          let cardAccountUrlResult = postman("get", cardAccountUrL + "&id=" + URLEncoder(cardAccountId), null, null);
          let cardAccountUrlResultJson = JSON.parse(cardAccountUrlResult);
          card = cardAccountUrlResultJson.data.account;
        }
      });
      //销售收入明细
      let saleArray = new Array();
      let saleIncome = body.payVOList;
      saleIncome.forEach((saleIncomeDetail, index) => {
        let payTypeCode = "";
        let payTypeName = "";
        let dealmethod = "";
        let yzPayID = saleIncomeDetail.payId;
        let queryPayTypeCodeYS = "select yspaycode,payTypeName,dealmethod from GT31971AT37.GT31971AT37.payTypeConfig where yzpaycode = '" + yzPayID + "' and dr='0'";
        let queryPayTypeResponse = ObjectStore.queryByYonQL(queryPayTypeCodeYS);
        if (queryPayTypeResponse.length == 1) {
          payTypeCode = queryPayTypeResponse[0].yspaycode;
          payTypeName = queryPayTypeResponse[0].payTypeName;
          if (queryPayTypeResponse[0].dealmethod == "1") {
            dealmethod = "应收";
          } else if (queryPayTypeResponse[0].dealmethod == "2") {
            dealmethod = "收款";
          }
        }
        let saleYS = {};
        //现金001  银行卡002
        if (payTypeCode == "001") {
          saleYS = {
            rownum: index + 1,
            paytypecode: payTypeCode,
            paytypename: payTypeName,
            custcode: payTypeCode,
            custname: payTypeName,
            arapdealmethod: dealmethod,
            realmoney: saleIncomeDetail.payAmount,
            aftermoveaccmoney: saleIncomeDetail.payAmount,
            cash: cash,
            cashAccountName: cashAccountName
          };
        } else if (payTypeCode == "002" || payTypeCode == "0021") {
          saleYS = {
            rownum: index + 1,
            paytypecode: payTypeCode,
            paytypename: payTypeName,
            custcode: payTypeCode,
            custname: payTypeName,
            arapdealmethod: dealmethod,
            realmoney: saleIncomeDetail.payAmount,
            aftermoveaccmoney: saleIncomeDetail.payAmount,
            card: card,
            cardAccountName: cardAccountName
          };
        } else {
          saleYS = {
            rownum: index + 1,
            paytypecode: payTypeCode,
            paytypename: payTypeName,
            custcode: payTypeCode,
            custname: payTypeName,
            arapdealmethod: dealmethod,
            realmoney: saleIncomeDetail.payAmount,
            aftermoveaccmoney: saleIncomeDetail.payAmount
          };
        }
        saleArray.push(saleYS);
      });
      //会员收入明细
      let vipArray = new Array();
      let vipIncome = body.storeVOList;
      let vipIncomeCount = 0;
      vipIncome.forEach((vipDetail, index) => {
        vipIncomeCount = vipDetail.payAmount * 1 + vipIncomeCount * 1;
        //做支付编码转换
        let arapdealmethod = "";
        let yzPayID = vipDetail.payId;
        let payTypeCode = "";
        let payTypeName = "";
        let queryPayTypeCodeYS = "select yspaycode,payTypeName,dealmethod from GT31971AT37.GT31971AT37.payTypeConfig where yzpaycode = '" + yzPayID + "' and dr='0'";
        let queryPayTypeResponse = ObjectStore.queryByYonQL(queryPayTypeCodeYS);
        if (queryPayTypeResponse.length == 1) {
          payTypeCode = queryPayTypeResponse[0].yspaycode;
          payTypeName = queryPayTypeResponse[0].payTypeName;
          if (queryPayTypeResponse[0].dealmethod == "1") {
            arapdealmethod = "应收";
          } else if (queryPayTypeResponse[0].dealmethod == "2") {
            arapdealmethod = "收款";
          }
        }
        //现金025  银行卡026
        let vipYS = {};
        if (payTypeCode == "025") {
          vipYS = {
            rownum: index + 1,
            incomemoney: vipDetail.payAmount,
            amountmoney: vipDetail.payAmount,
            arapdealmethod: arapdealmethod,
            payTypeCode: payTypeCode,
            payTypeName: payTypeName,
            cash: cash,
            cashAccountName: cashAccountName
          };
        } else if (payTypeCode == "026") {
          vipYS = {
            rownum: index + 1,
            incomemoney: vipDetail.payAmount,
            amountmoney: vipDetail.payAmount,
            arapdealmethod: arapdealmethod,
            payTypeCode: payTypeCode,
            payTypeName: payTypeName,
            card: card,
            cardAccountName: cardAccountName
          };
        } else {
          vipYS = {
            rownum: index + 1,
            incomemoney: vipDetail.payAmount,
            amountmoney: vipDetail.payAmount,
            arapdealmethod: arapdealmethod,
            payTypeCode: payTypeCode,
            payTypeName: payTypeName
          };
        }
        vipArray.push(vipYS);
      });
      //优惠明细
      let discountDetail = body.discountDetail;
      //优惠金额
      let discountmoney =
        discountDetail.bussDiscAmount * 1 +
        discountDetail.bussGiveAmount * 1 +
        discountDetail.bussSingAmount * 1 +
        discountDetail.bussMoliAmount * 1 +
        discountDetail.dishGiveAmount * 1 +
        discountDetail.bussNormAmount * 1;
      let discountDetailYS = {
        rownum: 1,
        discount: discountDetail.bussDiscAmount,
        exemption: discountDetail.bussGiveAmount,
        singleDiscount: discountDetail.bussSingAmount,
        wipeOff: discountDetail.bussMoliAmount,
        desert: discountDetail.dishGiveAmount,
        vipDiscount: discountDetail.bussNormAmount
      };
      //日结单号
      //销售收入明细中同一客户同一支付方式同一财务处理方式的数据进行合并
      for (let i = 0; i < saleArray.length; i++) {
        let saleA = saleArray[i];
        for (let j = i + 1; j < saleArray.length; j++) {
          let saleB = saleArray[j];
          if (saleA.paytypecode == saleB.paytypecode && saleA.custcode == saleB.custcode && saleA.arapdealmethod == saleB.arapdealmethod) {
            saleA.realmoney = saleA.realmoney * 1 + saleB.realmoney * 1;
            saleA.aftermoveaccmoney = saleA.aftermoveaccmoney * 1 + saleB.aftermoveaccmoney * 1;
            saleArray.splice(j, 1);
            --j;
          }
        }
      }
      //合并后rownum问题
      saleArray.forEach((salemoneydetail, index) => {
        salemoneydetail.rownum = index + 1;
      });
      //会员收入明细中同一客户同一支付方式同一财务处理方式的数据进行合并
      for (let i = 0; i < vipArray.length; i++) {
        let saleA = vipArray[i];
        for (let j = i + 1; j < vipArray.length; j++) {
          let saleB = vipArray[j];
          if (saleA.payTypeCode == saleB.payTypeCode && saleA.arapdealmethod == saleB.arapdealmethod) {
            saleA.incomemoney = saleA.incomemoney * 1 + saleB.incomemoney * 1;
            saleA.amountmoney = saleA.amountmoney * 1 + saleB.amountmoney * 1;
            vipArray.splice(j, 1);
            --j;
          }
        }
      }
      //合并后rownum问题
      vipArray.forEach((vipdetail, index) => {
        vipdetail.rownum = index + 1;
      });
      //日结单主表信息
      let dayCloseBill = {
        org_id_name: erporgname,
        org_id: orgId,
        storecode: erporgcode,
        store: erporgname,
        erporgcode: erporgcode,
        erporgname: erporgname,
        businessdate: body.bussDate,
        dayclosedate: body.bussDate,
        salemoney: body.bussBillAmount,
        vipincome: vipIncomeCount,
        discountmoney: discountmoney,
        salemoneydetailYSList: saleArray,
        memberincomeYSList: vipArray,
        dayDiscountYSList: discountDetailYS
      };
      //一个门店一天只能有一条数据
      let queryDayDataExit = "select * from GT31971AT37.GT31971AT37.dayclosebillYS where storecode = '" + erporgcode + "' and businessdate = '" + body.bussDate + "' and dr='0'";
      let queryDayDataExitResponse = ObjectStore.queryByYonQL(queryDayDataExit);
      //查询到结果，当前日期日结单已经有了，不允许再插入
      if (queryDayDataExitResponse.length != 0) {
        message = "该门店当前日期的日结单已存在";
        return { message: message };
      }
      try {
        ObjectStore.insert("GT31971AT37.GT31971AT37.dayclosebillYS", dayCloseBill, "4fce3fac");
      } catch (err) {
        console.error(err);
      }
    }
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
    return { message: message };
  }
}
exports({ entryPoint: MyAPIHandler });