let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var mobile = request.mobile;
    var pkbo = request.pkbo;
    var sign = request.sign;
    var mobileParam = request.mobileParam;
    var reqParams = {
      url: "https://www.example.com/",
      sign: sign,
      type: "POST",
      body: {
        andQueryConditions: [
          {
            columnCode: mobileParam,
            columnValue: mobile,
            queryOperator: "Equal"
          }
        ],
        pkBo: pkbo,
        queryOperator: "And",
        size: 1000,
        start: 0
      }
    };
    let base = extrequire("GT26588AT23.billcloudapprove.base");
    let baseRes = base.execute(reqParams);
    return { res: baseRes.res };
  }
}
exports({ entryPoint: MyAPIHandler });