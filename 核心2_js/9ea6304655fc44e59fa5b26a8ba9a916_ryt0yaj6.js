let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var userid = request.userid;
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      userId: [userid]
    };
    //请求数据
    let apiResponse = openLinker("post", base_path, "GT64168AT5", JSON.stringify(body));
    var apiResponsejaon = JSON.parse(apiResponse);
    var queryCode = apiResponsejaon.code;
    if (queryCode !== "200") {
      throw new Error("查询用户对应人员错误 " + apiResponsejaon.message);
    }
    var psndocid = apiResponsejaon.data.data[0].id;
    var psndocname = apiResponsejaon.data.data[0].name;
    var dept_id = apiResponsejaon.data.data[0].dept_id;
    var dept_id_name = apiResponsejaon.data.data[0].dept_id_name;
    var org_id = apiResponsejaon.data.data[0].org_id;
    var org_id_name = apiResponsejaon.data.data[0].org_id_name;
    return { psndocid: psndocid, psndocname: psndocname, dept_id: dept_id, dept_id_name: dept_id_name, request: request, org_id: org_id, org_id_name: org_id_name };
  }
}
exports({ entryPoint: MyAPIHandler });