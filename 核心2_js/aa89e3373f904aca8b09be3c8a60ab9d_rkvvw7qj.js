let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const flag = false;
    const address = request.address;
    const apply = request.apply;
    const addressJson = jsonParse(address);
    const applyJson = jsonParse(apply);
    //循环地址
    addressJson.forEach((data) => {
      debugger;
      const regionCode = data["regionCode"];
      var regionId = "",
        regionPath = "";
      //得到客户地址  productcenter.backDefaultGroup.regionCorpByCode
      cb.rest.invokeFunction("34f755c689e745c2aa927529483242c9", { code: regionCode }, function (err, res) {
        var resdata = JSON.parse(res.apiResponse);
        var data = resdata.data;
        if (data != null) {
          if (data.recordList != null && data.recordList.length > 0) {
            regionId = data.recordList[0].id;
            regionPath = data.recordList[0].path;
            //判断是否在适用范围
          }
        }
      });
    });
    return { flag: flag };
  }
}
exports({ entryPoint: MyAPIHandler });