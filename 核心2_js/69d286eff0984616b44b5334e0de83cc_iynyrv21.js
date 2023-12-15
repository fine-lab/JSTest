let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(xsckId, xtzhCode) {
    let getxsckDetail = "https://www.example.com/" + xsckId;
    let getXtzhUrl = "https://www.example.com/";
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    //销售出库修改形态转换单号
    let rst = "";
    let xsckDetailResponse = openLinker("GET", getxsckDetail, "ST", null);
    let xsckResponseobj = JSON.parse(xsckDetailResponse);
    if ("200" == xsckResponseobj.code) {
      let data = xsckResponseobj.data;
      let func_1 = extrequire("ST.backDefaultGroup.makeXSCKdata");
      let body = func_1.execute(data, xtzhCode);
      let xtzhResponse = openLinker("POST", getXtzhUrl, "ST", JSON.stringify(body.body));
      let xtzhresponseobj = JSON.parse(xtzhResponse);
      if ("200" == xtzhresponseobj.code) {
        rst = { code: 1, message: data.code + "转换成功" };
      } else {
        rst = { code: 0, message: xtzhresponseobj.message };
      }
    } else {
      rst = { code: 0, message: xsckResponseobj.message };
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });