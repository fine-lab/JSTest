let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let importData = param.requestData;
    let id = importData.id; //供应商手工码
    let orgName = importData.org_id_name; //供应商组织名称
    if (orgName == null || orgName == undefined || orgName == "") {
      throw new Error("供应商审批表头手工码：" + id + "，组织名称为空，请填写完整后导入！");
    }
    let orgData = ObjectStore.queryByYonQL("select id from org.func.BaseOrg where name ='" + orgName + "'", "ucf-org-center");
    if (orgData.length == 0) {
      throw new Error("供应商审批表头手工码：" + id + "，" + orgName + "组织名称不存在，请确认组织名称后导入！");
    }
    let supplierCode = importData.supplier_code; //供应商编码
    if (supplierCode == null || supplierCode == undefined || supplierCode == "") {
      throw new Error("供应商审批表头手工码：" + id + "，供应商编码为空，请填写完整后导入！");
    }
    //根据组织id和供应商编码查询供应商档案是否存在
    let supplierFile = ObjectStore.queryByYonQL(
      "select vendororg.id,vendororg.code from 	aa.vendor.VendorOrg where org ='" + orgData[0].id + "' and vendororg.code ='" + supplierCode + "'",
      "yssupplier"
    );
    if (supplierFile.length == 0) {
      throw new Error("供应商审批表头手工码：" + id + "，" + orgName + "组织下没有编码为" + supplierCode + "的供应商！");
    }
    //根据供应商id和组织id查询是否首营
    let supplierData = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_supplier_file", { supplier: supplierFile[0].vendororg_id, org_id: orgData[0].id });
    if (supplierData.length > 0) {
      throw new Error("供应商审批表头手工码：" + id + "，" + orgName + "组织下编码为" + supplierCode + "的供应商已首营，请更换其他供应商导入！");
    }
    let xgzzList = importData.SY01_syqysp_xgzzv4List; //相关证照
    let poavList = importData.SY01_poavv4List; //授权委托书
    if (xgzzList == undefined || xgzzList == null || xgzzList.length == 0) {
      throw new Error("供应商审批表头手工码：" + id + "，供应商相关证照为空，请填写完整后导入！");
    } else if (poavList == undefined || poavList == null || poavList.length == 0) {
      throw new Error("供应商审批表头手工码：" + id + "，供应商授权委托书为空，请填写完整后导入！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });