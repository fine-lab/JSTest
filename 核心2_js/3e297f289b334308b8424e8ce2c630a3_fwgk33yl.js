let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let mdmCode = request.mdmCode;
    let operType = request.operType;
    if (operType === "corp") {
      let object = {
        mdm_corp_code: mdmCode
      };
      //实体查询
      let crmOrg = ObjectStore.selectByMap("GT63531AT7.GT63531AT7.crm_org_mdm", object);
      return { crmOrg };
    } else if (operType === "saleseq") {
      let object = {
        mdm_code: mdmCode
      };
      //实体查询
      let saleSeq = ObjectStore.selectByMap("GT63531AT7.GT63531AT7.sale_seq", object);
      return { saleSeq };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });