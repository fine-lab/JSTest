let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "" + request.importSubtable.出库单号;
    var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo where DeliveryorderNo='" + code + "' and dr = 0";
    var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
    if (clientCodeRes.length == 0) {
      return { err: "出库单" + code + "不存在或未成功导入，请先导入出库单" + code };
    }
    //新增
    var tableId = clientCodeRes[0].id;
    //获取委托方企业编码
    var ClientCode = clientCodeRes[0].ClientCode;
    var batchNumber = "" + request.importSubtable["生产批号/序列号"];
    var productCode = "" + request.importSubtable.产品编码;
    //查询产品信息表
    var objectSon = { product_coding: productCode };
    var resSon = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", objectSon);
    if (resSon.length != 0) {
      var sonId = resSon[0].id;
      var sonName = resSon[0].the_product_name;
      var specifications = resSon[0].specifications;
      var production_enterprise_code = resSon[0].production_enterprise_code;
      //产品注册证/备案凭证号
      var product_registration_number = resSon[0].product_registration_number;
      //获取单位
      var companyName = resSon[0].unit;
      //获取储运条件
      var conditionsName = resSon[0].storage_and_transportation_conditions;
      //获取库位
      var warehouse_storage_area_position_number_by_default = resSon[0].warehouse_storage_area_position_number_by_default;
    } else {
      return { err: "出库单明细" + code + "产品信息不存在，请建立产品首营信息后进行导入" };
      var sonId = "";
      var sonName = "";
    }
    //查询产品信息子表
    var objectSonSub = { productInformation_id: sonId };
    var resSonSub = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica", objectSonSub);
    if (resSonSub.length != 0) {
      var nameRegistrant = resSonSub[0].nameRegistrant;
    } else {
      var nameRegistrant = "";
    }
    //根据委托方id，查询委托方编码
    var clientObject = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where id='" + ClientCode + "' and dr = 0";
    var clientList = ObjectStore.queryByYonQL(clientObject, "developplatform");
    if (clientList.length != 0) {
      var clientCodes = clientList[0].clientCode;
    } else {
      var clientCodes = "";
    }
    //实体查询库存
    let body = {
      warehouseCode: clientCodes,
      batch_nbr: batchNumber
    };
    var resList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.upsInventory", body);
    //获取缓存中的库存信息
    var cc = JSON.stringify(request.localStorageArr); //
    var gg = JSON.parse(cc);
    var key = "" + request.importSubtable.产品编码 + batchNumber + clientCodes;
    var hh = gg.key;
    var resList = JSON.parse(hh);
    var zhiliangzhuangkuang = "";
    if (cc.hasOwnProperty(key)) {
      //查看日期类型
      zhiliangzhuangkuang = resList.inventory_status;
      //有效期
      var termValidity = resList.xpire_dat;
      //生产日期
      var dateManufacture = resList.mfg_date;
      remarks = "";
      //生产企业名称
      enterpriseName = resList.enterprise_name;
      //产品名称
      sonName = resList.producrName;
      //产品注册证/备案凭证号
      product_registration_number = resList.product_umber;
      //获取单位
      companyName = resList.unit;
      //获取储运条件
      conditionsName = resList.transportation_conditions;
      //获取库位
      warehouse_storage_area_position_number_by_default = resList.location;
      //获取注册人备案人名称
      nameRegistrant = resList.registrant;
    } else {
      //查询入库单
      var objectA = { the_client_code: ClientCode };
      var resA = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", objectA);
      //查询到货产品明细
      var object = { batch_number: batchNumber, product_code: sonId };
      var res = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis", object);
      if (res.length != 0) {
        for (var m = 0; m < resA.length; m++) {
          for (var n = 0; n < res.length; n++) {
            if (resA[m].id == res[n].WarehousingAcceptanceSheet_id) {
              //生产企业名称
              var enterpriseName = res[n].new26;
              //生产日期
              var dateManufacture = res[n].date_manufacture;
              //有效期
              var termValidity = res[n].term_validity;
              //产品名称
              sonName = res[n].product_name;
              //产品注册证/备案凭证号
              product_registration_number = res[n].registration_number;
              //获取单位
              companyName = res[n].Company;
              //获取储运条件
              conditionsName = res[n].conditions;
              //获取库位
              warehouse_storage_area_position_number_by_default = res[n].Location_No;
              nameRegistrant = res[n].registrant;
              var remarks = "";
              //获取ui
              var UI = res[n].ui;
              //获取di
              var DI = res[n].di;
              //获取udi
              var UDI = res[n].udi;
            }
          }
        }
      } else {
        remarks = "";
        enterpriseName = "";
        dateManufacture = "";
        termValidity = "";
        remarks = "未查询到库存信息 、没有匹配到符合条件的入库信息";
        //获取ui
        var UI = "";
        //获取di
        var DI = "";
        //获取udi
        var UDI = "";
      }
    }
    //查询生产企业信息
    var object = { production_name: enterpriseName };
    var resProd = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production", object);
    if (resProd.length != 0) {
      var productionName = resProd[0].id;
    } else {
      var productionName = "";
    }
    var insertSubtable = {
      id: tableId,
      IssueDetailsList: [
        {
          deliveryOrderNo: "" + code,
          company: companyName, //单位
          productionEnterprise: productionName,
          storageCondition: conditionsName,
          productRegisterNo: product_registration_number, //产品注册证productName
          productionDate: dateManufacture,
          termOfValidity: termValidity,
          productName: sonId,
          productCode: sonName,
          batchNumber: "" + request.importSubtable["生产批号/序列号"],
          quantity: request.importSubtable.数量,
          remarks: remarks,
          registrant: nameRegistrant, //注册人/备案人名称
          productionEnterprise: production_enterprise_code, //生产企业编码
          warehouseLocation: warehouse_storage_area_position_number_by_default, //库位
          specification: specifications,
          ConfirmStatus: "0",
          checkStatus: "1",
          zhiliangzhuangkuang: zhiliangzhuangkuang,
          ProductionEnterprisName: enterpriseName,
          ui: UI,
          di: DI,
          new20: UDI,
          _status: "Insert"
        }
      ]
    };
    var insertSubtableRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", insertSubtable, "93ffc3ce");
    return { insertSubtableRes };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });