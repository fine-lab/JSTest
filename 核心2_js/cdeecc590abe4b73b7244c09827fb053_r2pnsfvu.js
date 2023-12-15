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
    const { org_id, org_id_name } = data[0];
    let children = data[0]["cmmssn_merchant_bList"];
    let errMsg = getLevelErr1(data[0]);
    if (errMsg) {
      throw new Error(errMsg);
    }
    checkOrg(org_id);
    checkOperator(org_id, org_id_name, children);
  }
}
// 空值校验
function getLevelErr1(data) {
  let headerMap = {
    org_id_name: "销售组织",
    name: "名称"
  };
  let bodyMap = {
    operatorId_name: "操作员"
  };
  var errMsg = "";
  Object.keys(headerMap).map(function (key) {
    if (!data[key]) {
      errMsg += headerMap[key] + "不可为空,";
    }
  });
  let children = data["cmmssn_merchant_bList"];
  Object.keys(bodyMap).map(function (key) {
    children.map((childItem) => {
      if (!childItem[key]) {
        errMsg += bodyMap[key] + "不可为空,";
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
      throw new Error(`销售组织${org_id_name}未找到`);
    }
  } else {
    throw new Error(resultObj.message);
  }
}
// 校验操作员
function checkOperator(org_id, org_id_name, operators) {
  operators.map((operator) => {
    let url = `https://api.diwork.com/yonbip/digitalModel/staff/detail?id=${operator.operatorId}`;
    let operatorInfoJson = ublinker("get", url, HEADER_STRING, null);
    var operatorInfoObj = JSON.parse(operatorInfoJson);
    if (operatorInfoObj.code == 200) {
      const { mainJobList } = operatorInfoObj.data;
      if (mainJobList) {
        let orgIds = mainJobList
          .filter(function (v) {
            let enddate = v["enddate"];
            if (enddate) {
              return new Date(enddate) > new Date();
            }
            return true;
          })
          .map((mainJobItem) => mainJobItem.org_id);
        if (!orgIds.includes(org_id)) {
          throw new Error(`操作员${operator.operatorId_name}与${org_id_name}无关联`);
        }
      }
    } else {
      throw new Error(operatorInfoObj.message);
    }
  });
}
exports({ entryPoint: MyTrigger });