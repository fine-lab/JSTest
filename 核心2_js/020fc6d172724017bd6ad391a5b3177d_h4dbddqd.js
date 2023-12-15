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
    //将雅座支付方式转换为YS支付方式
    var yesterday = getDay("-1", "-");
    var bussDate = replace(yesterday, "-", "");
    //凌晨1点，获取前一天的日期
    function getDay(num, str) {
      var today = new Date();
      var nowTime = today.getTime();
      var ms = 24 * 3600 * 1000 * num;
      today.setTime(parseInt(nowTime + ms));
      var oYear = today.getFullYear();
      var oMoth = (today.getMonth() + 1).toString();
      if (oMoth.length <= 1) oMoth = "0" + oMoth;
      var oDay = today.getDate().toString();
      if (oDay.length <= 1) oDay = "0" + oDay;
      return oYear + str + oMoth + str + oDay;
    }
    return;
    objects.forEach((object) => {
      var salemoneydetails = object.salemoneydetailList;
      //同一客户 同一财务处理方式 同一支付方式的数据进行合并
      //调账后金额=实收金额
      salemoneydetails.forEach((salemoneydetail) => {
        salemoneydetail.aftermoveaccmoney = salemoneydetail.realmoney;
        salemoneydetail.moveaccmoney = "0";
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