let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var state = request.state;
    var ArrayList = new Array();
    var SunData = {};
    if (state == 1) {
      // 查询入库验收单子表
      let queryWarehouseSunSql =
        "select id,term_validity,product_name,registration_number,batch_number,batch_number,date_manufacture,product_code,AdvanceArrivalNoticeNo from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where WarehousingAcceptanceSheet_id = '" +
        id +
        "'";
      let queryWarehouseSunList = ObjectStore.queryByYonQL(queryWarehouseSunSql);
      if (queryWarehouseSunList.length > 0) {
        for (let i = 0; i < queryWarehouseSunList.length; i++) {
          // 子表id
          let sunID = queryWarehouseSunList[i].id;
          // 产品名称
          let product_name = queryWarehouseSunList[i].product_name;
          // 备案凭证号
          let registration_number = queryWarehouseSunList[i].registration_number;
          // 产品编码
          let product_code = queryWarehouseSunList[i].product_code;
          // 查询产品信息档案
          let productSql =
            "select product_coding,the_product_name,unit,specifications,warehouse_storage_area_position_number_by_default,Entrusting_enterprise_name,registration_certificate_approval_date,enable,product_registration_number,whether_medical_equipment,registration,production_enterprise_code,registration_certificate_effective_date from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where id = '" +
            product_code +
            "' order by pubts desc";
          let productList = ObjectStore.queryByYonQL(productSql);
          // 查询产品注册证
          let registrationSql =
            "select type_of_enterprise,product_certificate_date,nameRegistrant,storage_conditions,nameRegistrant,production_enterprise_code,production_enterprise_name,product_umber,product_certificate_date from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where product_umber = '" +
            registration_number +
            "' order by product_certificate_date desc";
          let registrationList = ObjectStore.queryByYonQL(registrationSql);
          throw new Error(JSON.stringify(registrationList));
          // 货位号
          var warehouse_storage = "";
          let hwNO = includes(productList, "warehouse_storage_area_position_number_by_default");
          if (hwNO == false) {
            warehouse_storage = productList[0].warehouse_storage_area_position_number_by_default;
          }
          // 单位
          var unit = "";
          let unCN = includes(productList, "unit");
          if (unCN == false) {
            unit = productList[0].unit;
          }
          // 备案人
          var nameRegistrant = "";
          let barCN = includes(registrationList, "nameRegistrant");
          if (barCN == false) {
            nameRegistrant = registrationList[0].nameRegistrant;
          }
          // 备案号
          var product_umber = "";
          let baNO = includes(registrationList, "product_umber");
          if (baNO == false) {
            product_umber = registrationList[0].product_umber;
          }
          // 储运条件
          var storage_conditions = "";
          let cyWhere = includes(registrationList, "storage_conditions");
          if (cyWhere == false) {
            storage_conditions = registrationList[0].storage_conditions;
          }
          // 生产企业id
          var productionCode = "";
          let proCode = includes(registrationList, "production_enterprise_code");
          if (proCode == false) {
            productionCode = registrationList[0].production_enterprise_code;
          }
          // 生产企业名称
          var production_enterprise_name = "";
          let proCN = includes(registrationList, "production_enterprise_name");
          if (proCN == false) {
            production_enterprise_name = registrationList[0].production_enterprise_name;
          }
          SunData = {
            id: sunID,
            registrant: nameRegistrant,
            registration_number: product_umber,
            Company: unit,
            conditions: storage_conditions,
            Location_No: warehouse_storage,
            Enterprise: productionCode,
            new26: production_enterprise_name,
            _status: "Update"
          };
          ArrayList.push(SunData);
        }
        // 更新子表实体
        let UpdateProduct = { id: id, product_lisList: ArrayList };
        let UpdateProductRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", UpdateProduct, "e84ee900");
      }
    } else if (state == 2) {
      var tid = request.tid;
      // 查询入库验收单子表
      let queryWarehouseSunSql =
        "select id,term_validity,batch_number,batch_number,date_manufacture,product_code,AdvanceArrivalNoticeNo from AT161E5DFA09D00001.AT161E5DFA09D00001.product_lis where id = '" + tid + "'";
      let queryWarehouseSunList = ObjectStore.queryByYonQL(queryWarehouseSunSql);
      // 产品编码
      let product_code = queryWarehouseSunList[0].product_code;
      // 查询产品信息档案
      let productSql =
        "select product_coding,the_product_name,unit,specifications,warehouse_storage_area_position_number_by_default,Entrusting_enterprise_name,registration_certificate_approval_date,enable,product_registration_number,whether_medical_equipment,registration,production_enterprise_code,registration_certificate_effective_date from AT161E5DFA09D00001.AT161E5DFA09D00001.productInformation where id = '" +
        product_code +
        "' order by pubts desc";
      let productList = ObjectStore.queryByYonQL(productSql);
      // 查询产品注册证
      let registrationSql =
        "select type_of_enterprise,nameRegistrant,storage_conditions,nameRegistrant,production_enterprise_code,production_enterprise_name,product_umber,product_certificate_date from AT161E5DFA09D00001.AT161E5DFA09D00001.product_registration_certifica where productInformation_id = '" +
        product_code +
        "' order by product_certificate_date desc";
      let registrationList = ObjectStore.queryByYonQL(registrationSql);
      // 货位号
      var warehouse_storage = "";
      let hwNO = includes(productList, "warehouse_storage_area_position_number_by_default");
      if (hwNO == false) {
        warehouse_storage = productList[0].warehouse_storage_area_position_number_by_default;
      }
      // 单位
      var unit = "";
      let unCN = includes(productList, "unit");
      if (unCN == false) {
        unit = productList[0].unit;
      }
      // 备案人
      var nameRegistrant = "";
      let barCN = includes(registrationList, "nameRegistrant");
      if (barCN == false) {
        nameRegistrant = registrationList[0].nameRegistrant;
      }
      // 备案号
      var product_umber = "";
      let baNO = includes(registrationList, "product_umber");
      if (baNO == false) {
        product_umber = registrationList[0].product_umber;
      }
      // 储运条件
      var storage_conditions = "";
      let cyWhere = includes(registrationList, "storage_conditions");
      if (cyWhere == false) {
        storage_conditions = registrationList[0].storage_conditions;
      }
      // 生产企业id
      var productionCode = "";
      let proCode = includes(registrationList, "production_enterprise_code");
      if (proCode == false) {
        productionCode = registrationList[0].production_enterprise_code;
      }
      // 生产企业名称
      var production_enterprise_name = "";
      let proCN = includes(registrationList, "production_enterprise_name");
      if (proCN == false) {
        production_enterprise_name = registrationList[0].production_enterprise_name;
      }
      SunData = {
        id: tid,
        registrant: nameRegistrant,
        registration_number: product_umber,
        Company: unit,
        conditions: storage_conditions,
        Location_No: warehouse_storage,
        Enterprise: productionCode,
        new26: production_enterprise_name,
        _status: "Update"
      };
      ArrayList.push(SunData);
      // 更新子表实体
      let UpdateProduct = { id: id, product_lisList: ArrayList };
      let UpdateProductRes = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", UpdateProduct, "e84ee900");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });