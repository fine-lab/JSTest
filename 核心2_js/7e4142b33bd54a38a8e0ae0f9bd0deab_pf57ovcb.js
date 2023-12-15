let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //公共变量
    let funFmtDt = extrequire("AT17C47D1409580006.rule.dateFormatP");
    let fmtDtNow = funFmtDt.execute(new Date(), "年月日");
    let sql = "";
    sql = "select PayOrderID from AT17C47D1409580006.AT17C47D1409580006.SAPSyncResults where isSync='0'";
    //参数ids有值则按id进行过滤，否则查全部
    if (request.ids != undefined && request.ids.length > 0) {
      sql += " and id in (" + request.ids.join(",") + ")";
    }
    let respid = ObjectStore.queryByYonQL(sql);
    if (respid.length > 0) {
      //拼接数组
      let arrRespid = respid.map((x) => {
        return x.PayOrderID;
      });
      sql =
        "select distinct " +
        "mainid.id as main_id," +
        "mainid.code as PZID," +
        "mainid.creator as creator," +
        "mainid.accentity.code as BUKRS," +
        "mainid.accentity.name as accentity_name," +
        "mainid.supplier as supplierId," +
        "mainid.supplier.code as suppliercode," +
        "mainid.supplier.name as supplier_name," +
        "mainid.oriSum as STAMT," +
        "mainid.supplierbankaccount.accountname as PAYEE," +
        "mainid.supplierbankaccount.account as PAYEB," +
        "bodyItem.define1 as cbzxId," +
        "bodyItem.define1.code as KOSTL," +
        "srcbillno as SXPZID " +
        "from arap.paybill.PayBillb where mainid.id in (" +
        arrRespid.join(",") +
        ") ";
      let resPayBill = ObjectStore.queryByYonQL(sql, "fiarap");
      //查询accentity_name对应的简称，处理字段TOPIC和REMARK
      for (let i = 0; i < resPayBill.length; i++) {
        //根据供应商id查询供应商sap编码；
        sql = "select id,customItems.define2 as SapCode from aa.vendor.Vendor where id = '" + resPayBill[i].supplierId + "'";
        let resSupplier = ObjectStore.queryByYonQL(sql, "yssupplier");
        if (resSupplier.length > 0) {
          resPayBill[i].LIFNR = resSupplier[0].SapCode; //SAP编码
        }
        //根据供应商id查询供应商银行账户的银行网点名称
        sql = "select openaccountbank,openaccountbank.name as PAYEO from aa.vendor.VendorBank where vendor = '" + resPayBill[i].supplierId + "'";
        let resVendorBank = ObjectStore.queryByYonQL(sql, "yssupplier");
        if (resVendorBank.length > 0) {
          resPayBill[i].PAYEO = resVendorBank[0].PAYEO;
        }
        sql = "select shortname from bd.adminOrg.AdminOrgVO where code='" + resPayBill[i].BUKRS + "'";
        let resAdminOrg = ObjectStore.queryByYonQL(sql, "orgcenter");
        if (resAdminOrg.length > 0) {
          resPayBill[i].TOPIC = "请" + resAdminOrg[0].shortname + resPayBill[i].supplier_name + "采购款项" + resPayBill[i].PZID;
          resPayBill[i].REMARK = "请" + resAdminOrg[0].shortname + resPayBill[i].supplier_name + "采购款项" + resPayBill[i].PZID;
        } else {
          resPayBill[i].TOPIC = "请" + resAdminOrg[0].shortname + resPayBill[i].supplier_name + "采购款项" + resPayBill[i].PZID;
          resPayBill[i].REMARK = "请" + resAdminOrg[0].shortname + resPayBill[i].supplier_name + "采购款项" + resPayBill[i].PZID;
        }
      }
      return { code: "200", message: "", data: resPayBill };
    }
  }
}
exports({ entryPoint: MyAPIHandler });