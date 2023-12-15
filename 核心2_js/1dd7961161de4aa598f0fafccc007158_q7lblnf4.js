let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userid = request.userId;
    let base_path = "https://www.example.com/";
    let body = { userId: [userid] };
    //请求数据
    let apiResponse = openLinker("post", base_path, "GT72378AT18", JSON.stringify(body));
    let result = JSON.parse(apiResponse);
    let code = result.code;
    if (code !== "200") {
      throw new Error("查询用户对应人员错误 " + result.message);
    }
    let staff = result.data.data;
    if (staff) {
      let user_id = staff[0].id;
      let user_name = staff[0].name;
      let dept_id = staff[0].dept_id;
      let dept_id_name = staff[0].dept_id_name;
      let org_id = staff[0].org_id;
      let org_id_name = staff[0].org_id_name;
      return {
        user_id: user_id,
        user_name: user_name,
        dept_id: dept_id,
        dept_id_name: dept_id_name,
        request: request,
        org_id: org_id,
        org_id_name: org_id_name
      };
    } else {
      throw new Error("未查询到用户信息 " + result.message);
    }
  }
}
exports({ entryPoint: MyAPIHandler });