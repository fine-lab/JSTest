let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var Data = param.data;
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    // 获取token
    let func123 = extrequire("PU.public.GetToken");
    let res = func123.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "审核";
    for (let j = 0; j < Data.length; j++) {
      var id = Data[j].id;
      var bustype = Data[j].bustype;
      // 调用公共方法
      if (bustype != "1501320550199853065") {
        let param1 = { context: "12312" };
        let param2 = { id: id };
        let func = extrequire("PU.backDesignerFunction.PublicScript");
        let kpl = func.execute(param1, param2);
        console.log(JSON.stringify(kpl.returnList.body));
        if (kpl.returnList != null) {
          let returnList = kpl.returnList.body;
          let header = { "Content-Type": "application/json;charset=UTF-8" };
          let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(returnList));
          console.log(strResponse);
          let str = JSON.parse(strResponse);
          // 打印日志
          let LogBody = {
            data: { code: param.data[0].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
          };
          let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
          console.log(LogResponse);
          if (str.success != true) {
            throw new Error("调用OMS采购入库创建API失败,失败原因为：" + str.errorMessage);
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });