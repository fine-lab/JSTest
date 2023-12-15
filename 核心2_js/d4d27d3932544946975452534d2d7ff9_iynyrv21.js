let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //形态转换保存
    let func = extrequire("ST.backDefaultGroup.getToken");
    let resToken = func.execute();
    let token = resToken.access_token;
    //获取形态转换组装好的body
    let xtzhBody = request.body;
    let xsck = request.xsck;
    let getXtzhUrl = "https://www.example.com/" + token;
    let contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": contenttype
    };
    let failCount = "";
    let rst = "";
    let xtzhResponse = postman("POST", getXtzhUrl, JSON.stringify(header), JSON.stringify(xtzhBody));
    let xtzhresponseobj = JSON.parse(xtzhResponse);
    if ("200" == xtzhresponseobj.code) {
      let data = xtzhresponseobj.data;
      let infos = data.infos;
      failCount = data.failCount;
      if (failCount > 0) {
        rst = { code: 0, message: xsck.code + data.messages };
      } else {
        rst = { code: 1, message: xsck.code + "转换成功", data: infos };
      }
    } else {
      rst = { code: 0, message: xsck.code + xtzhresponseobj.message };
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });