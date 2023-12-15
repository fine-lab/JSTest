let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.sendDataTosourcePO.data;
    let purchaseOrders = data.purchaseOrders;
    let pubDateStr = "";
    if (data.headParallel && data.headParallel[0].pubDate) {
      let pubDate = data.headParallel[0].pubDate;
      pubDateStr = getDate(pubDate);
    }
    let poConfirmTimeStr = "";
    let poActiveDateStr = "";
    if (data.headParallel && data.headParallel[0].vendorConfirmTime) {
      let poConfirmTime = data.headParallel[0].vendorConfirmTime;
      poConfirmTimeStr = getDate(poConfirmTime);
    }
    if (data.auditDate) {
      let poActiveDate = data.auditDate;
      poActiveDateStr = getDate(poActiveDate);
    }
    let sconfigFunc = extrequire("GT37595AT2.commonFun.sConfigFunc");
    let sconfig = sconfigFunc.execute();
    //要货计划表id
    let shippingScheduleId = data.extend71;
    if (!shippingScheduleId) {
      return {};
    }
    //单据号
    let batch = data.code;
    let lineDataList = [];
    let order_remarkTemp = "";
    if (purchaseOrders.length > 0) {
      for (var i = 0; i < purchaseOrders.length; i++) {
        let purchaseOrder = purchaseOrders[i];
        //批次号
        let batchNo = purchaseOrder.extend118;
        let priceSql = "select  batch_time from GT18AT2.GT18AT2.batch_price where code = " + batchNo;
        var priceRes = ObjectStore.queryByYonQL(priceSql, "developplatform");
        let batch_time = null;
        if (priceRes.length > 0) {
          batch_time = priceRes[0].batch_time;
        }
        //价格(PO的含税单价)
        let price = purchaseOrder.oriTaxUnitPrice;
        let extendOrdersMapping = purchaseOrder.extendOrdersMapping;
        let orderSubject = purchaseOrder.orderSubject;
        orderSubject = data.headParallel[0].orderSubject;
        order_remarkTemp = orderSubject;
        let lineData = {
          extendOrdersMapping: extendOrdersMapping || "",
          _status: "Update",
          batch: batch,
          supplier_receives_ceg_time: batch_time,
          price: price,
          poCode: batch,
          poSendDate: pubDateStr,
          poStatus: "已审核",
          po_confirm_time: poConfirmTimeStr,
          order_remark: orderSubject,
          po_activation_time: poActiveDateStr
        };
        lineDataList.push(lineData);
      }
    }
    //查询要货计划表数据
    let shippingschedulebSql =
      "select *, main.code as code, main.id as mainId,main.creation_date as pushVendorTime from	GT37595AT2.GT37595AT2.shippingscheduleb left join GT37595AT2.GT37595AT2.shippingschedule main " +
      " on main.id = shippingschedule_id  where shippingschedule_id = '" +
      shippingScheduleId +
      "'";
    var shippingschedulebRes = ObjectStore.queryByYonQL(shippingschedulebSql, "developPlatform");
    let sendData = [];
    let cabinetMap = new Map();
    for (var i = 0; i < lineDataList.length; i++) {
      for (var j = 0; j < shippingschedulebRes.length; j++) {
        if (lineDataList[i].extendOrdersMapping && shippingschedulebRes[j].orders_mapping && lineDataList[i].extendOrdersMapping == shippingschedulebRes[j].orders_mapping) {
          lineDataList[i].id = shippingschedulebRes[j].id;
          if (!shippingschedulebRes[j].mainId) {
            throw new Error("要货计划主表不存在,请检查数据");
          }
          if (shippingschedulebRes[j].orderMode == "6035") {
            // 算力模式为6035不发送供应商
            break;
          }
          let itemSql = "";
          // 风冷整机柜编码相同的，去重，只发送一条
          if (shippingschedulebRes[j].cabinetNodeCode) {
            // 风冷整机
            // 已经收集了一条，不需在添加相同风冷整机柜编码的数据
            if (cabinetMap.has(shippingschedulebRes[j].mainId + "_" + shippingschedulebRes[j].cabinetNodeCode)) {
              continue;
            }
            itemSql =
              "select manageClass.code,manageClass.name,detail.shortName,detail.purchasePriceUnit.code,detail.purchaseUnit.code,unit.code,* from pc.product.Product where detail.stopstatus = 'false' and detail.shortName = '" +
              shippingschedulebRes[j].cabinetNodeCode +
              "'";
          } else {
            itemSql =
              "select manageClass.code,manageClass.name,detail.shortName,detail.purchasePriceUnit.code,detail.purchaseUnit.code,unit.code,* from pc.product.Product where detail.stopstatus = 'false' and model = '" +
              shippingschedulebRes[j].itemCode +
              "'";
          }
          //构造推送供应商数据
          let htData = {};
          htData.PO_CONFIRM_DATE = poConfirmTimeStr;
          htData.PO_ACTIVE_DATE = poActiveDateStr;
          htData.DEMAND_ORDER = shippingschedulebRes[j].item_type;
          htData.BATCH_NUMBER = shippingschedulebRes[j].batchNumber;
          htData.GROUP_ID = shippingschedulebRes[j].mainId;
          htData.ACTION_TYPE = "UPDATE";
          htData.SL_VENDOR = shippingschedulebRes[j].deviceSupplier;
          htData.ORDER_PRIORITY = shippingschedulebRes[j].orderPriority;
          htData.PROCUREMENT_MODEL = shippingschedulebRes[j].orderMode;
          htData.ROOM_ID = shippingschedulebRes[j].equipmentRoom;
          htData.SHIP_TO_ADDRESS = shippingschedulebRes[j].shipToLocation;
          htData.SHIP_TO_CONTACT = shippingschedulebRes[j].shipToContact;
          htData.SHIP_TO_CONTACT_TEL = shippingschedulebRes[j].shipToContactPhone;
          if (!shippingschedulebRes[j].country) {
            htData.SHIP_TO_CONTRY = "China";
          } else {
            htData.SHIP_TO_CONTRY = shippingschedulebRes[j].country;
          }
          htData.SHIP_TO_PROVINCE = shippingschedulebRes[j].province;
          htData.SHIP_TO_CITY = shippingschedulebRes[j].city;
          htData.CUSTOMGER_PO_NO = batch || "";
          htData.CUSTOMER_PO_STATUS = "已审核";
          // 算力供应商非SS的，客户编码、客户名称都不传值，传空
          if (shippingschedulebRes[j].deviceSupplier == "SS") {
            htData.CUSTOMER_CODE = sconfig.BASE.CUSTOMER_CODE;
            htData.CUSTOMER_NAME = sconfig.BASE.CUSTOMER_NAME;
          } else {
            htData.CUSTOMER_CODE = "";
            htData.CUSTOMER_NAME = "";
          }
          htData.SHIPPING_METHOD = shippingschedulebRes[j].shippingMethod;
          htData.FOB = "";
          htData.FOB_ADDRESS = "";
          htData.ORIG_CPD = shippingschedulebRes[j].cpd;
          htData.ORIG_ESD = shippingschedulebRes[j].esd;
          htData.ORIG_ETA = shippingschedulebRes[j].eta;
          htData.RECEIVE_DEMAND_DATE = shippingschedulebRes[j].pushVendorTime;
          htData.RECEIVE_CEG_PRICE_DATE = lineDataList[i].supplier_receives_ceg_time;
          htData.CURRENCY = "CNY";
          htData.DEMAND_LINE_ID = shippingschedulebRes[j].poLineId;
          htData.PRODUCT_NAME = shippingschedulebRes[j].productCode;
          htData.ATP_ORDER = shippingschedulebRes[j].atpOrder;
          htData.CATEGORY = shippingschedulebRes[j].itemCategory;
          htData.DATA_CENTRE = shippingschedulebRes[j].dcNameCn;
          htData.ORIGINAL_RSD = shippingschedulebRes[j].rsd;
          if (shippingschedulebRes[j].rsd2) {
            htData.LATEST_RSD = shippingschedulebRes[j].rsd2;
          } else {
            htData.LATEST_RSD = shippingschedulebRes[j].rsd;
          }
          htData.PRODUCT_TYPE = shippingschedulebRes[j].productType;
          htData.CUSTOMIZATION_FLAG = shippingschedulebRes[j].customLogo;
          htData.MATCH_QTY = shippingschedulebRes[j].orderedQuantity;
          htData.DESCRIPTION = shippingschedulebRes[j].itemRemark;
          htData.UNIT_PRICE = lineDataList[i].price + "";
          htData.QTY = shippingschedulebRes[j].oriRequestedQuantity;
          htData.ATTRIBUTE1 = "";
          htData.ATTRIBUTE2 = "";
          htData.ATTRIBUTE3 = "";
          htData.ATTRIBUTE4 = "";
          htData.ATTRIBUTE5 = "";
          // 根据SL物料编码查询物料编码
          let itemRes = ObjectStore.queryByYonQL(itemSql, "productcenter");
          // 没有物料编码不发送供应商
          let itemCodeChange = "";
          let purchasePriceUnit = "";
          let purchaseUnit = "";
          let unitCode = "";
          let manageClassName = "";
          if (itemRes && itemRes.length > 0 && itemRes[0].code) {
            itemCodeChange = itemRes[0].code;
            purchasePriceUnit = itemRes[0].detail_purchasePriceUnit_code;
            purchaseUnit = itemRes[0].detail_purchaseUnit_code;
            unitCode = itemRes[0].unit_code;
            manageClassName = itemRes[0].manageClass_name;
            htData.MODEL_NUMBER = "";
            htData.ORIG_ITEM_NUMBER = itemRes[0].code;
            if (shippingschedulebRes[j].cabinetNodeCode) {
              // 风冷整机
              htData.MODEL_NUMBER = itemRes[0].code;
              htData.ORIG_ITEM_NUMBER = "";
            }
          }
          if (!itemRes[0].code) {
            continue; // 物料编码找不到，不需发送供应商
          }
          sendData.push(htData);
          cabinetMap.set(shippingschedulebRes[j].mainId + "_" + shippingschedulebRes[j].cabinetNodeCode, 1);
        }
      }
    }
    for (var k = 0; k < lineDataList.length; k++) {
      delete lineDataList[k].extendOrdersMapping;
    }
    let updateData = { id: shippingScheduleId, order_remark: order_remarkTemp, shippingschedulebList: lineDataList };
    var res = AppContext();
    var resJson = JSON.parse(res);
    var tenantId = resJson.currentUser.tenantId;
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    // 发送供应商
    let htUrl = config.BASE.HT_URL + config.BASE.HT_URL_SHI;
    let Appkey = config.BASE.APPKEY;
    let appsecret = config.BASE.APPSECRET;
    let access_token = getToken(Appkey, appsecret);
    let updateurl = "https://www.example.com/" + tenantId + "/product_ref/product_ref_01/updateShipping?access_token=" + access_token;
    let apiResponse = postman("post", updateurl, null, JSON.stringify(updateData));
    let apiResponseObj = JSON.parse(apiResponse);
    if (!sendData || sendData.length == 0) {
      return { status: 1, data: { message: "数据为空！请检查数据" } };
    }
    let htBody = { DATA: sendData };
    let htHeader = {};
    if (config.BASE.SEND_CODE == "HT") {
      let times = getTime();
      let secret = SHA256Encode(times + config.BASE.HT_TOKEN);
      htHeader = { "Content-Type": "application/json", timestamp: times, ciphertext: secret };
    } else {
      let encodeStr = config.AUTH_INFO.USER + ":" + config.AUTH_INFO.KEY;
      let authorization = "Basic " + Base64Encode(encodeStr);
      htHeader = { "Content-Type": "application/json", Authorization: authorization };
    }
    let exeHtRequestDate = getDate();
    let htResponse = postman("post", htUrl, JSON.stringify(htHeader), JSON.stringify(htBody));
    let htResponseObj = JSON.parse(htResponse);
    let exeHtResponseDate = getDate();
    // 日志对象构造
    let logObjDetail = {
      methodName: "savePurPushHT",
      url: htUrl,
      requestParams: JSON.stringify(htBody),
      requestTime: exeHtRequestDate
    };
    logObjDetail.respTime = exeHtResponseDate;
    logObjDetail.respResult = JSON.stringify(htResponseObj);
    //获取配置信息
    let func = extrequire("PU.pubFunciton.configFun");
    let funRes = func.execute();
    try {
      openLinker("POST", funRes.BASE.gatewayUrl + funRes.BASE.logUrl, "PU", JSON.stringify({ logObj: logObjDetail }));
    } catch (e) {}
    return { status: 1 };
    function getTime() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      return date.getTime();
    }
    function getDate(nowDate) {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      if (!nowDate) {
        nowDate = new Date().getTime();
      } else {
        if (nowDate.toString().indexOf("-") > -1) {
          let date = new Date(nowDate);
          nowDate = date.getTime();
        }
      }
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      var timeStr = date.getFullYear() + "-";
      if (date.getMonth() < 9) {
        // 月份从0开始的
        timeStr += "0";
      }
      timeStr += date.getMonth() + 1 + "-";
      timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      timeStr += " ";
      timeStr += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      timeStr += ":";
      timeStr += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      timeStr += ":";
      timeStr += date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return timeStr;
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
  }
}
exports({ entryPoint: MyTrigger });