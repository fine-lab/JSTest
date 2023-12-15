let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var failurl = "https://test-aipos.honghuotai.com:8261/erpService/syncShopDayDataForUploadFail";
    var succselurl = "https://test-aipos.honghuotai.com:8261/erpService/syncShopDayDataForUploadSuccess";
    var akey = "yourkeyHere";
    var header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    //获取请求数据
    var objects = request.data;
    //销售收入明细中的调账后金额 = 实收金额 – 调账金额(字段加入公式了，看下公式是否会生效)
    objects.forEach((object) => {
      var salesIncome = object.SalesIncomeList;
      salesIncome.forEach((salesIncomeDetail) => {
        salesIncomeDetail.reconPriceAfter = salesIncomeDetail.actualPrice;
      });
    });
    //保存日结单返回信息
    var res = "";
    //保存日结单
    try {
      res = ObjectStore.insert("GT26509AT22.GT26509AT22.DailyStatement", objects, "DailyStatement");
    } catch (err) {
      //保存日结单失败，将失败信息同步到红火台的失败地址(多个日结单)
      objects.forEach((data) => {
        let failObj = {
          akey: akey,
          billNo: data.dailyCode,
          shopCode: data.orgCode,
          loginCode: "001",
          loginName: "YonSuite默认用户",
          remark: err
        };
        //是否请求成功未判断
        var strResponse = postman("post", failurl, JSON.stringify(header), JSON.stringify(failObj));
        var strResponseobj = JSON.parse(strResponse);
      });
      //返回错误信息
      return { err: err };
    }
    //保存日结单成功，将相关信息同步到红火台的成功地址
    var billNos = new Array();
    var billNosMaps = new Array();
    objects.forEach((data) => {
      billNos.push(data.dailyCode);
      var billNosMap = {
        billNo: data.dailyCode,
        erpBillNo: data.dailyCode
      };
      billNosMaps.push(billNosMap);
    });
    var succObj = {
      akey: akey,
      billNos: billNos,
      billNosMap: billNosMaps,
      //同一个门店编码
      shopCode: objects[0].orgCode,
      loginCode: "001",
      loginName: "YonSuite默认用户"
    };
    //是否请求成功未判断
    var strResponse = postman("post", succselurl, JSON.stringify(header), JSON.stringify(succObj));
    var strResponseobj = JSON.parse(strResponse);
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });