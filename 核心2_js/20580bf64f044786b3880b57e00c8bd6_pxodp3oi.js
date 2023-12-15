let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let schemeBillId = request.schemeBillId;
    let orgName = request.orgName;
    let sjURI = "ShangJiXinXi_JJ";
    let faURI = "AIMIXXPFASQ";
    if (includes(orgName, "建机")) {
      sjURI = "ShangJiXinXi_JJ";
      faURI = "AIMIXXPFASQ";
    } else if (includes(orgName, "环保")) {
      sjURI = "ShangJiXinXi_HB";
      faURI = "BTXPFASQ";
    } else if (includes(orgName, "游乐")) {
      sjURI = "ShangJiXinXi_YL";
      faURI = "YLXPFASQ";
    }
    let sqlStr = "select *,xunPanRenY.name from 	GT3734AT5.GT3734AT5." + sjURI + " inner join  GT3734AT5.GT3734AT5." + faURI + " B on  B.busiChance=id where B.id='" + schemeBillId + "'"; //
    let queryRes = ObjectStore.queryByYonQL(sqlStr, "developplatform");
    let rst = queryRes.length > 0;
    return { rst: rst, data: queryRes[0] };
  }
}
exports({ entryPoint: MyAPIHandler });