let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let userId; //用户Id
      var res; //返回信息
      userId = request.userId;
      if (userId != null) {
        //通过用户ID查询员工信息
        let base_path = "https://www.example.com/";
        var body = {
          userId: [userId]
        };
        //请求数据
        let apiResponse = openLinker("POST", base_path, "AT1767B4C61D580001", JSON.stringify(body));
        var result = JSON.parse(apiResponse);
        var queryCode = result.code;
        if (queryCode !== "200") {
          throw new Error("查询用户对应人员错误 " + result.message);
        }
        var psndocid = result.data.data[0].id;
        var psndoccode = result.data.data[0].code;
        var psndocname = result.data.data[0].name;
        var dept_id = result.data.data[0].dept_id;
        var dept_id_name = result.data.data[0].dept_id_name;
        var org_id = result.data.data[0].org_id;
        var org_id_name = result.data.data[0].org_id_name;
        res = {
          staffId: psndocid,
          staffCode: psndoccode,
          staffName: psndocname,
          deptId: dept_id,
          deptCode: "",
          deptName: dept_id_name,
          orgId: org_id,
          orgIdCode: "",
          orgName: org_id_name
        };
        //获取部门信息
        base_path = "https://www.example.com/" + res.deptId;
        //请求数据
        let depapiResponse = openLinker("GET", base_path, "AT1767B4C61D580001", JSON.stringify(body));
        result = JSON.parse(depapiResponse);
        queryCode = result.code;
        if (queryCode !== "200") {
          throw new Error("查询用户对应部门信息错误 " + result.message);
        }
        res.deptCode = result.data.code;
        //获取组织信息
        base_path = "https://www.example.com/" + res.orgId;
        //请求数据
        let orgapiResponse = openLinker("GET", base_path, "AT1767B4C61D580001", JSON.stringify(body));
        result = JSON.parse(orgapiResponse);
        queryCode = result.code;
        if (queryCode !== "200") {
          throw new Error("查询用户对应组织信息错误 " + result.message);
        }
        res.orgIdCode = result.data.code;
      } else {
        throw new Error("用户Id不能为空");
      }
      var rsp = {
        code: 0,
        msg: "调用ys接口成功",
        data: res
      };
      return {
        rsp
      };
    } catch (e) {
      return {
        rsp: {
          code: 500,
          msg: e.message
        }
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});