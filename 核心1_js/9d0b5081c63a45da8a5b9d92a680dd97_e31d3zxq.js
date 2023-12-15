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
      if (typeof param.data[i].transactionTypeId_name != "undefined" && param.data[i].transactionTypeId_name.indexOf("非GSP") == -1 && param.data[i].transactionTypeId_name.indexOf("GSP") > -1) {
        param.data[i].set("extend_gspType", "true");
        //根据开票组织和物料id查询GSP商品档案信息
        let bill = param.data[i];
        if (param.billnum == "voucher_order") {
          let agentid = bill.agentId;
          let orderDetails = bill.orderDetails;
          for (let i = 0; i < orderDetails.length; i++) {
            let settlementOrgId = orderDetails[i].settlementOrgId;
            let productId = orderDetails[i].productId;
            let obj = { tenantid: tenantid, userid: ObjectStore.user().id, agentid: agentid, orgid: settlementOrgId, productid: productId };
            let strResponse = postman("post", apiRestPre + "/gsp/GetSaleGspProduct", null, JSON.stringify(obj));
            let result = JSON.parse(strResponse);
            if (result.code == "200") {
              let salesmanid = result.data.salesman;
              let materialinfo = result.data.material;
              if (typeof result.data.salesman != "undefined") {
                if (typeof salesmanid != "undefined" && salesmanid != "") {
                  bill.set("extendCustomSalesman", salesmanid);
                }
                if (typeof salesmanid != "undefined" && salesmanid != "") {
                  orderDetails[i].set("extendCustomSalesman", salesmanid);
                }
              }
              if (typeof result.data.material != "undefined") {
                if (typeof materialinfo.standardCode != "undefined") {
                  orderDetails[i].set("extend_standard_code", materialinfo.standardCode);
                }
                if (typeof materialinfo.storageCondition != "undefined") {
                  orderDetails[i].set("extendStorageCondition", materialinfo.storageCondition);
                }
                if (typeof materialinfo.manufacturer != "undefined") {
                  orderDetails[i].set("extendMfrs", materialinfo.manufacturer);
                }
                if (typeof materialinfo.approvalNumber != "undefined") {
                  orderDetails[i].set("extendLicenseNumber", materialinfo.approvalNumber);
                }
                if (typeof materialinfo.productLincenseNo != "undefined") {
                  orderDetails[i].set("extendProdLicense", materialinfo.productLincenseNo);
                }
                if (typeof materialinfo.materialType != "undefined") {
                  orderDetails[i].set("extendGspPrdType", materialinfo.materialType);
                }
                if (typeof materialinfo.listingHolder != "undefined") {
                  orderDetails[i].set("extendMAH", materialinfo.listingHolder);
                }
              }
            }
          }
        }
      } else if (typeof param.data[i].bizFlow_name != "undefined" && param.data[i].bizFlow_name != null) {
        if (param.data[i].bizFlow_name.indexOf("销售出库复核") > -1) {
          param.data[i].set("extend_gspType", "true");
          //根据开票组织和物料id查询GSP商品档案信息
          let bill = param.data[i];
          if (param.billnum == "voucher_order") {
            let agentid = bill.agentId;
            let orderDetails = bill.orderDetails;
            for (let i = 0; i < orderDetails.length; i++) {
              let settlementOrgId = orderDetails[i].settlementOrgId;
              let productId = orderDetails[i].productId;
              let obj = { tenantid: tenantid, userid: ObjectStore.user().id, agentid: agentid, orgid: settlementOrgId, productid: productId };
              let strResponse = postman("post", apiRestPre + "/gsp/GetSaleGspProduct", null, JSON.stringify(obj));
              let result = JSON.parse(strResponse);
              if (result.code == "200") {
                let salesmanid = result.data.salesman;
                let materialinfo = result.data.material;
                if (typeof result.data.salesman != "undefined") {
                  if (typeof salesmanid != "undefined" && salesmanid != "") {
                    bill.set("extendCustomSalesman", salesmanid);
                  }
                  if (typeof salesmanid != "undefined" && salesmanid != "") {
                    orderDetails[i].set("extendCustomSalesman", salesmanid);
                  }
                }
                if (typeof result.data.material != "undefined") {
                  if (typeof materialinfo.standardCode != "undefined") {
                    orderDetails[i].set("extend_standard_code", materialinfo.standardCode);
                  }
                  if (typeof materialinfo.storageCondition != "undefined") {
                    orderDetails[i].set("extendStorageCondition", materialinfo.storageCondition);
                  }
                  if (typeof materialinfo.manufacturer != "undefined") {
                    orderDetails[i].set("extendMfrs", materialinfo.manufacturer);
                  }
                  if (typeof materialinfo.approvalNumber != "undefined") {
                    orderDetails[i].set("extendLicenseNumber", materialinfo.approvalNumber);
                  }
                  if (typeof materialinfo.productLincenseNo != "undefined") {
                    orderDetails[i].set("extendProdLicense", materialinfo.productLincenseNo);
                  }
                  if (typeof materialinfo.materialType != "undefined") {
                    orderDetails[i].set("extendGspPrdType", materialinfo.materialType);
                  }
                  if (typeof materialinfo.listingHolder != "undefined") {
                    orderDetails[i].set("extendMAH", materialinfo.listingHolder);
                  }
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