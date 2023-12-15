let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //当前时间
    var date = new Date(new Date().setHours(0, 0, 0, 0)); //获取当天零点的时间
    date = new Date().setTime(date);
    var startDate1 = new Date(date);
    var year = startDate1.getFullYear(); //定义年
    var month = startDate1.getMonth() + 1; //月
    var strDate = startDate1.getDate(); //日
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var h = (startDate1.getHours() < 10 ? "0" + startDate1.getHours() : startDate1.getHours()) + ":";
    var m = (startDate1.getMinutes() < 10 ? "0" + startDate1.getMinutes() : startDate1.getMinutes()) + ":";
    var s = startDate1.getSeconds() < 10 ? "0" + startDate1.getSeconds() : startDate1.getSeconds();
    //得到开始日期
    var startDate = year + "-" + month + "-" + strDate + " " + h + m + s;
    //得到结束日期
    var date1 = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000);
    date1 = new Date().setTime(date1);
    var endDate1 = new Date(date1);
    var year1 = endDate1.getFullYear(); //定义年
    var month1 = endDate1.getMonth() + 1; //月
    var endDate = endDate1.getDate(); //日
    if (month1 >= 1 && month1 <= 9) {
      month1 = "0" + month1;
    }
    if (endDate >= 0 && endDate <= 9) {
      endDate = "0" + endDate;
    }
    var h1 = (endDate1.getHours() < 10 ? "0" + endDate1.getHours() : endDate1.getHours()) + ":";
    var m1 = (endDate1.getMinutes() < 10 ? "0" + endDate1.getMinutes() : endDate1.getMinutes()) + ":";
    var s1 = endDate1.getSeconds() < 10 ? "0" + endDate1.getSeconds() : endDate1.getSeconds();
    var endDate = year1 + "-" + month1 + "-" + endDate + " " + h1 + m1 + s1;
    //获取特殊笔架信息 pc.cls.PresentationClass tenantId=i5px318c
    var treeDateSql = "select * from  pc.product.Product " + "where manageClass='1682303368183676935'"; //特殊笔架
    var treeDateSql2 = "select * from  pc.product.Product " + "where manageClass='1682303720372568071'"; //其他笔架
    var treeDate1 = ObjectStore.queryByYonQL(treeDateSql, "productcenter");
    var treeDate2 = ObjectStore.queryByYonQL(treeDateSql2, "productcenter");
    var treeDate = treeDate1.concat(treeDate2);
    //获取台账当日新增的数据（终端、组织、物料、）
    //遍历treedata
    function getJsonValue(obj, name) {
      var result = null;
      var value = null;
      for (var key in obj) {
        value = obj[key];
        if (key == name) {
          return value;
        } else {
          if (typeof value == "object") {
            result = getJsonValue(value, name);
          }
        }
      }
      return result;
    }
    var idsP1 = ""; //获取特殊笔架ids
    var defaultSKUIdsP1 = "";
    var codesP1 = "";
    var namesP1 = "";
    //编辑需要的sql条件  ids codes defaultSKUIds names
    for (var i = 0; i < treeDate1.length; i++) {
      var detail = treeDate1[i];
      if (i < treeDate1.length - 1) {
        var id = getJsonValue(detail, "id");
        idsP1 += JSON.stringify(id).replace(/"/g, "'") + ",";
        var defaultSKUId = getJsonValue(detail, "defaultSKUId");
        defaultSKUIdsP1 += JSON.stringify(defaultSKUId).replace(/"/g, "'") + ",";
        var code = getJsonValue(detail, "code");
        codesP1 += JSON.stringify(code).replace(/"/g, "'") + ",";
        var name = getJsonValue(detail, "name");
        namesP1 += JSON.stringify(name).replace(/"/g, "'") + ",";
      } else {
        var id = getJsonValue(detail, "id");
        idsP1 += JSON.stringify(id).replace(/"/g, "'");
        var defaultSKUId = getJsonValue(detail, "defaultSKUId");
        defaultSKUIdsP1 += JSON.stringify(defaultSKUId).replace(/"/g, "'");
        var code = getJsonValue(detail, "code");
        codesP1 += JSON.stringify(code).replace(/"/g, "'");
        var name = getJsonValue(detail, "name");
        namesP1 += JSON.stringify(name).replace(/"/g, "'");
      }
    }
    var idsP2 = ""; //获取其他笔架ids
    var defaultSKUIdsP2 = "";
    var codesP2 = "";
    var namesP2 = "";
    //编辑需要的sql条件  ids codes defaultSKUIds names
    for (var i = 0; i < treeDate2.length; i++) {
      var detail = treeDate2[i];
      if (i < treeDate2.length - 1) {
        var id = getJsonValue(detail, "id");
        idsP2 += JSON.stringify(id).replace(/"/g, "'") + ",";
        var defaultSKUId = getJsonValue(detail, "defaultSKUId");
        defaultSKUIdsP2 += JSON.stringify(defaultSKUId).replace(/"/g, "'") + ",";
        var code = getJsonValue(detail, "code");
        codesP2 += JSON.stringify(code).replace(/"/g, "'") + ",";
        var name = getJsonValue(detail, "name");
        namesP2 += JSON.stringify(name).replace(/"/g, "'") + ",";
      } else {
        var id = getJsonValue(detail, "id");
        idsP2 += JSON.stringify(id).replace(/"/g, "'");
        var defaultSKUId = getJsonValue(detail, "defaultSKUId");
        defaultSKUIdsP2 += JSON.stringify(defaultSKUId).replace(/"/g, "'");
        var code = getJsonValue(detail, "code");
        codesP2 += JSON.stringify(code).replace(/"/g, "'");
        var name = getJsonValue(detail, "name");
        namesP2 += JSON.stringify(name).replace(/"/g, "'");
      }
    }
    //把属性值转换成sql条件获取笔架数量发生变化的终端
    var ids = idsP1 + "," + idsP2;
    var datesql =
      "select * " +
      //                                              已发放数量          更新时间
      " from dsfa.assetstandbook.AssetsStandBook where provideQuantity > 0" +
      " and pubts>= '" +
      startDate +
      "' " +
      "and pubts < '" +
      endDate +
      "' and product in (" +
      ids +
      ")";
    //获取已经发放成功的数据
    var updateDataListP = ObjectStore.queryByYonQL(datesql, "yycrm");
    var updateDataList = JSON.stringify(updateDataListP);
    //获取发放笔架的终端id  terminal
    var terminalData = updateDataListP;
    var terminalIdsP1 = [];
    var orgsP1 = [];
    var idsPP1 = [];
    var provideQuantity1 = [];
    for (var i = 0; i < terminalData.length; i++) {
      var terminalDetail = terminalData[i];
      var terminalId = getJsonValue(terminalDetail, "terminal");
      if (!terminalIdsP1.includes(terminalId)) {
        terminalIdsP1.push(terminalId);
      } else {
        continue;
      }
      var org = getJsonValue(terminalDetail, "org");
      var sqlTS = "select COUNT(provideQuantity) from dsfa.assetstandbook.AssetsStandBook where terminal = '" + terminalId + "' and org = '" + org + "' and product in (" + idsP1 + ")";
      var sqlQT = "select COUNT(provideQuantity) from dsfa.assetstandbook.AssetsStandBook where terminal = '" + terminalId + "' and org = '" + org + "' and product in (" + idsP2 + ")";
      var sqlTS1 = sqlTS;
      var sqlQT1 = sqlQT;
      var countTS = ObjectStore.queryByYonQL(sqlTS, "yycrm"); //门店特殊笔架数量
      var countQT = ObjectStore.queryByYonQL(sqlQT, "yycrm"); //门店其他笔架数量
      var date = { terminalId: terminalId, org: org, countTS: countTS, countQT: countQT };
      provideQuantity1.push(date);
    }
    var provideQuantity = JSON.stringify(provideQuantity1);
    var appKey = "yourKeyHere";
    var appSecret = "yourSecretHere";
    var access_token = getToken(appKey, appSecret);
    var StroeLevel = "";
    var data = [];
    var responseAllDate = [];
    for (var i = 0; i < provideQuantity1.length; i++) {
      var storeLvelpI = provideQuantity1[i];
      var terminalId = getJsonValue(storeLvelpI, "terminalId");
      var org = getJsonValue(storeLvelpI, "org");
      var countTS = getJsonValue(storeLvelpI, "countTS");
      var TSprovideQuantity = getJsonValue(countTS[0], "provideQuantity");
      var countQT = getJsonValue(storeLvelpI, "countQT");
      var QTprovideQuantity = getJsonValue(countTS[0], "provideQuantity");
      var countAll = QTprovideQuantity + TSprovideQuantity;
      if (countTS >= 8 && countAll >= 14) {
        StroeLevel = "S";
      } else if (countTS >= 6 && countAll >= 12) {
        StroeLevel = "A";
      } else if (countTS >= 4 && countAll >= 8) {
        StroeLevel = "B";
      } else if (countAll >= 4) {
        StroeLevel = "C";
      } else {
        StroeLevel = "D";
      }
      if (terminalId) {
        var sql1 = "select id,latitude,longitude,terminalType,codebianma,org,name,code from aa.store.Store where id = '" + terminalId + "'";
        var data1 = ObjectStore.queryByYonQL(sql1, "yxybase");
        var sql2 = "select * from aa.store.SalesBusinessInfo where store = '" + terminalId + "'";
        var data2 = ObjectStore.queryByYonQL(sql2, "yxybase");
        var sql3 = "select * from aa.store.RelatedPerson where store = '" + terminalId + "'";
        var data3 = ObjectStore.queryByYonQL(sql3, "yxybase");
        var sql4 = "select * from aa.store.ShoppingMall where store = '" + terminalId + "'";
        var data4 = ObjectStore.queryByYonQL(sql4, "yxybase");
        let store = data1[0];
        var jsonstr = {
          codebianma: getJsonValue(store, "codebianma"),
          name: getJsonValue(store, "name"),
          terminalType: getJsonValue(store, "terminalType"),
          _status: "Update",
          org: getJsonValue(store, "org"),
          storeCustomItem: { define1: StroeLevel }
        };
        var codebianma = getJsonValue(store, "codebianma");
        var name = getJsonValue(store, "name");
        var terminalType = getJsonValue(store, "terminalType");
        var _status = "Update";
        var org = getJsonValue(store, "org");
        var storeCustomItem = { define1: StroeLevel };
        var newArr2 = data2.map((i) => {
          return {
            saleOrg: i.saleOrg,
            _status: "Update"
          };
        });
        var salesBusinessInfo = newArr2;
        var newArr3 = data3.map((i) => {
          return {
            saleOrg: i.saleOrg,
            _status: "Update"
          };
        });
        var RelatedPerson = newArr3;
        var storeLabels = [
          {
            _status: "Update"
          }
        ];
        var ShoppingMall1 = JSON.stringify(data4[0]); //ok
        var ShoppingMall = {
          name: getJsonValue(ShoppingMall1, "name"),
          latitude: getJsonValue(store, "latitude"),
          longitude: getJsonValue(store, "longitude"),
          _status: "Update"
        };
        var _status = "Update";
        var data = [];
        data["codebianma"] = codebianma;
        data["name"] = name;
        data["terminalType"] = terminalType;
        data["org"] = org;
        data["storeCustomItem"] = storeCustomItem;
        data["salesBusinessInfo"] = salesBusinessInfo;
        data["RelatedPerson"] = RelatedPerson;
        data["storeLabels"] = storeLabels;
        data["ShoppingMall"] = ShoppingMall;
        data["_status"] = _status;
        var json = {
          data: data
        };
        //调用API
        var apiResponse = postman("POST", "https://www.example.com/" + access_token, null, json);
        responseAllDate.push(apiResponse);
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
      } else {
        access_token = strResponse;
      }
      return access_token;
    }
    return {
      code: "200",
      message: "发送成功",
      data: responseAllDate
    };
  }
}
exports({ entryPoint: MyAPIHandler });