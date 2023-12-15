let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let customerInfo = {};
    var billObj = {
      id: param.data[0].id
    };
    //实体查询
    var billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_cusStatus", billObj);
    let apiResponse = extrequire("GT22176AT10.publicFunction.queryMerchantInfor").execute({ code: billInfo.sy01_customer_code, orgId: billInfo.org_id });
    customerInfo = apiResponse.merchantInfo;
    let merchantAddressInfos = [];
    if (typeof customerInfo.merchantAddressInfos != "undefined") {
      for (let i = 0; i < customerInfo.merchantAddressInfos.length; i++) {
        merchantAddressInfos.push({
          id: customerInfo.merchantAddressInfos[i].id,
          addressCode: customerInfo.merchantAddressInfos[i].addressCode,
          isDefault: customerInfo.merchantAddressInfos[i].isDefault,
          _status: "Update"
        });
      }
    }
    let merchantContacterInfos = [];
    if (typeof customerInfo.merchantContacterInfos != "undefined") {
      for (let i = 0; i < customerInfo.merchantContacterInfos.length; i++) {
        merchantContacterInfos.push({
          id: customerInfo.merchantContacterInfos[i].id,
          fullName: customerInfo.merchantContacterInfos[i].fullName,
          isDefault: customerInfo.merchantContacterInfos[i].isDefault,
          _status: "Update"
        });
      }
    }
    let merchantAgentFinancialInfos = [];
    if (typeof customerInfo.merchantAgentFinancialInfos != "undefined") {
      for (let i = 0; i < customerInfo.merchantAgentFinancialInfos.length; i++) {
        merchantAgentFinancialInfos.push({
          id: customerInfo.merchantAgentFinancialInfos[i].id,
          country: customerInfo.merchantAgentFinancialInfos[i].country,
          currency: customerInfo.merchantAgentFinancialInfos[i].currency,
          accountType: customerInfo.merchantAgentFinancialInfos[i].accountType,
          bank: customerInfo.merchantAgentFinancialInfos[i].bank,
          openBank: customerInfo.merchantAgentFinancialInfos[i].openBank,
          bankAccountName: customerInfo.merchantAgentFinancialInfos[i].bankAccountName,
          isDefault: customerInfo.merchantAgentFinancialInfos[i].isDefault,
          _status: "Update"
        });
      }
    }
    let merchantAgentInvoiceInfos = [];
    if (typeof customerInfo.merchantAgentInvoiceInfos != "undefined") {
      for (let i = 0; i < customerInfo.merchantAgentInvoiceInfos.length; i++) {
        merchantAgentInvoiceInfos.push({
          id: customerInfo.merchantAgentInvoiceInfos[i].id,
          billingType: customerInfo.merchantAgentInvoiceInfos[i].billingType,
          title: customerInfo.merchantAgentInvoiceInfos[i].title,
          isDefault: customerInfo.merchantAgentInvoiceInfos[i].isDefault,
          _status: "Update"
        });
      }
    }
    let merchantCorpImages = [];
    if (typeof customerInfo.merchantCorpImages != "undefined") {
      for (let i = 0; i < customerInfo.merchantCorpImages.length; i++) {
        merchantCorpImages.push({
          id: customerInfo.merchantCorpImages[i].id,
          _status: "Update"
        });
      }
    }
    let merchantAttachments = [];
    if (typeof customerInfo.merchantAttachments != "undefined") {
      for (let i = 0; i < customerInfo.merchantAttachments.length; i++) {
        merchantAttachments.push({
          id: customerInfo.merchantAttachments[i].id,
          _status: "Update"
        });
      }
    }
    let newState = billInfo.SY01_saleState.toString();
    customerInfo.merchantAppliedDetail._status = "Update";
    let updateJson = {
      data: {
        id: customerInfo.id,
        createOrg: customerInfo.createOrg,
        code: customerInfo.code,
        merchantAppliedDetail: customerInfo.merchantAppliedDetail,
        taxPayingCategories: customerInfo.taxPayingCategories,
        customerClass: customerInfo.customerClass,
        merchantOptions: customerInfo.merchantOptions,
        enterpriseNature: customerInfo.enterpriseNature,
        merchantAddressInfos: merchantAddressInfos,
        merchantContacterInfos: merchantContacterInfos,
        merchantAgentFinancialInfos: merchantAgentFinancialInfos,
        merchantAgentInvoiceInfos: merchantAgentInvoiceInfos,
        merchantCorpImages: merchantCorpImages,
        merchantAttachments: merchantAttachments,
        _status: "Update",
        extend_xszt: newState
      }
    };
    apiResponse = extrequire("GT22176AT10.publicFunction.saveMerchant").execute(updateJson);
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});