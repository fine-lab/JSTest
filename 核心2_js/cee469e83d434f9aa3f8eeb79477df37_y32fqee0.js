let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var noConformSoleArr = [];
    request.enterprise = convertNumbersToStrings(request.enterprise);
    if (request.enterprise.库存地代码 == null) {
      noConformSoleArr.push("库存地代码");
    }
    if (request.enterprise.库区名称 == null) {
      noConformSoleArr.push("库区名称");
    }
    if (request.enterprise.库区贮存环境条件 == null) {
      noConformSoleArr.push("库区贮存环境条件");
    }
    if (noConformSoleArr.length > 0) {
      return { err: "行“" + (request.rowIndex + 1) + "”" + noConformSoleArr.join("/") + "未填写" };
    }
    var warehouse = null;
    var errMsgArr = [];
    warehouse = getData("warehouse_code", "" + request.enterprise.库存地代码, request.warehouseData);
    if (!warehouse) {
      errMsgArr.push("库存地代码");
    }
    if (errMsgArr.length > 0) {
      return { err: "行“" + (request.rowIndex + 1) + "”" + errMsgArr.join("/") + "不存在" };
    }
    var saveForm = {
      warehouse: warehouse.id,
      warehouse_address: "" + warehouse.warehouse_address,
      contacts: "" + warehouse.contacts,
      contact_phone: "" + warehouse.contact_phone,
      district: warehouse.district,
      area_name: "" + request.enterprise.库区名称,
      storage_env_cond: "" + request.enterprise.库区贮存环境条件,
      enable: 0
    };
    var areaName = "" + request.enterprise.库区名称;
    var enterpriseSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.inventory_area where area_name = '" + areaName + "'";
    var enterpriseRes = ObjectStore.queryByYonQL(enterpriseSql);
    if (enterpriseRes.length == 0) {
      //新增
      var insertTableRes = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.inventory_area", saveForm, "ybec66775e");
      if (insertTableRes != null) {
        return { type: "add" };
      } else {
        return { insertTableRes };
      }
    } else {
      //修改
      var updateForm = {
        id: "" + enterpriseRes[0].id,
        warehouse: warehouse.id,
        warehouse_address: "" + warehouse.warehouse_address,
        contacts: "" + warehouse.contacts,
        contact_phone: "" + warehouse.contact_phone,
        district: warehouse.district,
        area_name: "" + request.enterprise.库区名称,
        storage_env_cond: "" + request.enterprise.库区贮存环境条件
      };
      var updateTableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.inventory_area", updateForm, "ybec66775e");
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
function getData(key, name, arr) {
  if (name && arr) {
    for (var index = 0; index < arr.length; index++) {
      if (arr[index][key] == name) {
        return arr[index];
      }
    }
  }
  return null;
}
function convertNumbersToStrings(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "number") {
      if (!Object.prototype.toString.call(obj[key]) === "[object Date]" && !isNaN(obj[key].getTime())) {
        obj[key] = obj[key].toString();
      }
    }
  }
  return obj;
}