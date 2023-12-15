let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    request.information = convertNumbersToStrings(request.information);
    var code = "" + request.information.委托方企业编码;
    var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation where clientCode='" + code + "'";
    var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
    var information = request.information;
    var s = information["许可期限止"];
    if (s != "/" && s != "无") {
      //判断获取的日期是什么类型是number的话就处理日期
      var hasNumber = typeof s;
      if (hasNumber == "number") {
        var format = "-";
        let time = new Date((s - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
        let year = time.getFullYear() + "";
        let month = time.getMonth() + 1 + "";
        let date = time.getDate() + "";
        const hours = time.getHours().toLocaleString();
        const minutes = time.getMinutes();
        if (format && format.length === 1) {
          s = year + format + month + format + date + " " + hours + ":" + minutes;
        }
        s = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
      }
    } else {
      s = "";
    }
    var timezone = 8; //目标时区时间，东八区
    // 本地时间和格林威治的时间差，单位为分钟
    var offset_GMT = new Date().getTimezoneOffset();
    // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
    var nowDate = new Date().getTime();
    var dateT = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    let expiryDate_Date = new Date(s).getTime();
    let NowDate = (expiryDate_Date - dateT.getTime()) / (1000 * 3600 * 24);
    let fromDate = s;
    let fromDate_Date = new Date(fromDate).getTime();
    let NewDate = (fromDate_Date - nowDate) / (1000 * 3600 * 24);
    if (NewDate > 0) {
      var IsEarlywarning = 0;
    } else {
      var IsEarlywarning = 1;
    }
    var startDates = request.importSubtable.开始委托时间;
    if (startDates != "/" && startDates != "无") {
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
    var endDates = request.importSubtable.停止委托时间;
    if (endDates != "/" && endDates != "无") {
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
    //获取是否生产企业
    var whether = "" + information.是否生产企业;
    if (whether == "0") {
      whether == "1";
    } else {
      if (whether == "1") {
        whether == "0";
      }
    }
    if (clientCodeRes.length == 0) {
      var clientName = "" + information.委托方企业名称;
      var clientCode = "" + information.委托方企业编码;
      var businessLicense = "" + information.营业执照号;
      var location = "" + information.住所;
      var representative = "" + information.法定代表人;
      var principal = "" + information.企业负责人;
      var businessAddr = "" + information.生产或经营场所;
      var storageAddr = "" + information.库房地址;
      var licenseNocertificate = "" + information.生产或经营许可证号;
      var licenseNocertificateNo = "" + information.生产或经营备案凭证号;
      var expiryDate = s;
      var businessScope = "" + information.生产或经营范围;
      var Issuer = "" + information.发证机关;
      var isIncludeTrans = "" + information.是否委托运输;
      var errorMessage = [];
      if ("0" == isIncludeTrans || "1" == isIncludeTrans) {
      } else {
        errorMessage.push("是否委托运输字段值类型错误，请校验后后再进行导入");
      }
      var contractYear = "" + request.importSubtable.委托期限;
      var isEntrustTag = "" + request.importSubtable.是否委托加贴中文标;
      var EntrustBusiScope = "" + request.importSubtable.委托业务范围;
      var notRequiredArr = [];
      if (checkIsNull(information.委托方企业编码)) {
        notRequiredArr.push("委托方企业编码");
      }
      if (checkIsNull(information.委托方企业名称)) {
        notRequiredArr.push("委托方企业名称");
      }
      if (checkIsNull(information.营业执照号)) {
        notRequiredArr.push("营业执照号");
      }
      if (checkIsNull(information.委托方统一社会信用代码)) {
        notRequiredArr.push("委托方统一社会信用代码");
      }
      if (checkIsNull(information.住所)) {
        notRequiredArr.push("住所");
      }
      if (checkIsNull(information.法定代表人)) {
        notRequiredArr.push("法定代表人");
      }
      if (checkIsNull(information.企业负责人)) {
        notRequiredArr.push("企业负责人");
      }
      if (checkIsNull(information.生产或经营场所)) {
        notRequiredArr.push("生产或经营场所");
      }
      if (checkIsNull(information.库房地址)) {
        notRequiredArr.push("库房地址");
      }
      if (checkIsNull(information.发证机关)) {
        notRequiredArr.push("发证机关");
      }
      if (checkIsNull(information.委托业务范围)) {
        notRequiredArr.push("委托业务范围");
      } else {
        if (checkIsNull(information.部分委托产品类别) && information.委托业务范围 == "100102") {
          notRequiredArr.push("部分委托产品类别");
        }
      }
      if (checkIsNull(information.库存地代码)) {
        notRequiredArr.push("库存地代码");
      }
      if (checkIsNull(information.贮存运输类型)) {
        notRequiredArr.push("贮存运输类型");
      }
      if (checkIsNull(information.是否生产企业)) {
        notRequiredArr.push("是否生产企业");
      }
      if (notRequiredArr.length > 0) {
        errorMessage.push(notRequiredArr.join("/") + "为空，需要维护后再进行导入");
      }
      // 过时代码暂且保留
      var errorArr = [];
      var warehouseId = getData("warehouse_code", "" + information.库存地代码, request.warehouse);
      if (!warehouseId) {
        errorArr.push("库存地代码");
      } else {
        warehouseId = warehouseId.id;
      }
      var rangeId = getData("dict_code", "" + information.贮存运输类型, request.range_code);
      if (!rangeId) {
        errorArr.push("贮存运输类型");
      } else {
        rangeId = rangeId.id;
      }
      var rangeId2 = getData("dict_code", "" + information.委托业务范围, request.range_code2);
      if (!rangeId2) {
        errorArr.push("委托业务范围");
      } else {
        rangeId2 = rangeId2.id;
      }
      if (errorArr.length > 0) {
        errorMessage.push(errorArr.join("/") + "不存在");
      }
      var errorDateArr = [];
      if (!isDate(information.许可证发证日期)) {
        errorDateArr.push("许可证发证日期");
      }
      if (!isDate(information.备案证备案日期)) {
        errorDateArr.push("备案证备案日期");
      }
      if (!isDate(information.许可期限始)) {
        errorDateArr.push("许可期限始");
      }
      if (errorDateArr.length > 0) {
        errorMessage.push("请输入正确的" + errorDateArr.join("/") + "有效日期");
      }
      if (errorMessage.length > 0) {
        return { err: errorMessage.join("、") };
      }
      var mainTable = {
        clientName: clientName,
        clientCode: clientCode,
        businessLicense: businessLicense,
        location: location,
        representative: representative,
        principal: principal,
        businessAddr: businessAddr,
        storageAddr: storageAddr,
        licenseNocertificate: licenseNocertificate,
        licenseNocertificateNo: licenseNocertificateNo,
        expiryDate: expiryDate,
        businessScope: businessScope,
        Issuer: Issuer,
        isIncludeTrans: isIncludeTrans,
        fromDate: startDates,
        toDate: endDates,
        IsEarlywarning: IsEarlywarning,
        contractYear: request.importSubtable.委托期限,
        isEntrustTag: "" + request.importSubtable.是否委托加贴中文标,
        EntrustBusiScopeRef: rangeId2,
        whether: whether,
        enable: 0,
        uscc: "" + information.委托方统一社会信用代码,
        license_issue_date: information.许可证发证日期 ? formatData(information.许可证发证日期) : "",
        certificate_record_date: information.备案证备案日期 ? formatData(information.备案证备案日期) : "",
        license_period_start_date: information.许可期限始 ? formatData(information.许可期限始) : "",
        warehouse: warehouseId,
        part_of_product_type: information.部分委托产品类别 ? "" + information.部分委托产品类别 : null,
        store_transport_type: rangeId,
        protocol_attachment_file_name: null
      };
      var mainTableRes = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", mainTable, "d3e1247e");
      if (mainTableRes != null) {
        return { type: "add" };
      } else {
        return { mainTableRes };
      }
    } else {
      var id = clientCodeRes[0].id;
      var clientName = "" + information.委托方企业名称;
      var clientCode = "" + information.委托方企业编码;
      var businessLicense = "" + information.营业执照号;
      var location = "" + information.住所;
      var representative = "" + information.法定代表人;
      var principal = "" + information.企业负责人;
      var businessAddr = "" + information.生产或经营场所;
      var storageAddr = "" + information.库房地址;
      var licenseNocertificate = "" + information.生产或经营许可证号;
      var licenseNocertificateNo = "" + information.生产或经营备案凭证号;
      var expiryDate = s;
      var businessScope = "" + information.生产或经营范围;
      var Issuer = "" + information.发证机关;
      var isIncludeTrans = "" + information.是否委托运输;
      var errorMessage = [];
      if ("0" == isIncludeTrans || "1" == isIncludeTrans) {
      } else {
        errorMessage.push("是否委托运输字段值类型错误，请校验后后再进行导入");
      }
      var contractYear = "" + request.importSubtable.委托期限;
      var isEntrustTag = "" + request.importSubtable.是否委托加贴中文标;
      var EntrustBusiScope = "" + request.importSubtable.委托业务范围;
      var notRequiredArr = [];
      if (checkIsNull(information.委托方企业编码)) {
        notRequiredArr.push("委托方企业编码");
      }
      if (checkIsNull(information.委托方企业名称)) {
        notRequiredArr.push("委托方企业名称");
      }
      if (checkIsNull(information.营业执照号)) {
        notRequiredArr.push("营业执照号");
      }
      if (checkIsNull(information.委托方统一社会信用代码)) {
        notRequiredArr.push("委托方统一社会信用代码");
      }
      if (checkIsNull(information.住所)) {
        notRequiredArr.push("住所");
      }
      if (checkIsNull(information.法定代表人)) {
        notRequiredArr.push("法定代表人");
      }
      if (checkIsNull(information.企业负责人)) {
        notRequiredArr.push("企业负责人");
      }
      if (checkIsNull(information.生产或经营场所)) {
        notRequiredArr.push("生产或经营场所");
      }
      if (checkIsNull(information.库房地址)) {
        notRequiredArr.push("库房地址");
      }
      if (checkIsNull(information.发证机关)) {
        notRequiredArr.push("发证机关");
      }
      if (checkIsNull(information.委托业务范围)) {
        notRequiredArr.push("委托业务范围");
      } else {
        if (checkIsNull(information.部分委托产品类别) && information.委托业务范围 == "100102") {
          notRequiredArr.push("部分委托产品类别");
        }
      }
      if (checkIsNull(information.库存地代码)) {
        notRequiredArr.push("库存地代码");
      }
      if (checkIsNull(information.贮存运输类型)) {
        notRequiredArr.push("贮存运输类型");
      }
      if (checkIsNull(information.是否生产企业)) {
        notRequiredArr.push("是否生产企业");
      }
      if (notRequiredArr.length > 0) {
        errorMessage.push(notRequiredArr.join("/") + "为空，需要维护后再进行导入");
      }
      var errorArr = [];
      var warehouseId = getData("warehouse_code", "" + information.库存地代码, request.warehouse);
      if (!warehouseId) {
        errorArr.push("库存地代码");
      } else {
        warehouseId = warehouseId.id;
      }
      var rangeId = getData("dict_code", "" + information.贮存运输类型, request.range_code);
      if (!rangeId) {
        errorArr.push("贮存运输类型");
      } else {
        rangeId = rangeId.id;
      }
      var rangeId2 = getData("dict_code", "" + information.委托业务范围, request.range_code2);
      if (!rangeId2) {
        errorArr.push("委托业务范围");
      } else {
        rangeId = rangeId.id;
      }
      if (errorArr.length > 0) {
        errorMessage.push(errorArr.join("/") + "不存在");
      }
      var errorDateArr = [];
      if (!isDate(information.许可证发证日期)) {
        errorDateArr.push("许可证发证日期");
      }
      if (!isDate(information.备案证备案日期)) {
        errorDateArr.push("备案证备案日期");
      }
      if (!isDate(information.许可期限始)) {
        errorDateArr.push("许可期限始");
      }
      if (errorDateArr.length > 0) {
        errorMessage.push("请输入正确的" + errorDateArr.join("/") + "有效日期");
      }
      if (errorMessage.length > 0) {
        return { err: errorMessage.join("、") };
      }
      var updateTable = {
        id: id,
        clientName: clientName,
        clientCode: clientCode,
        businessLicense: businessLicense,
        location: location,
        representative: representative,
        principal: principal,
        businessAddr: businessAddr,
        storageAddr: storageAddr,
        licenseNocertificate: licenseNocertificate,
        licenseNocertificateNo: licenseNocertificateNo,
        expiryDate: expiryDate,
        businessScope: businessScope,
        Issuer: Issuer,
        enable: 0,
        isIncludeTrans: isIncludeTrans,
        fromDate: startDates,
        toDate: endDates,
        IsEarlywarning: IsEarlywarning,
        contractYear: "" + request.importSubtable.委托期限,
        EntrustBusiScopeRef: rangeId2,
        isEntrustTag: "" + request.importSubtable.是否委托加贴中文标,
        whether: whether,
        uscc: "" + information.委托方统一社会信用代码,
        license_issue_date: information.许可证发证日期 ? formatData(information.许可证发证日期) : "",
        certificate_record_date: information.备案证备案日期 ? formatData(information.备案证备案日期) : "",
        license_period_start_date: information.许可期限始 ? formatData(information.许可期限始) : "",
        warehouse: warehouseId,
        part_of_product_type: information.部分委托产品类别 ? "" + information.部分委托产品类别 : null,
        store_transport_type: rangeId,
        protocol_attachment_file_name: null
      };
      var updateTableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", updateTable, "d3e1247e");
      if (updateTableRes != null) {
        return { type: "change" };
      } else {
        return { updateTableRes };
      }
    }
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
function getStr(o) {
  return o == null || o == "" ? "" + o : "";
}
function isDate(d) {
  if (d == null || d == "" || d == "/" || d == "无") {
    return true;
  }
  var date = new Date(d);
  return !isNaN(date.getTime());
}
function formatData(d) {
  if (d != "/" && d != "无") {
    //判断获取的日期是什么类型是number的话就处理日期
    var hasNumber = typeof d;
    if (hasNumber == "number") {
      var format = "-";
      let time = new Date((d - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000);
      let year = time.getFullYear() + "";
      let month = time.getMonth() + 1 + "";
      let date = time.getDate() + "";
      const hours = time.getHours().toLocaleString();
      const minutes = time.getMinutes();
      if (format && format.length === 1) {
        d = year + format + month + format + date + " " + hours + ":" + minutes;
      }
      d = year + format + (month < 10 ? "0" + month : month) + format + (date < 10 ? "0" + date : date);
    }
  } else {
    d = "";
  }
  return d;
}
function checkIsNull(str) {
  if (str == null || str == "" || str == "/" || str == "无") {
    return true;
  }
  return false;
}
function convertNumbersToStrings(obj) {
  for (var key in obj) {
    if (typeof obj[key] === "number" && !isNaN(obj[key]) && !isDateValid(key)) {
      obj[key] = obj[key].toString();
    }
  }
  return obj;
}
function isDateValid(dateName) {
  if (dateName.indexOf("开始委托时间") > -1) {
    return true;
  } else if (dateName.indexOf("开始委托时间") > -1) {
    return true;
  } else if (dateName.indexOf("停止委托时间") > -1) {
    return true;
  } else if (dateName.indexOf("许可期限止") > -1) {
    return true;
  } else if (dateName.indexOf("许可证发证日期") > -1) {
    return true;
  } else if (dateName.indexOf("备案证备案日期") > -1) {
    return true;
  } else if (dateName.indexOf("许可期限始") > -1) {
    return true;
  }
  return false;
}