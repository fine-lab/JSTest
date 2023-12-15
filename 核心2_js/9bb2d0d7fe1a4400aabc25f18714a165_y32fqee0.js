let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var noConformSoleArr = [];
    if (request.enterprise.库位号 == null || request.enterprise.库位号 == "/" || request.enterprise.库位号 == "无") {
      noConformSoleArr.push("库位号");
    }
    if (request.enterprise.委托方企业编码 == null || request.enterprise.委托方企业编码 == "/" || request.enterprise.委托方企业编码 == "无") {
      noConformSoleArr.push("委托方企业编码");
    }
    if (request.enterprise.库区名称 == null || request.enterprise.库区名称 == "/" || request.enterprise.库区名称 == "无") {
      noConformSoleArr.push("库区名称");
    }
    if (request.enterprise.保税状态 == null || request.enterprise.保税状态 == "/" || request.enterprise.保税状态 == "无") {
      noConformSoleArr.push("保税状态");
    }
    if (request.enterprise.质量状态 == null || request.enterprise.质量状态 == "/" || request.enterprise.质量状态 == "无") {
      noConformSoleArr.push("质量状态");
    }
    if (noConformSoleArr.length > 0) {
      return { err: "行“" + (request.rowIndex + 1) + "”" + noConformSoleArr.join("/") + "未填写" };
    }
    var errMsgArr = [];
    var clientId = null;
    var clientCode = null;
    if (request.linkData.clientData[request.enterprise.委托方企业编码]) {
      clientId = request.linkData.clientData[request.enterprise.委托方企业编码].id;
      clientCode = request.linkData.clientData[request.enterprise.委托方企业编码].clientCode;
    } else {
      errMsgArr.push("委托方企业信息不存在，需要维护委托方企业信息后再进行导入");
    }
    var areaId = null;
    var area_warehouse_code = null;
    var area_district = null;
    if (request.linkData.areaData[request.enterprise.库区名称]) {
      areaId = request.linkData.areaData[request.enterprise.库区名称].id;
      area_warehouse_code = request.linkData.areaData[request.enterprise.库区名称].warehouse;
      area_district = request.linkData.areaData[request.enterprise.库区名称].area_district;
    } else {
      errMsgArr.push("库存地库区信息不存在，需要维护库存地库区信息后再进行导入");
    }
    var bondedStatus = null;
    if (request.enterprise.保税状态 == "Y") {
      bondedStatus = "1";
    } else if (request.enterprise.保税状态 == "N") {
      bondedStatus = "0";
    } else {
      errMsgArr.push("请输入正确的保税状态");
    }
    var qualityCode = "" + request.enterprise.质量状态;
    var qualityStatus = null;
    if (request.linkData.rangeData["A.12"][qualityCode]) {
      qualityStatus = request.linkData.rangeData["A.12"][qualityCode].id;
    } else {
      errMsgArr.push("请输入正确的属性状态");
    }
    var remark = null;
    if (request.enterprise.备注 != null && request.enterprise.备注 != "/" && request.enterprise.备注 != "无") {
      if (request.enterprise.备注.length > 200) {
        errMsgArr.push("备注长度已超过200字符");
      } else {
        remark = request.enterprise.备注;
      }
    }
    if (errMsgArr.length > 0) {
      return { err: "行“" + (request.rowIndex + 1) + "”" + errMsgArr.join("/") };
    }
    var locationCode = "" + request.enterprise.库位号;
    var enterpriseSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse_location where location_code = '" + locationCode + "' and client_information_code = '" + clientCode + "'";
    var enterpriseRes = ObjectStore.queryByYonQL(enterpriseSql);
    if (enterpriseRes.length == 0) {
      var saveForm = {
        location_code: locationCode,
        client_information: "" + clientId,
        inventory_area: "" + areaId,
        bonded_status: bondedStatus,
        quality_status: "" + qualityStatus,
        memo: "" + remark,
        client_information_code: "" + clientCode,
        area_warehouse_code: area_warehouse_code,
        area_district: area_district,
        enable: 0
      };
      //新增
      var insertTableRes = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse_location", saveForm, "warehouse_location");
      if (insertTableRes != null) {
        return { type: "add" };
      } else {
        return { insertTableRes };
      }
    } else {
      if (enterpriseRes[0].enable == "1") {
        return { err: "行“" + (request.rowIndex + 1) + "” 数据已启用" };
      }
      //修改
      var updateForm = {
        id: "" + enterpriseRes[0].id,
        location_code: locationCode,
        client_information: "" + clientId,
        inventory_area: "" + areaId,
        bonded_status: bondedStatus,
        quality_status: "" + qualityStatus,
        memo: "" + remark,
        client_information_code: "" + clientCode,
        area_warehouse_code: area_warehouse_code,
        area_district: area_district
      };
      var updateTableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.warehouse_location", updateForm, "warehouse_location");
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