let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var billObj = {
      id: param.data[0].id
    };
    //实体查询
    var billInfo = ObjectStore.selectById("GT22176AT10.GT22176AT10.SY01_supplierStatus", billObj);
    //获取供应商档案详情
    let apiResponseSupplier = extrequire("GT22176AT10.publicFunction.queryVendorInfo").execute({ vendorId: billInfo.supplier, vendorApplyRangeId: "" });
    let response_obj = apiResponseSupplier.vendorInfo;
    let data = {
      data: {
        org: response_obj.org,
        name: response_obj.name,
        vendorclass: response_obj.vendorclass.toString(),
        country: response_obj.country,
        internalunit: response_obj.internalunit,
        contactmobile: response_obj.contactmobile,
        isCreator: response_obj.isCreator,
        isApplied: response_obj.isApplied,
        _status: "Update",
        code: response_obj.code,
        id: response_obj.id.toString(),
        masterOrgKeyField: response_obj.masterOrgKeyField,
        vendorclass_name: response_obj.vendorclass_name,
        vendorclass_code: response_obj.vendorclass_code,
        retailInvestors: response_obj.retailInvestors,
        yhttenant: response_obj.yhttenant,
        vendorApplyRangeId: response_obj.vendorApplyRangeId.toString(),
        datasource: response_obj.datasource,
        vendorApplyRange_org_name: response_obj.vendorApplyRange_org_name,
        vendorOrgs: response_obj.vendorOrgs,
        extend_purchase_status: billInfo.xincaigouzhuangtai
      }
    };
    extrequire("GT22176AT10.publicFunction.saveSupper").execute(data);
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});