let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var res = AppContext();
    var obj = JSON.parse(res);
    var tenantid = obj.currentUser.tenantId;
    let tenantparam = { tenantid: tenantid };
    let BeServiceURLFun = extrequire("GT22176AT10.publicFunction.GetBeServiceURL");
    let resapiRestPre = BeServiceURLFun.execute(tenantparam);
    let urlobj = JSON.parse(JSON.stringify(resapiRestPre));
    let apiRestPre = urlobj.apiRestPre;
    for (let i = 0; i < param.data.length; i++) {
      //根据开票组织和物料id查询GSP商品档案信息
      let bill = param.data[i];
      if (param.billnum == "voucher_order") {
        let orderDetails = bill.orderDetails;
        for (let j = 0; j < orderDetails.length; j++) {
          let inInvoiceOrg = orderDetails[j].inInvoiceOrg;
          let productId = orderDetails[j].productId;
          let productMSql = "select * from GT22176AT10.GT22176AT10.SY01_material_file where org_id = " + inInvoiceOrg + " and material = " + productId;
          let strResponse = ObjectStore.queryByYonQL(productMSql, "sy01");
          let result = JSON.parse(strResponse);
          if (strResponse.length > 0) {
            for (let k = 0; k < array.length; k++) {
              let materialinfo = strResponse[k];
              if (typeof strResponse.material != "undefined") {
                if (typeof materialinfo.standardCode != "undefined") {
                  orderDetails[j].set("extend_bwm", materialinfo.standardCode);
                }
                if (typeof materialinfo.storageCondition != "undefined") {
                  orderDetails[j].set("extend_cctj", materialinfo.storageCondition);
                }
                if (typeof materialinfo.manufacturer != "undefined") {
                  orderDetails[j].set("extend_produce_factory", materialinfo.manufacturer);
                }
                if (typeof materialinfo.approvalNumber != "undefined") {
                  orderDetails[j].set("extend_approval_number", materialinfo.approvalNumber);
                }
                if (typeof materialinfo.productLincenseNo != "undefined") {
                  orderDetails[j].set("extendProdLicense", materialinfo.productLincenseNo);
                }
                if (typeof materialinfo.materialType != "undefined") {
                  orderDetails[j].set("extend_gsp_type", materialinfo.materialType);
                }
                if (typeof materialinfo.listingHolder != "undefined") {
                  orderDetails[j].set("extend_license_holder", materialinfo.listingHolder);
                }
              }
            }
          }
        }
      }
    }
  }
}
exports({ entryPoint: MyTrigger });