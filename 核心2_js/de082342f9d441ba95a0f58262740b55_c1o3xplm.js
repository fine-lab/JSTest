let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    throw new Error("调用失败");
    let body = {
      data: {
        detail: {
          id: 1576383032224383019,
          purchaseUnit: 1575437288996339743,
          inspectionUnit: 1575437288996339743,
          purchasePriceUnit: 1575437288996339743,
          stockUnit: 1575437288996339743,
          produceUnit: 1575437288996339743,
          batchPriceUnit: 1575437288996339743,
          batchUnit: 1575437288996339743,
          onlineUnit: 1575437288996339743,
          offlineUnit: 1575437288996339743,
          _status: "Update",
          requireUnit: 1575437288996339743
        },
        id: 1576383032224383019,
        code: "27L0124EG3",
        name: "P002全铜喷枪",
        model: "普通铬Ni8",
        manageClass: 1575410136215191578,
        productClass: 1575411184189833239,
        productTemplate: 1575405798314475521,
        unitUseType: 2,
        unit: 1575437288996339743,
        enableAssistUnit: false,
        orgId: "yourIdHere",
        useSku: 1,
        transType_Code: "SYCSR002",
        transType: "1575205506803827351",
        salesAndOperations: 0,
        productSkuSaveAsync: 0,
        _status: "Update",
        productFamily: 0
      }
    };
    console.log("body=====" + JSON.stringify(body));
    let apiAction = "productupdate";
    let configFun = extrequire("AT199A826E08680003.backendScript.config");
    let configRes = configFun.execute(null);
    let apiurl = "https://www.example.com/";
    let appcode = "AT199A826E08680003";
    let reqType = "POST";
    var apiResponse = "";
    try {
      apiResponse = openLinker(reqType, apiurl, appcode, JSON.stringify(body));
      let apiResponseData = JSON.parse(apiResponse);
      console.log("apiResponse=====" + apiResponse);
      if (apiResponseData.code != 200) {
        throw new Error("调用失败1：" + apiResponseData.code);
      }
    } catch (e) {
      throw new Error("调用失败2：" + JSON.stringify(e));
    }
    return { res: "111" };
  }
}
exports({ entryPoint: MyAPIHandler });