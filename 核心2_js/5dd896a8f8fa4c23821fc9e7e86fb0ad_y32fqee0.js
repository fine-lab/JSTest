let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var request_importSubtable = convertNumbersToStrings(request.importSubtable);
    var code = "" + request_importSubtable.产品编码;
    if (
      code == null ||
      request_importSubtable.委托方企业编码 == null ||
      request_importSubtable.产品名称 == null ||
      request_importSubtable["规格/型号"] == null ||
      request_importSubtable["产品注册证号/备案凭证号"] == null ||
      request_importSubtable["产品注册证/备案凭证批准日期"] == null ||
      request_importSubtable["产品注册证/备案凭证有效日期"] == null ||
      request_importSubtable.是否国外企业 == null ||
      request_importSubtable.生产企业编码 == null ||
      request_importSubtable["注册人/备案人名称"] == null ||
      request_importSubtable["受托生产/生产企业名称"] == null ||
      request_importSubtable.储运条件 == null
    ) {
      return { err: "有必填项为空，需要维护后再进行导入" };
    }
    var Entrusting_enterprise_code = "" + request_importSubtable.委托方企业编码;
    var production_enterprise_code = "" + request_importSubtable.生产企业编码;
    //查询委托方信息
    var object = { clientCode: Entrusting_enterprise_code };
    var resClientInformation = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", object);
    if (resClientInformation.length != 0) {
      var clientInformationId = resClientInformation[0].id;
    } else {
      return { err: "委托方企业信息不存在，需要维护委托方企业信息后再进行导入" };
    }
    var type_of_enterprise = "" + request_importSubtable.是否国外企业;
    if ("0" == type_of_enterprise || "1" == type_of_enterprise) {
    } else {
      return { err: "是否国外企业字段值类型错误，请校验后后再进行导入" };
    }
    //根据产品编码和委托方企业编码查询产品信息主表
    var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where product_coding='" + code + "'and to_the_enterprise = '" + clientInformationId + "'";
    var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
    if (clientCodeRes.length == 0) {
      return { err: "未成功导入，请先导入产品信息" };
      var tableId = "";
    } else {
      var tableId = clientCodeRes[0].id;
    }
    var product_umber = "" + request_importSubtable["产品注册证号/备案凭证号"];
    if (product_umber != "/") {
      var resStr = "";
      var str1 = product_umber.match(/\d+/g);
      if (str1.length != undefined) {
        if (str1.length == 1) {
          resStr = str1[0].substring(4, 5);
        } else {
          const str12 = str1[1];
          resStr = str12.substring(4, 5);
        }
      }
    } else {
      var resStr = "";
    }
    var startDates = request_importSubtable["产品注册证/备案凭证批准日期"];
    if (startDates != "/") {
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
    } else {
      startDates = "";
    }
    var endDates = request_importSubtable["产品注册证/备案凭证有效日期"];
    if (endDates != "/") {
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
    } else {
      endDates = "";
    }
    var ContractSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where productInformation_id='" + tableId + "'and  product_umber='" + product_umber + "'";
    var ContractRes = ObjectStore.queryByYonQL(ContractSql, "developplatform");
    if (ContractRes.length == 0) {
      //新增
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
      var insertSubtable = {
        id: tableId,
        product_registration_certificaList: [
          {
            product_code: code,
            Entrusting_enterprise_code: clientInformationId,
            product_umber: product_umber,
            product_date: startDates,
            product_certificate_date: endDates,
            product_name: "" + request_importSubtable.产品名称,
            specifications: "" + request_importSubtable["规格/型号"],
            type_of_enterprise: "" + request_importSubtable.是否国外企业,
            production_enterprise_code: informationProductionId,
            production_enterprise_name: request_importSubtable["受托生产/生产企业名称"],
            storage_conditions: "" + request_importSubtable.储运条件,
            nameRegistrant: "" + request_importSubtable["注册人/备案人名称"],
            di: request_importSubtable.DI码数据,
            classOfmd: resStr,
            _status: "Insert"
          }
        ]
      };
      var insertSubtableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", insertSubtable, "3f0c64e9");
      if (insertSubtableRes != null) {
        return { type: "add" };
      } else {
        return { insertSubtableRes };
      }
    } else {
      //修改
      var subId = ContractRes[0].id;
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
      var updateSubtable = {
        id: tableId,
        product_registration_certificaList: [
          {
            id: subId,
            product_code: code,
            Entrusting_enterprise_code: clientInformationId,
            product_umber: product_umber,
            product_date: startDates,
            product_certificate_date: endDates,
            product_name: "" + request_importSubtable.产品名称,
            specifications: "" + request_importSubtable["规格/型号"],
            type_of_enterprise: "" + request_importSubtable.是否国外企业,
            production_enterprise_code: informationProductionId,
            production_enterprise_name: request_importSubtable["受托生产/生产企业名称"],
            storage_conditions: "" + request_importSubtable.储运条件,
            nameRegistrant: "" + request_importSubtable["注册人/备案人名称"],
            ui: request_importSubtable.PI,
            di: request_importSubtable.DI码数据,
            udi: request_importSubtable.UDI,
            classOfmd: resStr,
            _status: "Update"
          }
        ]
      };
      var updateSubtableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", updateSubtable, "3f0c64e9");
      if (updateSubtableRes != null) {
        return { type: "change" };
      } else {
        return { updateSubtableRes };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });
function convertNumbersToStrings(obj) {
  for (var key in obj) {
    if (typeof obj[key] === "number" && !isNaN(obj[key]) && !isDateValid(key)) {
      obj[key] = obj[key].toString();
    }
  }
  return obj;
}
function isDateValid(dateName) {
  if (dateName.indexOf("日期") > -1) {
    return true;
  }
  return false;
}