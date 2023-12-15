let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //卡片页面销售出库推形态转换
    //获取销售出库
    let xtzh = {
      rows: request.rows,
      xsck: request.xsck
    };
    let func_1 = extrequire("ST.backDefaultGroup.makeXTZHbody");
    let xtzhBody = func_1.execute(xtzh);
    let rst = "";
    if (xtzhBody.xtzhBody !== undefined) {
      let func_2 = extrequire("ST.backDefaultGroup.addXTZH");
      let addBody = {
        body: xtzhBody.xtzhBody,
        xsck: request.xsck
      };
      let savextzh = func_2.execute(addBody);
      rst = savextzh.rst;
    } else {
      rst = { code: 1, message: request.xsck.code + "该单据无需形态转换" };
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });