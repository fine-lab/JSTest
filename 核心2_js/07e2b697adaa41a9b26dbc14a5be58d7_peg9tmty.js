let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "" + request.information["预到货通知单号(ASN)"];
    if (code == null || request.information.ASN创建日期 == null || request.information["客户编码(委托方企业)"] == null) {
      return { err: "有必填项为空，需要维护后再进行导入" };
    }
    var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet where AdvanceArrivalNoticeNo='" + code + "'";
    var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
    var information = request.information;
    var s = information.ASN创建日期;
    if (s != "/") {
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
    var AdvanceArrivalNoticeNo = "" + information["预到货通知单号(ASN)"];
    var the_client_code = "" + information["客户编码(委托方企业)"];
    var the_client_name = "";
    var clientObject = { clientCode: the_client_code };
    var clientList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", clientObject);
    if (clientList.length != 0) {
      the_client_code = clientList[0].id;
      the_client_name = clientList[0].clientName;
      var timezone = 8; //目标时区时间，东八区
      // 本地时间和格林威治的时间差，单位为分钟
      var offset_GMT = new Date().getTimezoneOffset();
      // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var nowDate = new Date().getTime();
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      // 当前日期时间戳
      var endDate = new Date(date).getTime();
      // 开始委托时间
      let fromDate = clientList[0].fromDate;
      let fromDate_date = new Date(fromDate);
      let fromDate_time = fromDate_date.getTime();
      // 停止委托时间
      let toDate = clientList[0].toDate;
      let toDate_date = new Date(toDate);
      let toDate_time = toDate_date.getTime();
      // 备案凭证有效期
      let expiryDate = clientList[0].expiryDate;
      let expiryDate_date = new Date(expiryDate);
      let expiryDate_time = expiryDate_date.getTime();
      if (endDate > fromDate_time && endDate < toDate_time && endDate < expiryDate_time) {
      } else {
        return { err: "委托方合同不在有效期内不可新增！" };
      }
    } else {
      return { err: "委托方企业信息不存在，需要维护委托方企业信息后再进行导入" };
    }
    var currentUser = JSON.parse(AppContext()).currentUser;
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    //获取当前时间
    let yy = new Date().getFullYear() + "-";
    let mm = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) + "-" : new Date().getMonth() + 1 + "-";
    let dd = new Date().getDate() + " ";
    let hh = new Date().getHours() + 8 + ":";
    let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() + ":" : new Date().getMinutes() + ":";
    let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
    var currentDate = yy + mm + dd;
    //校验子表
    var insertSubtable = new Array();
    for (var i = 0; i < request.importSubtable.length; i++) {
      var code = "" + request.importSubtable[i]["预到货通知单号(ASN)"];
      if (
        code == null ||
        request.importSubtable[i].产品编码 == null ||
        request.importSubtable[i].生产日期 == null ||
        request.importSubtable[i]["生产批号/序列号"] == null ||
        request.importSubtable[i].有效期 == null ||
        request.importSubtable[i].数量 == null ||
        request.importSubtable[i].不合格数 == null ||
        request.importSubtable[i].隔离数 == null
      ) {
        return { err: "有必填项为空，需要维护后再进行导入" };
      }
      var productCode = "" + request.importSubtable[i].产品编码;
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
      var startDates = request.importSubtable[i].生产日期;
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
      var endDates = request.importSubtable[i].有效期;
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
      var object = { productInformation_id: productCode, product_code: "" + request.importSubtable[i].产品编码 };
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
        for (var j = 0; j < resSon.length; j++) {
          //获取有效期
          product_certificate_dates = new Date(resSon[j].product_certificate_date).getTime();
          //获取批准日期
          product_date = new Date(resSon[j].product_date).getTime();
          //获取生产日期
          var newDate = new Date(startDates).getTime();
          if (newDate <= product_certificate_dates && product_date <= newDate) {
            if (product_date >= product_date1) {
              //生产企业
              productionName = resSon[j].production_enterprise_code;
              productionNames = resSon[j].production_enterprise_name;
              storageConditions = resSon[j].storage_conditions;
              the_product_name = resSon[j].product_name;
              //产品注册证号/备案凭证号
              productUmber = resSon[j].product_umber;
              //注册人/备案人名称
              nameRegistrant = resSon[j].nameRegistrant;
              //规格型号
              specifications = resSon[j].specifications;
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
      insertSubtable.push({
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
        batch_number: "" + request.importSubtable[i]["生产批号/序列号"],
        quantity: request.importSubtable[i].数量,
        Qualified_quantity: request.importSubtable[i].数量 - request.importSubtable[i].不合格数 - request.importSubtable[i].隔离数,
        NoQualified_quantity: request.importSubtable[i].不合格数,
        Isolation_number: request.importSubtable[i].隔离数,
        ui: request.importSubtable[i].PI码数据,
        di: request.importSubtable[i].DI码数据,
        udi: request.importSubtable[i].UDI二维码数据
      });
    }
    //判断入库单是否存在
    if (clientCodeRes.length == 0) {
      var mainTable = {
        Makingpeople: currentUser.name,
        Makethedate: currentdate,
        the_client_name: the_client_name,
        AdvanceArrivalNoticeNo: AdvanceArrivalNoticeNo,
        the_client_code: the_client_code,
        ASN_date_created: s,
        enable: 0,
        Confirmthestatus: 0,
        Inbounddate: currentdate,
        Storagetype: 1,
        storageState: 1,
        product_lisList: insertSubtable
      };
      //插入实体
      var mainTableRes = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", mainTable, "e84ee900");
      if (mainTableRes != null) {
        return { type: "add" };
      } else {
        return { mainTableRes };
      }
    } else {
      //获取复核状态
      var storageState = clientCodeRes[0].storageState;
      var id = clientCodeRes[0].id;
      //判断已存在入库单状态，根据状态进行更新
      if (storageState == "2") {
        var mainTable = {
          id: id,
          Makingpeople: currentUser.name,
          Makethedate: currentdate,
          the_client_name: the_client_name,
          AdvanceArrivalNoticeNo: AdvanceArrivalNoticeNo,
          the_client_code: the_client_code,
          ASN_date_created: s,
          enable: 0,
          Confirmthestatus: 0,
          Inbounddate: currentdate,
          Storagetype: "1",
          storageState: 1,
          product_lisList: insertSubtable
        };
        //更新实体
        var mainTableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", mainTable, "e84ee900");
        if (mainTableRes != null) {
          return { type: "change" };
        } else {
          return { mainTableRes };
        }
      } else {
        var mainTable = {
          id: id
        };
        //更新实体
        var mainTableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", mainTable, "e84ee900");
        return { err: "已存在，需要删除才能上传" };
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });