let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var jsondata = JSON.parse(JSON.stringify(request));
    var token = "";
    let func1 = extrequire("GT56492AT34.backDefaultGroup.gettoken");
    let res2 = func1.execute(request);
    token = res2.access_token;
    var gongsimingchen = request.gongsimingchen;
    var lianxiren = request.lianxiren;
    var lianxidianhua = request.lianxidianhua;
    //人员编码
    var zhidanrenzuzhi;
    var zhidanrenbumen;
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
          zhidanrenzuzhi = mainJobList.org_id;
          zhidanrenbumen = mainJobList.dept_id;
        }
      }
    }
    var object = { gongsimingchen: gongsimingchen, lianxiren: lianxiren, lianxidianhua: lianxidianhua, zhidanren: zhidanren, zhidanrenzuzhi: zhidanrenzuzhi, zhidanrenbumen: zhidanrenbumen };
    var res = ObjectStore.insert("GT56481AT32.GT56481AT32.QYK", object, "QYK");
    var customercode = res.code;
    var id = res.id;
    var hmd_contenttype = "application/json;charset=UTF-8";
    let apiResponse;
    let header = {
      "Content-Type": hmd_contenttype
    };
    var bodyhead = {
      billnum: "customerdoc_listcard",
      data: {
        orgid: "youridHere",
        code: customercode,
        name: {
          zh_CN: gongsimingchen
        },
        enable: "1",
        _status: "Insert"
      }
    };
    let apiResponse1 = postman(
      "post",
      "https://www.example.com/" + token + "&custdocdefid=2513268778783488",
      JSON.stringify(header),
      JSON.stringify(bodyhead)
    );
    var apiResponse1json = JSON.parse(apiResponse1);
    var queryCode1 = apiResponse1json.code;
    if (queryCode1 !== "200") {
      throw new Error("错误" + apiResponse1json.message + JSON.stringify(bodyhead));
    } else {
      var qiyeku_id = apiResponse1json.data.id;
      var object = { id: id, qiyeku: qiyeku_id, qiyekubianma: customercode, qiyeku_name: gongsimingchen };
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });