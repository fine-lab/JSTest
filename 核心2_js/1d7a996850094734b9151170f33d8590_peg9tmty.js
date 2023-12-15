let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "" + request.importSubtable.产品编码;
    var Entrusting_enterprise_code = "" + request.importSubtable.委托方企业编码;
    var production_enterprise_code = "" + request.importSubtable.生产企业编码;
    //查询委托方信息
    var object = { clientCode: Entrusting_enterprise_code };
    var resClientInformation = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", object);
    if (resClientInformation.length != 0) {
      var clientInformationId = resClientInformation[0].id;
    } else {
      return { err: "委托方企业信息不存在，需要维护委托方企业信息后再进行导入" };
    }
    var type_of_enterprise = "" + request.importSubtable.是否国外企业;
    if ("0" == type_of_enterprise || "1" == type_of_enterprise) {
    } else {
      return { err: "是否国外企业字段值类型错误，请校验后后再进行导入" };
    }
    //根据产品编码和委托方企业编码查询产品信息主表
    var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where product_coding='" + code + "'and to_the_enterprise = '" + clientInformationId + "'";
    var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
    if (clientCodeRes.length == 0) {
      var tableId = "";
    } else {
      var tableId = clientCodeRes[0].id;
    }
    var product_umber = "" + request.importSubtable["产品注册证号/备案凭证号"];
    if (product_umber != "无" && product_umber != "/") {
    } else {
      var resStr = "";
    }
    if (
      code == null ||
      request.importSubtable.委托方企业编码 == null ||
      request.importSubtable.产品名称 == null ||
      request.importSubtable["规格/型号"] == null ||
      request.importSubtable["产品注册证号/备案凭证号"] == null ||
      request.importSubtable["产品注册证/备案凭证批准日期"] == null ||
      request.importSubtable["产品注册证/备案凭证有效日期"] == null ||
      request.importSubtable.是否国外企业 == null ||
      request.importSubtable.生产企业编码 == null ||
      request.importSubtable["注册人/备案人名称"] == null ||
      request.importSubtable["受托生产/生产企业名称"] == null ||
      request.importSubtable.储运条件 == null
    ) {
      return { err: "有必填项为空，需要维护后再进行导入" };
    }
    var ContractSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where productInformation_id='" + tableId + "'and  product_umber='" + product_umber + "'";
    var ContractRes = ObjectStore.queryByYonQL(ContractSql, "developplatform");
    if (ContractRes.length == 0) {
      //新增
      var startDates = request.importSubtable["产品注册证/备案凭证批准日期"];
      //判断获取的日期是什么类型是number的话就处理日期
      var hasNumber = typeof startDates;
      if (hasNumber == "number") {
        var format = "-";
        let time = new Date((startDates - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        const hours = time.getHours().toLocaleString();
        const minutes = time.getMinutes();
        if (format && format.length === 1) {
          startDates = year + format + month + format + date + " " + hours + ":" + minutes;
        }
        startDates = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
      }
      var endDates = request.importSubtable["产品注册证/备案凭证有效日期"];
      //判断获取的日期是什么类型是number的话就处理日期
      var hasNumber = typeof endDates;
      if (hasNumber == "number") {
        var format = "-";
        let time = new Date((endDates - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        const hours = time.getHours().toLocaleString();
        const minutes = time.getMinutes();
        if (format && format.length === 1) {
          endDates = year + format + month + format + date + " " + hours + ":" + minutes;
        }
        endDates = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
      }
      //查询生产企业信息
      var object = { production_numbers: production_enterprise_code };
      var resInformationProduction = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production", object);
      if (resInformationProduction.length != 0) {
        var informationProductionId = resInformationProduction[0].id;
        var productionName = resInformationProduction[0].production_name;
      } else {
        var informationProductionId = "";
        var productionName = "";
      }
      var boolean = "true";
      return { boolean };
    } else {
      //修改
      var subId = ContractRes[0].id;
      var startDates = request.importSubtable["产品注册证/备案凭证批准日期"];
      //判断获取的日期是什么类型是number的话就处理日期
      var hasNumber = typeof startDates;
      if (hasNumber == "number") {
        var format = "-";
        let time = new Date((startDates - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        const hours = time.getHours().toLocaleString();
        const minutes = time.getMinutes();
        if (format && format.length === 1) {
          startDates = year + format + month + format + date + " " + hours + ":" + minutes;
        }
        startDates = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
      }
      var endDates = request.importSubtable["产品注册证/备案凭证有效日期"];
      //判断获取的日期是什么类型是number的话就处理日期
      var hasNumber = typeof endDates;
      if (hasNumber == "number") {
        var format = "-";
        let time = new Date((endDates - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        const hours = time.getHours().toLocaleString();
        const minutes = time.getMinutes();
        if (format && format.length === 1) {
          endDates = year + format + month + format + date + " " + hours + ":" + minutes;
        }
        endDates = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
      }
      //查询生产企业信息
      var object = { production_numbers: production_enterprise_code };
      var resInformationProduction = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production", object);
      if (resInformationProduction.length != 0) {
        var informationProductionId = resInformationProduction[0].id;
        var productionName = resInformationProduction[0].production_name;
      } else {
        var informationProductionId = "";
        var productionName = "";
      }
      var boolean = "true";
      return { boolean };
    }
  }
}
exports({ entryPoint: MyAPIHandler });