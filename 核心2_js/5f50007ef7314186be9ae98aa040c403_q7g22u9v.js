let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var typeValue = param.data[0].businessType;
    var qsOrg = param.data[0].qualificationSourcingOrganization; //资质寻源组织
    if (typeof typeValue == "undefined" || typeValue === null) {
      throw new Error("请选择业务类型!");
    } else {
      if (typeof qsOrg == "undefined" || qsOrg === null) {
        throw new Error("当业务类型选择时,资质寻源组织不能为空");
      }
      return {};
    }
  }
}
exports({ entryPoint: MyTrigger });