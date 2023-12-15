let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var userId = request.userId;
    //通过用户ID查询员工信息
    let base_path = "https://www.example.com/";
    var body = {
      userId: [userId]
    };
    //请求数据
    let apiResponse = openLinker("post", base_path, "GT102500AT53", JSON.stringify(body));
    var result = JSON.parse(apiResponse);
    var queryCode = result.code;
    if (queryCode !== "200") {
      throw new Error("查询用户对应人员错误 " + result.message);
    }
    var psndocid = result.data.data[0].id;
    var psndocname = result.data.data[0].name;
    var dept_id = result.data.data[0].dept_id;
    var dept_id_name = result.data.data[0].dept_id_name;
    var org_id = result.data.data[0].org_id;
    var org_id_name = result.data.data[0].org_id_name;
    return {
      staffId: psndocid,
      staffName: psndocname,
      deptId: dept_id,
      deptName: dept_id_name,
      orgId: org_id,
      orgName: org_id_name
    };
  }
}
exports({ entryPoint: MyAPIHandler });