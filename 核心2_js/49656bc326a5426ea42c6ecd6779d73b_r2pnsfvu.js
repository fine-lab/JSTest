let AbstractTrigger = require("AbstractTrigger");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let { importMode } = param;
    debugger;
    if (!importMode) {
      return;
    }
    var data = param.data[0];
    let cmmssn_cust_mar_cList = data["cmmssn_cust_mar_cList"];
    let cmmssn_cust_mar_mList = data["cmmssn_cust_mar_mList"];
    let org_id = data.org_id;
    let cmmssn_merchant = data.cmmssn_merchant;
    checkCmssnMerchant(org_id, cmmssn_merchant);
    checkOrg(org_id);
    var merchants = cmmssn_cust_mar_cList.map(function (v) {
      return v.merchant;
    });
    var merchantsSet = new Set();
    var errMsg1 = "";
    merchants.forEach(function (x, i) {
      if (merchantsSet.has(x)) {
        errMsg1 += `第${i + 1}行客户重复`;
      } else {
        merchantsSet.add(x);
      }
    });
    merchants = Array.from(merchantsSet);
    var merchantInfoList = checkMerchant(org_id, merchants);
    let merchantInfoMap = {};
    merchantInfoList.map(function (v) {
      merchantInfoMap[v.id] = v;
    });
    cmmssn_cust_mar_cList.map(function (v, i) {
      if (!merchantInfoMap[v.merchant]) {
        errMsg1 += `第${i + 1}行客户不存在或不可见`;
      }
    });
    if (errMsg1 != "") {
      throw new Error(errMsg1);
    }
    var products = cmmssn_cust_mar_mList.map(function (v) {
      return v.product;
    });
    var productsSet = new Set();
    var errMsg2 = "";
    products.forEach(function (x, i) {
      if (productsSet.has(x)) {
        errMsg2 += `第${i + 1}行物料重复`;
      } else {
        productsSet.add(x);
      }
    });
    products = Array.from(productsSet);
    var productsInfoList = checkProducts(org_id, products);
    let productsInfoMap = {};
    productsInfoList.map(function (v) {
      productsInfoMap[v.id] = v;
    });
    cmmssn_cust_mar_mList.map(function (v, i) {
      if (!productsInfoMap[v.product]) {
        errMsg2 += `第${i + 1}行物料不存在或不可见`;
      }
    });
    if (errMsg2 != "") {
      throw new Error(errMsg2);
    }
    return {};
  }
}
function checkOrg(org_id) {
  let url = `https://api.diwork.com/yonbip/digitalModel/orgunit/detail?id=${org_id}`;
  let json = ublinker("get", url, HEADER_STRING, null);
  var resultObj = JSON.parse(resultJson);
  if (resultObj.code == 200) {
    resultObj = resultObj.data;
    if (!resultObj["id"]) {
      throw new Error(`组织${org_id}未找到`);
    }
  } else {
    throw new Error(resultObj.message);
  }
}
function checkCmssnMerchant(org_id, cmssn_merchant) {
  let sql = `select * from GT7239AT6.GT7239AT6.cmmssn_merchant_h where org_id=${org_id} and id = ${cmssn_merchant}`;
  var res = ObjectStore.queryByYonQL(sql);
  if (res.length == 0) {
    throw new Error("未找到该组织下的代理商！");
  }
}
// 校验客户
function checkMerchant(org_id, merchant) {
  let url = `https://api.diwork.com/yonbip/digitalModel/merchant/queryByPage`;
  let resultJson = ublinker(
    "post",
    url,
    null,
    JSON.stringify({
      data: "id,code,name,merchantAddressInfos.mergerName,merchantAddressInfos.isDefault",
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      condition: {
        simpleVOs: [
          {
            logicOp: "and",
            conditions: [
              {
                field: "id",
                op: "in",
                value1: merchant
              },
              {
                field: "merchantAppliedDetail.merchantApplyRangeId.orgId",
                op: "eq",
                value1: org_id
              }
            ]
          }
        ]
      }
    })
  );
  var resultObj = JSON.parse(resultJson);
  if (resultObj.code == 200) {
    resultObj = resultObj.data;
    if (!(resultObj["recordList"] && resultObj["recordList"].length > 0)) {
      throw new Error(`客户${merchant}未找到`);
    }
    return resultObj.recordList;
  } else {
    throw new Error(resultObj.message);
  }
}
// 校验物料
function checkProducts(org_id, products) {
  let url = `https://api.diwork.com/yonbip/digitalModel/product/queryByPage`;
  let resultJson = ublinker(
    "post",
    url,
    null,
    JSON.stringify({
      data: "id,code,name,unit",
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      condition: {
        simpleVOs: [
          {
            logicOp: "and",
            conditions: [
              {
                field: "id",
                op: "in",
                value1: products
              },
              {
                field: "productApplyRange.orgId",
                op: "eq",
                value1: org_id
              }
            ]
          }
        ]
      }
    })
  );
  var resultObj = JSON.parse(resultJson);
  if (resultObj.code == 200) {
    resultObj = resultObj.data;
    if (!(resultObj["recordList"] && resultObj["recordList"].length > 0)) {
      throw new Error(`物料${products.join()}未找到`);
    }
    let persistProducts = resultObj.recordList.map(function (v) {
      return v.id;
    });
    if (persistProducts.length !== products.length) {
      throw new Error(`物料持久化数据与入参长度不一致。persistProducts= ${persistProducts.join()} ,products= ${products.join()}`);
    }
    return resultObj.recordList;
  } else {
    throw new Error(resultObj.message);
  }
}
exports({ entryPoint: MyTrigger });