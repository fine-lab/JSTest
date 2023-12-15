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
      return { err: "不存在或未成功导入，请先导入入库单" };
    }
    var tableId = clientCodeRes[0].id;
    //查询到货产品明细
    var ContractSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where WarehousingAcceptanceSheet_id='" + tableId + "'";
    var ContractRes = ObjectStore.queryByYonQL(ContractSql, "developplatform");
    var productCode = "" + request.importSubtable.产品编码;
    var the_product_name = "";
    var productobject = { product_coding: productCode };
    var productres = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", productobject);
    if (productres.length != 0) {
      productCode = productres[0].id;
      var masterId = productres[0].id;
      var UnitName = productres[0].unit;
      var whether_medical_equipment = productres[0].whether_medical_equipment; //是否医疗器械
      var warehouseStorage = productres[0].warehouse_storage_area_position_number_by_default;
    } else {
      return { err: "产品信息不存在，请建立产品首营信息后进行导入" };
    }
    //新增
    var startDates = request.importSubtable.生产日期;
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
    var endDates = request.importSubtable.有效期;
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
    //查询产品资格证中数据
    var object = { productInformation_id: productCode, product_code: "" + request.importSubtable.产品编码 };
    var resSon = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica", object);
    if (resSon.length != 0) {
      var product_certificate_date = "" + resSon[0].product_certificate_date;
      product_certificate_date = new Date(product_certificate_date).getTime();
      var product_certificate_dates = "";
      var product_certificate_datess = "";
      var product_date = "";
      var product_date1 = "";
      //生产企业
      var productionName = "";
      var productionNames = "";
      var storageConditions = "";
      the_product_name = "";
      //产品注册证号/备案凭证号
      var productUmber = "";
      var nameRegistrant = "";
      //规格型号
      var specifications = "";
      var product_certificate_data = "";
      for (var i = 0; i < resSon.length; i++) {
        //获取有效期
        product_certificate_dates = new Date(resSon[i].product_certificate_date).getTime();
        //获取批准日期
        product_date = new Date(resSon[i].product_date).getTime();
        //获取生产日期
        var newDate = new Date(startDates).getTime();
        if (newDate <= product_certificate_dates && product_date <= newDate) {
          if (product_date >= product_date1) {
            //生产企业
            productionName = resSon[i].production_enterprise_code;
            productionNames = resSon[i].production_enterprise_name;
            storageConditions = resSon[i].storage_conditions;
            the_product_name = resSon[i].product_name;
            //产品注册证号/备案凭证号
            productUmber = resSon[i].product_umber;
            //注册人/备案人名称
            nameRegistrant = resSon[i].nameRegistrant;
            //规格型号
            specifications = resSon[i].specifications;
            product_certificate_data = resSon[0].product_certificate_date;
            product_date1 = product_date;
          }
        }
      }
    } else {
      return { err: "未查询到产品注册证，请建立产品注册证后进行导入" };
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
    var insertSubtable = {
      WarehousingAcceptanceSheet_id: tableId,
      product_name: the_product_name,
      AdvanceArrivalNoticeNo: code,
      Company: UnitName,
      Enterprise: productionName, //生产企业
      new26: productionNames, //生产企业
      conditions: storageConditions,
      Location_No: warehouseStorage, //入库存储区货位号
      registration_number: productUmber, //产品注册证号/备案凭证号
      registrant: nameRegistrant, //注册人/备案人名称
      model: specifications, //规格型号
      date_manufacture: startDates,
      product_code: productCode,
      Confirm_status: "0",
      storageState: "1",
      term_validity: endDates, //有效期
      batch_number: "" + request.importSubtable["生产批号/序列号"],
      quantity: request.importSubtable.数量,
      Qualified_quantity: request.importSubtable.数量 - request.importSubtable.不合格数 - request.importSubtable.隔离数,
      NoQualified_quantity: request.importSubtable.不合格数,
      Isolation_number: request.importSubtable.隔离数,
      ui: request.importSubtable.PI码数据,
      di: request.importSubtable.DI码数据,
      udi: request.importSubtable.UDI二维码数据,
      _status: "Insert"
    };
    //获取复核状态
    var storageState = clientCodeRes[0].storageState;
    if (ContractRes.length > 0 && storageState == "0") {
      var id = ContractRes[0].id;
      insertSubtable = {
        id: id,
        WarehousingAcceptanceSheet_id: tableId,
        product_name: the_product_name,
        AdvanceArrivalNoticeNo: code,
        Company: UnitName,
        Enterprise: productionName, //生产企业
        new26: productionNames, //生产企业
        conditions: storageConditions,
        Location_No: warehouseStorage, //入库存储区货位号
        registration_number: productUmber, //产品注册证号/备案凭证号
        registrant: nameRegistrant, //注册人/备案人名称
        model: specifications, //规格型号
        date_manufacture: startDates,
        product_code: productCode,
        Confirm_status: "0",
        storageState: "1",
        term_validity: endDates, //有效期
        batch_number: "" + request.importSubtable["生产批号/序列号"],
        quantity: request.importSubtable.数量,
        Qualified_quantity: request.importSubtable.数量,
        NoQualified_quantity: request.importSubtable.不合格数,
        Isolation_number: request.importSubtable.隔离数,
        ui: request.importSubtable.PI码数据,
        di: request.importSubtable.DI码数据,
        udi: request.importSubtable.UDI二维码数据,
        _status: "Insert"
      };
      //更新实体
      var insertSubtableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis", insertSubtable, "yb00c549d1");
      if (insertSubtableRes != null) {
        return { type: "add" };
      } else {
        return { insertSubtableRes };
      }
    } else {
      //新增实体
      var insertSubtableRes = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis", insertSubtable, "yb00c549d1");
      if (insertSubtableRes != null) {
        return { type: "add" };
      } else {
        return { insertSubtableRes };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });