let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let resources = data.sourcesys;
    if (data.hasOwnProperty("sourcesys") && "retail" == resources) {
      let store = data.store;
      if (data.hasOwnProperty("store") && undefined != store && "undefined" != store && "" != store) {
        let ischaidan = queryChaidanValue(store);
        let detail = data.details;
        if ("true" == ischaidan && data.hasOwnProperty("details") && detail.length > 0) {
          if (detail[0].hasOwnProperty("salesOutsDefineCharacter")) {
            let salesOutsDefineCharacter = detail[0].salesOutsDefineCharacter;
            if (salesOutsDefineCharacter.hasOwnProperty("bodyDefine2")) {
              let bodyDefine2 = salesOutsDefineCharacter.bodyDefine2;
              if (undefined != bodyDefine2 && "undefined" != bodyDefine2 && "" != bodyDefine2) {
                param.data[0].set("invoiceOrg", bodyDefine2 + "");
                param.data[0].set("org", bodyDefine2 + "");
                param.data[0].set("accountOrg", bodyDefine2 + "");
                param.data[0].set("receiveAccountingBasis", "st_salesout");
                param.data[0].set("salesoutAccountingMethod", "invoiceConfirm");
              }
            }
          }
          let conswarehouse = getconswarehouse(param.data[0]);
          if ("" != conswarehouse) {
            param.data[0].set("warehouse", conswarehouse);
          }
        }
      }
    }
    //门店拆单属性
    function queryChaidanValue(store) {
      let sql = "select * from 		aa.store.StoreDefineCharacter	where  id='" + store + "'";
      var res = ObjectStore.queryByYonQL(sql, "yxybase");
      var attrext14 = "";
      if (undefined != res && res.length > 0) {
        if (res[0].hasOwnProperty("attrext14")) attrext14 = res[0].attrext14;
      }
      return attrext14;
    }
    //代售仓
    function getconswarehouse(param) {
      let conswarehouse = "";
      if (param.hasOwnProperty("salesOrg")) {
        let saleorg = param.salesOrg;
        let sql = "select * from 	aa.warehouse.Warehouse where iUsed ='enable' and ownerorg='" + saleorg + "'";
        let warehouseres = ObjectStore.queryByYonQL(sql, "productcenter");
        if (undefined != warehouseres && warehouseres.length > 0) {
          if (warehouseres[0].hasOwnProperty("id")) {
            let id = warehouseres[0].id;
            let freesql = " select * from aa.warehouse.WarehouseDefineCharacter where  id='" + id + "'";
            let rreeDefineres = ObjectStore.queryByYonQL(freesql, "productcenter");
            if (undefined != rreeDefineres && rreeDefineres.length > 0) {
              if (rreeDefineres[0].hasOwnProperty("attrext22")) {
                let attrext22 = rreeDefineres[0].attrext22;
                if ("true" == attrext22 || attrext22) {
                  conswarehouse = id;
                }
              }
            }
          }
        }
      }
      return conswarehouse;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });