let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return true;
    let Data = getOtherOutRecoeds([param.data[0].id]);
    let func1 = extrequire("ST.api001.getToken"); //获取token
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "保存";
    let param2 = { data: Data };
    let func = extrequire("ST.rule.MaterialOutV1");
    let OutData = func.execute(null, param2);
    console.log(JSON.stringify(OutData));
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(OutData.body));
    console.log(strResponse);
    let str = JSON.parse(strResponse);
    // 打印日志
    let LogBody = { data: { code: Data[0].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType } };
    let LogResponse = postman("post", "https://www.example.com/" + token, JSON.stringify(header), JSON.stringify(LogBody));
    console.log(LogResponse);
    if (str.success != true) {
      throw new Error("调用OMS材料出库创建API失败！" + str.errorMessage);
    }
    function getOtherOutRecoeds(ids) {
      var object = {
        ids: ids,
        compositions: [
          {
            name: "materOuts"
          }
        ]
      };
      return ObjectStore.selectBatchIds("st.materialout.MaterialOut", object);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });