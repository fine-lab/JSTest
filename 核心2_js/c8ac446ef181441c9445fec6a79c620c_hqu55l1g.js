let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let url = "https://www.example.com/";
    let ApiKey = "yourKeyHere";
    let EBusinessID = "yourIDHere";
    let RequestType = "1001";
    let ids = param;
    let func1 = extrequire("PU.backDefaultGroup.getCGorder");
    let func2 = extrequire("PU.backDefaultGroup.getGCBody");
    let func3 = extrequire("PU.backDefaultGroup.makeCGupdateBody");
    let func4 = extrequire("PU.backDefaultGroup.updateCgdd");
    let contenttype = "application/x-www-form-urlencoded;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let result = [];
    for (let i = 0; i < ids.length; i++) {
      let gcresult = {};
      let id = ids[i].id;
      let res = func1.execute(null, id);
      let requestData = func2.execute(null, res.returnData);
      let requestBody = requestData.RequestData;
      let body = {
        requestdata: requestBody,
        ebusinessid: EBusinessID,
        requesttype: RequestType,
        datasign: Base64Encode(MD5Encode(JSON.stringify(requestBody) + ApiKey)),
        datatype: "2"
      };
      let strResponse = postman("POST", url, JSON.stringify(header), JSON.stringify(body));
      let gcresponseobj = JSON.parse(strResponse);
      if ("100" == gcresponseobj.resultcode) {
        let SM_ID = gcresponseobj.order.sm_id;
        let cgUpdateBody = {
          data: res.returnData,
          SM_ID: SM_ID
        };
        let updateBody = func3.execute(null, cgUpdateBody);
        let updateCode = func4.execute(null, updateBody.data);
        if (updateCode.returnData == "200") {
          gcresult = {
            code: 200,
            message: res.returnData.code + "推送工厂成功"
          };
        } else {
          gcresult = {
            code: 999,
            message: res.returnData.code + "回写采购订单失败"
          };
        }
      } else {
        gcresult = {
          code: 999,
          message: "推送工失败，原因：" + gcresponseobj.reason
        };
      }
      result.push(gcresult);
    }
    return { result };
  }
}
exports({ entryPoint: MyTrigger });