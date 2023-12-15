let AbstractTrigger = require("AbstractTrigger");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    const { importMode, data } = param;
    if (!importMode) {
      return;
    }
    const { org_id } = data[0];
    let children = data[0]["salesPriceList_bList"];
    var errMsg = getLevelErr1(data[0]);
    if (errMsg) {
      throw new Error(errMsg);
    }
    checkOrg(org_id);
    let merchants = children.map((child) => child.merchant);
    checkMerchant(org_id, merchants);
    var productIds = children.map(function (v) {
      return v.product + "";
    });
    let set = new Set(productIds);
    productIds = Array.from(set);
    var productsInfoList = checkProducts(org_id, productIds);
    let productsInfoMap = {};
    productsInfoList.map(function (v) {
      productsInfoMap[v.id] = v;
    });
    var errMsg2 = "";
    children.map(function (v, i) {
      if (!productsInfoMap[v.product]) {
        errMsg2 += `第${i + 1}行物料不存在或不可见`;
      }
    });
    return {};
  }
}
// 空值校验
function getLevelErr1(data) {
  let headerMap = {
    org_id_name: "销售组织",
    name: "名称"
  };
  let bodyMap = {
    product_code: "物料编码",
    merchant_name: "客户档案",
    isPriceContainsTax: "是否含税价",
    price: "价格"
  };
  var errMsg = "";
  Object.keys(headerMap).map(function (key) {
    if (!data[key]) {
      errMsg += headerMap[key] + "不可为空,";
    }
  });
  let children = data["salesPriceList_bList"];
  Object.keys(bodyMap).map(function (key) {
    children.map((childItem) => {
      if (!childItem[key]) {
        errMsg += bodyMap[key] + "不可为空,";
      }
      if (key === "isPriceContainsTax" && !["Y", "N"].includes(childItem["isPriceContainsTax"])) {
        errMsg += bodyMap["isPriceContainsTax"] + "只能是Y或者N";
      }
    });
  });
  return errMsg;
}
// 校验销售组织
function checkOrg(org_id) {
  let url = `https://api.diwork.com/yonbip/digitalModel/orgunit/detail?id=${org_id}`;
  let resultJson = ublinker("get", url, HEADER_STRING, null);
  let resultObj = JSON.parse(resultJson);
  if (resultObj.code == 200) {
    resultObj = resultObj.data;
    if (!resultObj["id"]) {
      throw new Error(`组织${org_id}未找到`);
    }
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
    HEADER_STRING,
    JSON.stringify({
      data: "id,code,name,unit,detail.productApplyRangeId",
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
  debugger;
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
// 校验客户
function checkMerchant(org_id, merchants) {
  let url = `https://api.diwork.com/yonbip/digitalModel/merchant/queryByPage`;
  let resultJson = ublinker(
    "post",
    url,
    HEADER_STRING,
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
                value1: merchants
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
      throw new Error(`客户${merchants.join()}未找到`);
    }
    return resultObj.recordList;
  } else {
    throw new Error(resultObj.message);
  }
}
exports({ entryPoint: MyTrigger });