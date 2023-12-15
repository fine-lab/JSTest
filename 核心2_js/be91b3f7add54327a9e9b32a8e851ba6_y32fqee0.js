let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "" + request.importSubtable["预到货通知单号(ASN)"];
    var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet where AdvanceArrivalNoticeNo='" + code + "'";
    var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
    if (
      code == null ||
      request.importSubtable.产品编码 == null ||
      request.importSubtable.生产日期 == null ||
      request.importSubtable["生产批号/序列号"] == null ||
      request.importSubtable.有效期 == null ||
      request.importSubtable.数量 == null ||
      request.importSubtable.不合格数 == null ||
      request.importSubtable.隔离数 == null
    ) {
      return { err: "有必填项为空，需要维护后再进行导入" };
    }
    if (clientCodeRes.length == 0) {
    } else {
      var tableId = clientCodeRes[0].id;
    }
    var sum = request.importSubtable.数量 - request.importSubtable.不合格数 - request.importSubtable.隔离数;
    if (sum < 0) {
      return { err: "数量小于不合格数与隔离数之和，请确认后进行导入" };
    }
    //查询到货产品明细
    var ContractSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where WarehousingAcceptanceSheet_id='" + tableId + "'";
    var ContractRes = ObjectStore.queryByYonQL(ContractSql, "developplatform");
    var productCode = "" + request.importSubtable.产品编码;
    var the_product_name = "";
    var productobject = { product_coding: productCode };
    var productres = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", productobject);
    if (productres.length != 0) {
      productCode = productres[0].id;
      the_product_name = productres[0].the_product_name;
      var masterId = productres[0].id;
      var UnitName = productres[0].unit;
      var warehouseStorage = productres[0].warehouse_storage_area_position_number_by_default;
    } else {
      return { err: "产品信息不存在，请建立产品首营信息后进行导入" };
    }
    //新增
    var startDates = request.importSubtable.生产日期;
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
    var endDates = request.importSubtable.有效期;
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
    //查询产品资格证中数据
    var object = { productInformation_id: productCode, product_code: "" + request.importSubtable.产品编码 };
    var resSon = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica", object);
    if (resSon.length != 0) {
      var product_certificate_date = "" + resSon[0].product_certificate_date;
      product_certificate_date = new Date(product_certificate_date).getTime();
      var product_certificate_dates = "";
      for (var i = 0; i < resSon.length; i++) {
        product_certificate_dates = new Date(resSon[i].product_certificate_date).getTime();
        if (product_certificate_date <= product_certificate_dates) {
          //生产企业
          var productionName = resSon[i].production_enterprise_code;
          var productionNames = resSon[i].production_enterprise_name;
          var storageConditions = resSon[i].storage_conditions;
          //产品注册证号/备案凭证号
          var productUmber = resSon[i].product_umber;
          //注册人/备案人名称
          var nameRegistrant = resSon[i].nameRegistrant;
          //规格型号
          var specifications = resSon[i].specifications;
          var product_certificate_data = resSon[0].product_certificate_date;
        }
      }
    } else {
      var productionName = "";
      var productionNamesd = "";
      var storageConditions = "";
      //产品注册证号/备案凭证号
      var productUmber = "";
      //注册人/备案人名称
      var nameRegistrant = "";
      //规格型号
      var specifications = "";
    }
    var boolean = "true";
    return { boolean };
  }
}
exports({ entryPoint: MyAPIHandler });