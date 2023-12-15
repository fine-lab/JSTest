let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var tenantId = JSON.parse(res).currentUser.tenantId;
    let conditionCode = "LK0001";
    // 第一步，先获取规则引擎的定义以及需要的参数
    //信息体
    let body = [conditionCode];
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
      // 就是appCode
    };
    let loadConditionKeyResponse = postman(
      "post",
      "https://www.example.com/" + tenantId,
      JSON.stringify(header),
      JSON.stringify(body)
    );
    // 参数集合
    let conditionDataList = JSON.parse(loadConditionKeyResponse).data[0].conditions;
    // 第二步，然后根据参数拼接好，调用规则引擎获取结果
    //信息体
    body = {
      LK10: "2602699904080896"
    };
    //信息头
    header = {
      "Content-Type": "application/json;charset=UTF-8"
      // 就是appCode
    };
    let conditionFireResponse = postman(
      "post",
      "https://www.example.com/" + tenantId + "&code=" + conditionCode,
      JSON.stringify(header),
      JSON.stringify(body)
    );
    // 规则判定结果集合
    let conditionResultList = JSON.parse(conditionFireResponse).data.result;
    // 返回结果示例
    let resultList = [];
    if (conditionResultList) {
      for (var key in conditionResultList) {
        resultList = conditionResultList[key];
      }
    }
    let staffValue = [];
    for (var i = 0; i < resultList.length; i++) {
      staffValue.push(resultList[i].value1);
    }
    let result = { dataType: "staff", data: staffValue };
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });