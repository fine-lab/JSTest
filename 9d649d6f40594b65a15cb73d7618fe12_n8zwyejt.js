let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let importData = param.requestData;
    let id = importData.id; //客户手工码
    let orgName = importData.org_id_name; //客户组织名称
    if (orgName == null || orgName == undefined || orgName == "") {
      throw new Error("首营客户审批单表头手工码：" + id + "，组织名称为空，请填写完整后导入！");
    }
    let orgData = ObjectStore.queryByYonQL("select id from org.func.BaseOrg where name ='" + orgName + "'", "ucf-org-center");
    if (orgData.length == 0) {
      throw new Error("首营客户审批单表头手工码：" + id + "，" + orgName + "组织名称不存在，请确认组织名称后导入！");
    }
    let customerCode = importData.customer_code; //客户编码
    if (customerCode == null || customerCode == undefined || customerCode == "") {
      throw new Error("首营客户审批单表头手工码：" + id + "，客户编码为空，请填写完整后导入！");
    }
    //根据组织id和客户编码查询客户档案是否存在
    let customerFile = ObjectStore.queryByYonQL(
      "select merchantId.id,merchantId.code from 		aa.merchant.MerchantApplyRange where orgId ='" + orgData[0].id + "' and merchantId.code ='" + customerCode + "'",
      "productcenter"
    );
    if (customerFile.length == 0) {
      throw new Error("首营客户审批单表头手工码：" + id + "，" + orgName + "组织下没有编码为" + customerCode + "的客户！");
    }
    //根据客户id和组织id查询是否首营
    let customerData = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.sy01_customers_file", { customer: customerFile[0].merchantId_id, org_id: orgData[0].id });
    if (customerData.length > 0) {
      throw new Error("首营客户审批单表头手工码：" + id + "，" + orgName + "组织下编码为" + customerCode + "的客户已首营，请更换其他客户导入！");
    }
    let xgzzList = importData.SY01_sykhsp_xgzzList; //相关证照
    let poavList = importData.SY01_sykhsp_poavList; //授权委托书
    if (xgzzList == undefined || xgzzList == null || xgzzList.length == 0) {
      throw new Error("首营客户审批单表头手工码：" + id + "，客户相关证照为空，请填写完整后导入！");
    } else if (poavList == undefined || poavList == null || poavList.length == 0) {
      throw new Error("首营客户审批单表头手工码：" + id + "，客户授权委托书为空，请填写完整后导入！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });