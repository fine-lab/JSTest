let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (
      request.enterprise.收货客户编号 == null ||
      request.enterprise.收货客户名称 == null ||
      request.enterprise["经营许可证/备案凭证号"] == null ||
      request.enterprise["许可证/备案凭证效期至"] == null
    ) {
      return { err: "有必填项为空，需要维护后再进行导入" };
    }
    var BuyersCode = "" + request.enterprise.收货客户编号;
    var BuyersName = "" + request.enterprise.收货客户名称;
    var LicenseOperation = "" + request.enterprise["经营许可证/备案凭证号"];
    var LicenseValidity = request.enterprise["许可证/备案凭证效期至"];
    if (LicenseValidity != "/") {
      //判断获取的日期是什么类型是number的话就处理日期
      var hasNumber = typeof LicenseValidity;
      if (hasNumber == "number") {
        var format = "-";
        let time = new Date((LicenseValidity - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        const hours = time.getHours().toLocaleString();
        const minutes = time.getMinutes();
        if (format && format.length === 1) {
          LicenseValidity = year + format + month + format + date + " " + hours + ":" + minutes;
        }
        LicenseValidity = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
        var IsEarlywarning = 1;
        if (time < new Date().getTime()) {
          IsEarlywarning = 2;
        }
      }
    } else {
      LicenseValidity = "";
    }
    var enterpriseSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers where BuyersCode = '" + BuyersCode + "'";
    var enterpriseRes = ObjectStore.queryByYonQL(enterpriseSql, "developplatform");
    if (enterpriseRes.length == 0) {
      //新增
      var insertTable = {
        BuyersCode: "" + BuyersCode,
        BuyersName: "" + BuyersName,
        LicenseOperation: LicenseOperation,
        LicenseValidity: LicenseValidity,
        enable: 0,
        IsEarlywarning: IsEarlywarning
      };
      var insertTableRes = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", insertTable, "31ae1c7b");
      if (insertTableRes != null) {
        return { type: "add" };
      } else {
        return { insertTableRes };
      }
    } else {
      //修改
      var updateTable = {
        id: enterpriseRes[0].id,
        BuyersCode: "" + BuyersCode,
        BuyersName: "" + BuyersName,
        LicenseOperation: LicenseOperation,
        LicenseValidity: LicenseValidity,
        enable: 0,
        IsEarlywarning: IsEarlywarning
      };
      var updateTableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", updateTable, "31ae1c7b");
      if (updateTableRes != null) {
        return { type: "change" };
      } else {
        return { updateTableRes };
      }
    }
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });