let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = "";
    if (param.businessKey) {
      id = param.businessKey.replace("yccontract_", "");
    } else {
      id = param.variablesMap.id;
    }
    let url = "https://www.example.com/" + id;
    var apiResponse = openLinker("GET", url, "ycContractManagement", null);
    var apiResponseJson = JSON.parse(apiResponse);
    if (param.businessKey) {
      if ("200" == apiResponseJson.code) {
        if (apiResponseJson.data.status) {
        } else {
          var codeValue = apiResponseJson.data.define20;
          //根据code获取对象
          var sql = "select * from GT879AT352.GT879AT352.reqmid where code = '" + codeValue + "'";
          var res = ObjectStore.queryByYonQL(sql, "developplatform");
          if (res.length > 0) {
            //目前不考虑撤回的情况
          } else {
            let func = extrequire("GT879AT352.apiEnd.insertReqMid");
            let obj = {
              code: codeValue
            };
            let updateres = func.execute(obj);
          }
        }
      }
    }
    return { testFlowVa: "112" };
  }
}
exports({ entryPoint: MyTrigger });