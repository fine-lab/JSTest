let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (
      request.enterprise.生产企业编号 == null ||
      request.enterprise.生产企业名称 == null ||
      request.enterprise["生产许可证号/备案凭证号"] == null ||
      request.enterprise.生产范围 == null ||
      request.enterprise.企业类型 == null ||
      request.enterprise["许可证/备案凭证效期至"] == null
    ) {
      return { err: "有必填项为空，需要维护后再进行导入" };
    }
    var enterpriseCode = "" + request.enterprise.生产企业编号;
    var enterpriseName = "" + request.enterprise.生产企业名称;
    var enterpriseScxkz = "" + request.enterprise["生产许可证号/备案凭证号"];
    var enterpriseRange = "" + request.enterprise.生产范围;
    var enterpriseType = "" + request.enterprise.企业类型;
    if ("0" == enterpriseType || "1" == enterpriseType) {
    } else {
      return { err: "企业类型字段值类型错误，请校验后后再进行导入" };
    }
    var enterpriseTime = request.enterprise["许可证/备案凭证效期至"];
    if (enterpriseTime != "/") {
      //判断获取的日期是什么类型是number的话就处理日期
      var hasNumber = typeof enterpriseTime;
      if (hasNumber == "number") {
        var format = "-";
        let time = new Date((enterpriseTime - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        const hours = time.getHours().toLocaleString();
        const minutes = time.getMinutes();
        if (format && format.length === 1) {
          enterpriseTime = year + format + month + format + date + " " + hours + ":" + minutes;
        }
        enterpriseTime = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
        var IsEarlywarning = 1;
        if (time < new Date().getTime()) {
          IsEarlywarning = 2;
        }
      }
    } else {
      enterpriseTime = "";
    }
    var enterpriseSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production where production_numbers = '" + enterpriseCode + "'";
    var enterpriseRes = ObjectStore.queryByYonQL(enterpriseSql, "developplatform");
    if (enterpriseRes.length == 0) {
      //新增
      var insertTable = {
        production_name: enterpriseName,
        production_license: enterpriseScxkz,
        whether_enterprises: enterpriseType,
        production_range: enterpriseRange,
        production_validity: enterpriseTime,
        production_numbers: enterpriseCode,
        enable: 0,
        IsEarlywarning: IsEarlywarning
      };
      var insertTableRes = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production", insertTable, "ceae5eea");
      if (insertTableRes != null) {
        return { type: "add" };
      } else {
        return { insertTableRes };
      }
    } else {
      //修改
      var updateTable = {
        id: enterpriseRes[0].id,
        production_name: enterpriseName,
        production_license: enterpriseScxkz,
        whether_enterprises: enterpriseType,
        production_range: enterpriseRange,
        production_validity: enterpriseTime,
        production_numbers: enterpriseCode,
        enable: 0,
        IsEarlywarning: IsEarlywarning
      };
      var updateTableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production", updateTable, "ceae5eea");
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