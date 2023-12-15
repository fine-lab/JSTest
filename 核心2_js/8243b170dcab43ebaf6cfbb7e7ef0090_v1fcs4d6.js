let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT83441AT1.daQing.getOpenApiTokens");
    let res = func1.execute(request);
    var token = res.access_token;
    var id = request.id;
    var orgId = request.orgId;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    let wayfunc = extrequire("GT83441AT1.backDefaultGroup.getWayUrl");
    let wayRes = wayfunc.execute(null);
    var gatewayUrl = wayRes.gatewayUrl;
    var reqkhdetailurl = gatewayUrl + "/yonbip/digitalModel/merchant/detail?access_token=" + token + "&id=" + id + "&orgId=" + orgId;
    let detail = "";
    var returnData = {};
    var khcustResponse = postman("get", reqkhdetailurl, JSON.stringify(header), null);
    var kehucustresponseobj = JSON.parse(khcustResponse);
    if ("200" == kehucustresponseobj.code) {
      detail = kehucustresponseobj.data;
      //币种
      returnData.currencyId = detail.merchantAppliedDetail.transactionCurrency;
      returnData.currencyName = detail.merchantAppliedDetail.transactionCurrency_Name;
      //汇率类型
      returnData.exchangeRateType = detail.merchantAppliedDetail.exchangeratetype;
      returnData.exchangeRateTypeName = detail.merchantAppliedDetail.exchangeratetype_Name;
      //开票客户
      returnData.invoicingCustomers = detail.invoicingCustomers;
      returnData.invoicingCustomersName = detail.invoicingCustomers_Name;
      //业务信息
      returnData.merchantAppliedDetail = detail.merchantAppliedDetail;
      //客户分类
      returnData.customerClass = detail.customerClass;
      //仓库
      returnData.arehouseId = detail.merchantAppliedDetail.deliveryWarehouse;
      returnData.arehouseName = detail.merchantAppliedDetail.deliveryWarehouse_Name;
      if (detail.merchantAddressInfos != null) {
        for (var i = 0; i < detail.merchantAddressInfos.length; i++) {
          let merchantAddressInfo = detail.merchantAddressInfos[i];
          if (merchantAddressInfo.isDefault) {
            returnData.merchantAddressInfo = merchantAddressInfo;
            break;
          }
        }
      }
      if (detail.invoicingCustomers != id) {
        //开票客户id与客户id不相同
        reqkhdetailurl = gatewayUrl + "/yonbip/digitalModel/merchant/detail?access_token=" + token + "&id=" + detail.invoicingCustomers + "&orgId=" + orgId;
        var newkhcustResponse = postman("get", reqkhdetailurl, JSON.stringify(header), null);
        var newkehucustresponseobj = JSON.parse(newkhcustResponse);
        if ("200" == newkehucustresponseobj.code) {
          //企业类型
          returnData.enterpriseNature = newkehucustresponseobj.data.enterpriseNature;
          if (newkehucustresponseobj.data.merchantAgentInvoiceInfos != null) {
            for (var j = 0; j < newkehucustresponseobj.data.merchantAgentInvoiceInfos.length; j++) {
              let merchantAgentInvoiceInfo = newkehucustresponseobj.data.merchantAgentInvoiceInfos[j];
              if (merchantAgentInvoiceInfo.isDefault) {
                returnData.merchantAgentInvoiceInfo = merchantAgentInvoiceInfo;
                break;
              }
            }
          }
        }
      } else {
        //企业类型
        returnData.enterpriseNature = detail.enterpriseNature;
        if (detail.merchantAgentInvoiceInfos != null) {
          returnData.merchantAgentInvoiceInfo = detail.merchantAgentInvoiceInfos[0];
        }
      }
    } else {
      throw new Error("查询详情接口失败！" + kehucustresponseobj.message);
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });