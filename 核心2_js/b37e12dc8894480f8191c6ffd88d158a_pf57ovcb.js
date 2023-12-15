let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let httpURL = "https://c2.yonyoucloud.com"; //域名升级，世贸生产环境
    //使用OPENAPI【查询租户下用户身份】，查询用户手机号
    let bodyMO = {
      condition: {
        simpleVOs: [
          {
            field: "name",
            op: "eq",
            value1: request.creator
          },
          {
            field: "stopstatus",
            op: "eq",
            value1: "0"
          }
        ]
      },
      page: {
        pageIndex: 1,
        pageSize: 10
      }
    };
    let urlMO = httpURL + "/iuap-api-gateway/yonbip/digitalModel/iuap-apcom-bipuser/bill/getBizData";
    let apiResponseMO = openLinker("POST", urlMO, "AT17C47D1409580006", JSON.stringify(bodyMO));
    let apiResponseJson = JSON.parse(apiResponseMO);
    if (apiResponseJson.code != 200) {
      return apiResponseJson;
    }
    //返回数据结构
    let resJson = { code: 200, message: "", user_code: "" };
    if (apiResponseJson.data.recordCount == 0) {
      resJson.code = 999;
      resJson.message = "通过姓名" + request.creator + "未查到数据";
      return resJson;
    }
    if (apiResponseJson.data.recordCount > 1) {
      resJson.code = 999;
      resJson.message = "通过姓名" + request.creator + "查出多条数据";
      return resJson;
    }
    let mobileNo = apiResponseJson.data.recordList[0].mobile;
    //调用【员工列表查询】接口查询员工工号
    let body = {
      pageIndex: 1,
      pageSize: 10,
      mobile: mobileNo
    };
    let url = httpURL + "/iuap-api-gateway/yonbip/digitalModel/staff/list";
    let apiResponse = openLinker("POST", url, "AT17C47D1409580006", JSON.stringify(body));
    let apiJson = JSON.parse(apiResponse);
    if (apiJson.code == 200) {
      if (apiJson.data.recordList.length > 0) {
        resJson.code = 200;
        resJson.message = "查询成功";
        resJson.user_code = apiJson.data.recordList[0].code;
        return resJson;
      } else {
        resJson.code = 999;
        resJson.message = "通过手机号" + mobileNo + "未查到数据";
        return resJson;
      }
    } else {
      return apiJson;
    }
    throw new Error(JSON.stringify(apiResponse));
  }
}
exports({ entryPoint: MyAPIHandler });