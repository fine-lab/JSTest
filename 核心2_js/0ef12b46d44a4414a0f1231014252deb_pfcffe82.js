// 订单页面参照取数逻辑  wangsyf
let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    return commonFetch();
  }
}
function commonFetch() {
  let psnOrgAndDept = getPsnBasic();
  let psnBiz = getPsnLocal(psnOrgAndDept.id);
  // 获取代理商档案。
  let cmmssnMerchantList = getCmmssnMerchantList(psnBiz.id);
  let cmmssnMerchantIDList = cmmssnMerchantList.map(function (v) {
    return v.id;
  });
  // 代理商客户品种映射
  var simpleHeaderList;
  if (psnBiz.biz_man_tag == 1) {
    simpleHeaderList = getCMByBiz(psnBiz.id);
  } else {
    simpleHeaderList = getCMByByOutPerson(cmmssnMerchantIDList);
  }
  // 通过代理商客户品种id信息获取整体映射。
  let mapping = getValidAgentCustomerMaterialBasic(simpleHeaderList, cmmssnMerchantList);
  let { flatMap = {}, treeMap = {} } = mapping;
  return {
    psnBiz,
    flatMap,
    flatMapDesc: "id2Vo映射包含组织、代理商、业务员、客户。不含物料",
    treeMap,
    treeMapDesc: "组织-代理商-业务员-[客户id集合与物料id集合]"
  };
}
function getCMByBiz(psnId) {
  let yql2 = `select id 
    ,operatorId,operatorId.code,operatorId.name
    ,org_id,org_id.name,org_id.code,
    cmmssn_merchant.id,cmmssn_merchant.code,cmmssn_merchant.name 
     from GT7239AT6.GT7239AT6.cmmssn_cust_mar_h where dr=0 and operatorId = 'yourIdHere'`;
  let relationSimpleList = ObjectStore.queryByYonQL(yql2);
  return relationSimpleList;
}
function getValidAgentCustomerMaterialBasic(relationSimpleList /*代理商客户品种表头信息集合 必填*/, cmmssnMerchantList /* 代理商档案集合，外部业务员时有值*/) {
  let flatMap = {};
  // 组织-代理商-业务员映射
  let treeMap = {};
  // 组织集合
  var org_idArray = new Set();
  // 组织与对象集合映射
  let orgObjMapping = {};
  // 组织与表头集合映射
  let orgSimpleHeadersMapping = {};
  let id2VoMapping = {};
  if (cmmssnMerchantList && cmmssnMerchantList.length > 0) {
    for (var i = 0; i < cmmssnMerchantList.length; i++) {
      let vo = cmmssnMerchantList[i];
      flatMap[vo.org_id] = {
        org_id: vo.org_id,
        org_id_code: vo.org_id_code,
        org_id_name: vo.org_id_name
      };
      flatMap[vo.id] = {
        cmmssn_merchant_id: vo.id,
        cmmssn_merchant_code: vo.code,
        cmmssn_merchant_name: vo.name
      };
      if (!treeMap[vo.org_id]) {
        treeMap[vo.org_id] = {};
      }
      treeMap[vo.org_id][vo.id] = {};
    }
  }
  if (relationSimpleList && relationSimpleList.length > 0) {
    var object = {
      ids: relationSimpleList.map(function (v) {
        return v.id;
      }),
      compositions: [
        {
          name: "cmmssn_cust_mar_mList"
        }
      ]
    };
    //实体查询，代理商主子表内容，并去除封存内容。
    var objectList = ObjectStore.selectBatchIds("GT7239AT6.GT7239AT6.cmmssn_cust_mar_h", object);
    let objectListLen = objectList.length;
    for (var i = 0; i < objectListLen; i++) {
      let vo = objectList[i];
      var mList = vo["cmmssn_cust_mar_mList"];
      let mArray = [];
      let mListLen = mList.length;
      for (var k = 0; k < mListLen; k++) {
        if (mList[k]["bsealFlag"] == "N") {
          mArray.push(mList[k]["product"]);
        }
      }
      vo["cmmssn_cust_mar_mList"] = mArray;
    }
    for (var i = 0; i < relationSimpleList.length; i++) {
      let vo = relationSimpleList[i];
      flatMap[vo.org_id] = {
        org_id: vo.org_id,
        org_id_code: vo.org_id_code,
        org_id_name: vo.org_id_name
      };
      flatMap[vo.operatorId] = {
        operatorId: vo.operatorId,
        operatorId_code: vo.operatorId_code,
        operatorId_name: vo.operatorId_name
      };
      flatMap[vo.cmmssn_merchant_id] = {
        cmmssn_merchant_id: vo.cmmssn_merchant_id,
        cmmssn_merchant_code: vo.cmmssn_merchant_code,
        cmmssn_merchant_name: vo.cmmssn_merchant_name
      };
    }
    let yql3 = `select cmmssn_cust_mar_cFk, merchant.name,merchant.code from GT7239AT6.GT7239AT6.cmmssn_cust_mar_c 
      where cmmssn_cust_mar_cFk.id in ('${relationSimpleList
        .map(function (v) {
          return v.id;
        })
        .join("','")}') and bsealFlag='N' `;
    var customers = ObjectStore.queryByYonQL(yql3);
    var customerMap = {};
    let customerLen = customers.length;
    for (var m = 0; m < customerLen; m++) {
      let cust = customers[m];
      if (!customerMap[cust.cmmssn_cust_mar_cFk]) {
        customerMap[cust.cmmssn_cust_mar_cFk] = [];
      }
      customerMap[cust.cmmssn_cust_mar_cFk].push(cust);
      flatMap[cust.merchant] = {
        merchant: cust.merchant,
        merchant_code: cust.merchant_code,
        merchant_name: cust.merchant_name
      };
    }
    for (var n = 0; n < objectListLen; n++) {
      var obj = objectList[n];
      var orgId = obj.org_id;
      obj["cmmssn_cust_mar_cList"] = customerMap[obj.id];
      id2VoMapping[obj.id] = obj;
      org_idArray.add(orgId);
      if (!orgObjMapping[orgId]) {
        orgObjMapping[orgId] = [];
      }
      orgObjMapping[orgId].push(obj);
    }
    for (var x = 0; x < relationSimpleList.length; x++) {
      var vo = relationSimpleList[x];
      if (!orgSimpleHeadersMapping[vo.org_id]) {
        orgSimpleHeadersMapping[vo.org_id] = [];
      }
      orgSimpleHeadersMapping[vo.org_id].push(vo);
      if (!treeMap[vo.org_id]) {
        treeMap[vo.org_id] = {};
      }
    }
    org_idArray.forEach(function (v) {
      let headers = orgSimpleHeadersMapping[v];
      let agent2PsnListMapping = {};
      for (var i = 0; i < headers.length; i++) {
        let header = headers[i];
        if (!agent2PsnListMapping[header.cmmssn_merchant_id]) {
          agent2PsnListMapping[header.cmmssn_merchant_id] = {};
        }
        agent2PsnListMapping[header.cmmssn_merchant_id][header.operatorId] = {
          merchants:
            id2VoMapping[header.id]["cmmssn_cust_mar_cList"].map(function (v) {
              return v.merchant + "";
            }) || [],
          products: id2VoMapping[header.id]["cmmssn_cust_mar_mList"] || []
        };
      }
      treeMap[v] = agent2PsnListMapping;
    });
  }
  return {
    org_idArray: Array.from(org_idArray),
    treeMap,
    flatMap
  };
}
function getCmmssnMerchantList(psnId) {
  let yql = `select cmmssn_merchant_bFk.id as id
  ,cmmssn_merchant_bFk.code as code
  ,cmmssn_merchant_bFk.name as name
  ,cmmssn_merchant_bFk.org_id as org_id
  ,cmmssn_merchant_bFk.org_id.code as org_id_code
  ,cmmssn_merchant_bFk.org_id.name as org_id_name
        from GT7239AT6.GT7239AT6.cmmssn_merchant_b where dr=0 and operatorId = 'yourIdHere'`;
  // 代理商id，业务员id，组织id
  var result = ObjectStore.queryByYonQL(yql);
  return result;
}
function getCMByByOutPerson(agentIds) {
  if (!agentIds || agentIds.length == 0) {
    return [];
  }
  // 查询代理商客户品种档案表头关系
  let yql2 = `select id 
    ,operatorId,operatorId.code,operatorId.name
    ,org_id,org_id.name,org_id.code,
    cmmssn_merchant.id,cmmssn_merchant.code,cmmssn_merchant.name 
     from GT7239AT6.GT7239AT6.cmmssn_cust_mar_h where cmmssn_merchant in ('${agentIds.join("', '")}')`;
  let relationSimpleList = ObjectStore.queryByYonQL(yql2);
  return relationSimpleList;
}
function getPsnBasic() {
  let ctx = JSON.parse(AppContext()).currentUser;
  let wrapperJson = listOrgAndDeptByUserIds("diwork", ctx.tenantId, [ctx.id]);
  let wrapperObj = JSON.parse(wrapperJson);
  var psnOrgAndDept = wrapperObj.data[ctx.id];
  if (!psnOrgAndDept || !psnOrgAndDept.id) {
    throw new Error("登录用户未关联员工！");
    return;
  }
  return psnOrgAndDept;
}
function getPsnLocal(psnId) {
  let yql = `select operator.biz_man_tag as biz_man_tag 
  from GT7239AT6.GT7239AT6.operatorQueryHelper where operator='${psnId}'`;
  var res = ObjectStore.queryByYonQL(yql);
  if (res.length === 0) {
    res = ObjectStore.insert("GT7239AT6.GT7239AT6.operatorQueryHelper", { operator: psnId }, "7d53ed57");
  } else {
    res = res[0];
  }
  return {
    biz_man_tag: res.biz_man_tag,
    id: res.operator
  };
}
function getPsnInfo(psnId) {
  let access_token = getToken("39dfa78142a44b1892b0d0acb8f5bb0f", "ba2a2bded3a84844baa71fe5a3e59e00");
  let psnInfoUrl = `https://api.diwork.com/yonbip/digitalModel/staff/detail?access_token=${access_token}&id=${psnId}`;
  let psnInfoJson = postman("get", psnInfoUrl, null, null);
  var psnInfoObj = JSON.parse(psnInfoJson);
  if (psnInfoObj.code == 200) {
    psnInfoObj = psnInfoObj.data;
  } else if (psnInfoObj.code == 999) {
    throw new Error(psnInfoObj.message);
  } else {
    psnInfoObj = {};
  }
  var { mainJobList = [], ptJobList = [], biz_man_tag } = psnInfoObj;
  if (mainJobList.length > 0) {
    mainJobList = mainJobList
      .filter(function (v) {
        let enddate = v["enddate"];
        if (enddate) {
          return new Date(enddate) > new Date();
        }
        return true;
      })
      .map(function (v) {
        return v.org_id;
      });
  }
  if (ptJobList.length > 0) {
    ptJobList = ptJobList
      .filter(function (v) {
        let enddate = v["enddate"];
        if (enddate) {
          return new Date(enddate) > new Date();
        }
        return true;
      })
      .map(function (v) {
        return v.org_id;
      });
  }
  return {
    mainJobList,
    ptJobList,
    biz_man_tag,
    id: psnInfoObj.id
  };
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
exports({
  entryPoint: MyAPIHandler
});