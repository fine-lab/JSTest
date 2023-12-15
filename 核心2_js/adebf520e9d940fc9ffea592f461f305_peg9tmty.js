let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取页面数据集合
    var DataList = JSON.parse(param.requestData);
    var string = param.requestData;
    var JSON1 = JSON.parse(string);
    var _status = JSON1._status;
    // 主表id
    var id = DataList.id;
    // 获取注册证书
    var registration = DataList.registration;
    var number = Number(registration);
    if (_status != "Update") {
      // 获取子表集合
      let sunList = DataList.product_registration_certificaList;
      if (sunList != undefined) {
        // 获取子表的长度
        let count = sunList.length;
        let AL = String(count);
        // 更新产品信息主表
        param.data[0].set("registration", AL);
      }
    } else {
      let ArrList = DataList.product_registration_certificaList;
      if (ArrList != undefined) {
        let counts = ArrList.length;
        let Sum = Number(counts);
        let collect = Sum;
        let registrationNumber = String(collect);
        // 更新产品信息主表
        param.data[0].set("registration", registrationNumber);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });