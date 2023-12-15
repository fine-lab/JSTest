let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var barCode = param["variablesMap"]["barCode"];
    var businessKey = replace(barCode, "|", "_");
    var finDeptId = param["variablesMap"]["vfinacedeptid"]; //费用承担部门
    var psnDetpId = param["variablesMap"]["vhandledeptid"]; //报销人部门
    var returnMessage = "N";
    if (finDeptId == psnDetpId) returnMessage = "Y";
    return returnMessage;
  }
}
exports({ entryPoint: MyTrigger });