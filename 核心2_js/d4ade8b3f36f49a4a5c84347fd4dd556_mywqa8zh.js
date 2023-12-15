let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param;
    let id = data.id;
    let createOrg = data.createOrg;
    let code = data.code;
    let customerClass = data.customerClass;
    let enterpriseNature; // 企业类型
    let merchantOptions; // 是否商家
    // 使用sql查询客户档案信息
    let cilentSql = "select * from aa.merchant.MerchantApplyRange where merchantId ='" + id + "'";
    var res2 = ObjectStore.queryByYonQL(cilentSql, "productcenter");
    if (res2 != undefined) {
      enterpriseNature = res2.enterpriseNature; // 企业类型
      merchantOptions = res2.merchantRolemerchantOptions; // 是否商家
    }
    let body = {
      id: id, // 客户id
      merchantDefine: {
        define1: context.clientCode // 自定义字段值，SAP客商编码
      },
      createOrg: createOrg, // 管理组织
      code: code, // 客户编码
      taxPayingCategories: 0, // 纳税类别, 0:一般纳税人、1:小规模纳税人、2:海外纳税、    示例：0
      customerClass: customerClass, // 客户分类id
      merchantOptions: merchantOptions, // 是否商家， true:是、false:否    示例：false
      enterpriseNature: enterpriseNature, // 企业类型, 0:企业、1:个人、2:非营利组织、
      _status: "Update",
      belongOrg: createOrg, // 编辑保存必填
      merchantAddressInfos: [], // 地址信息
      merchantContacterInfos: [], // 联系人信息
      merchantAgentFinancialInfos: [], // 	银行信息
      merchantAgentInvoiceInfos: [], // 发票信息
      merchantCorpImages: [], // 证照证书图片
      merchantAttachments: [], // 附件
      merchantApplyRanges: [] // 	客户适用组织
    };
    let dataRequest = {
      data: body
    };
    return { body: dataRequest };
  }
}
exports({ entryPoint: MyTrigger });