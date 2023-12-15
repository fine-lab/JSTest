let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var token = "";
    let func1 = extrequire("GT56492AT34.backDefaultGroup.gettoken");
    let res2 = func1.execute(request);
    token = res2.access_token;
    var gongsimingchen = request.gongsimingchen;
    var lianxiren = request.lianxiren;
    var lianxidianhua = request.lianxidianhua;
    var psndcode = request.psndcode;
    // 根据人员编码查 部门和组织
    var url = "https://www.example.com/" + token + "&code=" + psndcode;
    let resultpsn = postman("get", url);
    var resultpsnjson = JSON.parse(resultpsn);
    var resultpsnCode1 = resultpsnjson.code;
    if (resultpsnCode1 !== "200") {
      throw new Error("错误" + resultpsnjson.message + url);
    } else {
      var zhidanren = resultpsnjson.data.id;
      if (zhidanren === undefined) {
        throw new Error("错误" + "系统中没有这个员工");
      } else {
        var mainJobList = resultpsnjson.data.mainJobList[0];
        if (mainJobList === undefined) {
          throw new Error("错误" + "这个员工没有绑定组织和部门");
        } else {
          var zhidanrenzuzhi = mainJobList.org_id;
          var zhidanrenbumen = mainJobList.dept_id;
        }
      }
    }
    var object = { yixiang: gongsimingchen, lianxiren: lianxiren, dianhua: lianxidianhua, zhidanren: zhidanren, zhidanbumen: zhidanrenbumen, startorg: zhidanrenzuzhi };
    var res = ObjectStore.insert("GT56476AT31.GT56476AT31.JJyixiangkehuxinxi", object, "JJyixiangkehuxinxi");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });