let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 酒标编码
    var code = request.code;
    if (code == undefined || code == "") {
      throw new Error("酒标编码为空!");
    }
    // 客户编码
    var agentCode = request.agentCode;
    if (agentCode == undefined || agentCode == "") {
      throw new Error("客户编码为空!");
    }
    // 操作数量
    var operCount = request.operCount;
    if (operCount == undefined || operCount == "") {
      throw new Error("操作数量为空!");
    }
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    // 根据客户编码查询所属平台
    var platformCode = getPlatformCode(request.agentCode);
    // 主表查询
    let wineLabelSql = `select * from GT80750AT4.GT80750AT4.wine_labels where status = '0' and code = '${request.code}' `;
    let wineLabels = ObjectStore.queryByYonQL(wineLabelSql);
    if (wineLabels == undefined || wineLabels.length == 0) {
      throw new Error(`根据酒标编码[${code}]客户编码[${agentCode}]所属平台[${platformCode}]未查询到酒标`);
    }
    // 子表查询
    let wineLabelBSql = `select * from GT80750AT4.GT80750AT4.wine_labels_b where wine_labels_id = 'youridHere' and platform_code = '${platformCode}' `;
    let wineLabelBs = ObjectStore.queryByYonQL(wineLabelBSql);
    if (wineLabelBs == undefined || wineLabelBs.length == 0) {
      throw new Error(`根据酒标编码[${code}]客户编码[${agentCode}]所属平台[${platformCode}]未查询到酒标子表`);
    }
    // 修改数量
    let usedCount = wineLabelBs[0].used_count;
    if (usedCount == undefined) {
      usedCount = 0;
    }
    usedCount = new Big(usedCount).plus(new Big(operCount));
    if (usedCount < 0) {
      usedCount = 0;
    }
    var updateWineLabel = { id: wineLabelBs[0].id, used_count: usedCount, _status: "Update" };
    var res = ObjectStore.updateById("GT80750AT4.GT80750AT4.wine_labels_b", updateWineLabel);
    return { code: 200, message: "success", data: res };
    function getPlatformCode(agentCode) {
      let req = { code: agentCode };
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/GetCtrlCustCode", "", JSON.stringify(req));
      try {
        result = JSON.parse(result);
        if (result.code + "" != "200") {
          throw new Error(result.msg);
        } else if (result.data == undefined || result.data.fxscode == undefined || result.data.fxscode == "") {
          throw new Error(`根据客户编码${agentCode}未查询到所属平台`);
        }
      } catch (e) {
        throw new Error(`获取所属平台${e};参数:${JSON.stringify(req)}`);
      }
      return result.data.fxscode;
    }
  }
}
exports({ entryPoint: MyAPIHandler });