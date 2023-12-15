let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var failurl = "https://test-aipos.honghuotai.com:8261/erpService/syncShopDayDataForUploadFail";
    var succselurl = "https://test-aipos.honghuotai.com:8261/erpService/syncShopDayDataForUploadSuccess";
    var akey = "yourkeyHere";
    var header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    var objects = request.data;
    objects.forEach((object) => {
      var salemoneydetails = object.salemoneydetailList;
      salemoneydetails.forEach((salemoneydetail) => {
        salemoneydetail.aftermoveaccmoney = salemoneydetail.realmoney;
      });
    });
    var res = "";
    //插入数据
    try {
      res = ObjectStore.insert("GT13741AT37.GT13741AT37.dayclosebill", objects, "e297ef0b");
    } catch (err) {
      res = "123";
      objects.forEach((data) => {
        let hhtObj = {
          akey: akey,
          billNo: data.dayclosecode,
          shopCode: data.erporgcode,
          loginCode: "001",
          loginName: "YonSuite默认用户",
          remark: err
        };
        var strResponse = postman("post", failurl, JSON.stringify(header), JSON.stringify(hhtObj));
        var strResponseobj = JSON.parse(strResponse);
      });
      return { err: err };
    }
    var billNos = new Array();
    var billNosMaps = new Array();
    objects.forEach((data) => {
      billNos.push(data.dayclosecode);
      var billNosMap = {
        billNo: data.dayclosecode,
        erpBillNo: data.dayclosecode
      };
      billNosMaps.push(billNosMap);
    });
    var hhtsuccObj = {
      akey: akey,
      billNos: billNos,
      billNosMap: billNosMaps,
      shopCode: objects[0].erporgcode,
      loginCode: "001",
      loginName: "YonSuite默认用户"
    };
    var strResponse = postman("post", succselurl, JSON.stringify(header), JSON.stringify(hhtsuccObj));
    var strResponseobj = JSON.parse(strResponse);
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });