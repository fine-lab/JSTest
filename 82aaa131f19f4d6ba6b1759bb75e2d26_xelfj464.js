let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //声明变量开始
    let body = {
      name: {
        simplifiedName: "暂时测试"
      },
      involveSKUNaming: true,
      isOptionalTemplate: 0,
      stopStatus: 0,
      units: [
        {
          unitCode: "EA",
          enableAssistUnit: true
        }
      ],
      orderPropertySums: [
        {
          isShow: true,
          isRequired: true
        }
      ],
      parameters: [
        {
          isFilter: true
        }
      ],
      freeCharacters: [
        {
          characteristics: 1772618146873081859,
          characteristicsName: "板材",
          characterCode: "BC-01",
          twoDimensionalInput: 0,
          batchSens: 0,
          costAffec: 0,
          manuAffec: 0,
          skuSens: 0,
          stockSens: 0,
          snSens: 0,
          bomAffec: 0,
          characterOrder: 0
        }
      ]
    };
    //声明变量结束
    const rootUrl = "https://c1.yonyoucloud.com";
    let requestUrl = `${rootUrl}/iuap-api-gateway/yonbip/digitalModel/producttpl/savenew`;
    let requestMethod = "POST";
    let appCode = "AT1860273016E80004";
    let apiResponse = openLinker(requestMethod, requestUrl, appCode, JSON.stringify(body));
    var result = JSON.parse(apiResponse);
    return {
      result
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});