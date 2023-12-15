let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "" + request.information.出库单号;
    var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo where DeliveryorderNo='" + code + "'";
    var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
    if (clientCodeRes.length == 0) {
      var information = request.information;
      var DeliveryorderNo = "" + information.出库单号;
      if (information.购货者编码 != "/") {
        var BuyerCode = "" + information.购货者编码;
        var BuyerObject = { BuyersCode: BuyerCode };
        var BuyerCodeList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", BuyerObject);
        if (BuyerCodeList.length != 0) {
          BuyerCode = BuyerCodeList[0].id;
        } else {
          return { err: "购货者信息不存在，请建立购货者信息再进行导入" };
        }
      } else {
        var BuyerCode = "" + information.购货者编码;
      }
      var BuyerName = "" + information.购货者名称;
      var ClientCode = "" + information.委托方企业编码;
      var the_client_name = "";
      var clientObject = { clientCode: ClientCode };
      var clientList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", clientObject);
      if (clientList.length != 0) {
        ClientCode = clientList[0].id;
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
        return { err: "出库单" + ClientCode + "委托方企业信息不存在，请建立委托方企业信息再进行导入" };
      }
      var CustomerName = "" + information.收货客户名称;
      var ShipToAddress = "" + information.收货地址;
      var Contacts = "" + information.联系人;
      var ContactInformation = "" + information.联系方式;
      var object = { BuyersCode: BuyerCode };
      var buyersRes = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", object);
      if (buyersRes.length != 0) {
        BuyerCode = buyersRes[0].id;
        BuyerName = buyersRes[0].BuyersName;
      }
      //获取当前时间
      let yy = new Date().getFullYear() + "-";
      let mm = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) + "-" : new Date().getMonth() + 1 + "-";
      let dd = new Date().getDate() + " ";
      let hh = new Date().getHours() + 8 + ":";
      let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() + ":" : new Date().getMinutes() + ":";
      let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
      var currentDate = yy + mm + dd;
      var IssueDetailsList = new Array();
      //校验子表
      for (var i = 0; i < request.importSubtable.length; i++) {
        //获取委托方企业编码
        var batchNumber = "" + request.importSubtable[i]["生产批号/序列号"];
        var productCode = "" + request.importSubtable[i].产品编码;
        //查询产品信息表
        var objectSon = { product_coding: productCode };
        var resSon = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation", objectSon);
        if (resSon.length != 0) {
          var sonId = resSon[0].id;
          var sonName = resSon[0].the_product_name;
          var specifications = resSon[0].specifications;
          //产品注册证/备案凭证号
          var product_registration_number = resSon[0].product_registration_number;
          //获取单位
          var companyName = resSon[0].unit;
          //获取储运条件
          var conditionsName = resSon[0].storage_and_transportation_conditions;
          //获取库位
          var warehouse_storage_area_position_number_by_default = resSon[0].warehouse_storage_area_position_number_by_default;
        } else {
          return { err: "出库单明细,产品信息不存在，请建立产品首营信息后进行导入" };
          var sonId = "";
          var sonName = "";
        }
        var nameRegistrant = "";
        //生产企业编码
        var productionName = "";
        //获取委托方编码
        var clientCodes = "" + information.委托方企业编码;
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
                //获取生产企业编码
                productionName = res[n].Enterprise;
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
          //实体查询库存
          let body = {
            warehouseCode: clientCodes,
            batch_nbr: batchNumber
          };
          var resList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.upsInventory", body);
          var zhiliangzhuangkuang = "";
          if (resList.length != 0) {
            if (resList[0].batch_nbr == batchNumber) {
              //查看日期类型
              zhiliangzhuangkuang = resList[0].inventory_status;
              //有效期
              var termValidity = resList[0].xpire_dat;
              //生产日期
              var dateManufacture = resList[0].mfg_date;
              remarks = "";
              //生产企业名称
              enterpriseName = resList[0].enterprise_name;
              //产品名称
              sonName = resList[0].producrName;
              //产品注册证/备案凭证号
              product_registration_number = resList[0].product_umber;
              //获取单位
              companyName = resList[0].unit;
              //获取储运条件
              conditionsName = resList[0].transportation_conditions;
              //获取库位
              warehouse_storage_area_position_number_by_default = resList[0].location;
              //获取注册人备案人名称
              nameRegistrant = resList[0].registrant;
            }
          } else {
            remarks = "未查询到库存信息";
            enterpriseName = "";
            dateManufacture = "";
            termValidity = "";
            remarks = "没有匹配到符合条件的入库信息";
          }
          //查询生产企业信息
          var object = { production_name: enterpriseName };
          var resProd = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Information_production", object);
          if (resProd.length != 0) {
            productionName = resProd[0].id;
          }
          //获取ui
          var UI = "";
          //获取di
          var DI = "";
          //获取udi
          var UDI = "";
        }
        IssueDetailsList.push({
          deliveryOrderNo: "" + code,
          company: companyName, //单位
          productionEnterprise: productionName, //生产企业编码
          storageCondition: conditionsName,
          productRegisterNo: product_registration_number, //产品注册证productName
          productionDate: dateManufacture,
          termOfValidity: termValidity,
          productName: sonId,
          productCode: sonName,
          batchNumber: "" + request.importSubtable[i]["生产批号/序列号"],
          quantity: request.importSubtable[i].数量,
          remarks: remarks,
          registrant: nameRegistrant, //注册人/备案人名称
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
        });
      }
    }
    return { IssueDetailsList: IssueDetailsList };
  }
}
exports({ entryPoint: MyAPIHandler });