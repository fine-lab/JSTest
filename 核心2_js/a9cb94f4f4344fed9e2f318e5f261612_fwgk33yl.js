let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取token
    let func1 = extrequire("GT46986AT3.backDefaultGroup.getAccessToken");
    let accessToken = func1.execute(request);
    //获取请求参数，并拼接API需要的参数
    var data = request.data;
    var requestBody = {
      OperateOrg: data.OperateOrg,
      customerName: data.customerName,
      customerId: data.customerId,
      saleDept: data.saleDept,
      belongArea: data.belongArea,
      saleManager: data.saleManager,
      deliverManager: data.deliverManager,
      saler: data.saler,
      daqu: data.daqu,
      singleChoiceThree: data.singleChoiceThree,
      onlineDate: data.onlineDate,
      solveProblem: data.solveProblem,
      customerBusiness: data.customerBusiness,
      customerYearValue: data.customerYearValue,
      customerOrgNum: data.customerOrgNum,
      customerStaffNum: data.customerStaffNum,
      companySystem: data.companySystem,
      companyPrice: data.companyPrice,
      systemUseTime: data.systemUseTime,
      systemStaffNum: data.systemStaffNum,
      singleChoice: data.singleChoice,
      singleChoiceTwo: data.singleChoiceTwo,
      singleChoiceFour: data.singleChoiceFour,
      singleChoiceFive: data.singleChoiceFive,
      singeChoiceSix: data.singeChoiceSix,
      dingdanjine: data.dingdanjine,
      salerid: data.salerid,
      file: data.file,
      code: data.code
    };
    var saveDataUrl = "https://www.example.com/" + accessToken;
    var header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var saveResult = postman("post", saveDataUrl, JSON.stringify(header), JSON.stringify(requestBody));
    var saveResultJson = JSON.parse(saveResult);
    //返回结果处理
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });