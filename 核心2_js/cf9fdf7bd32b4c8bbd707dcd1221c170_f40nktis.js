let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let projectQuery = {};
    projectQuery.name = request.name;
    projectQuery.code = "";
    projectQuery.pageIndex = 1;
    projectQuery.pageSize = 10;
    var projectQueryResponse = openLinker("POST", "https://www.example.com/", "GT8429AT6", JSON.stringify(projectQuery));
    var projectQueryJsonObject = JSON.parse(projectQueryResponse);
    if (projectQueryJsonObject.data.recordList.length > 0) {
      throw new Error("项目已存在", "201");
    }
    // 构建请求apiData入参
    var res = AppContext();
    var dept = JSON.parse(AppContext()).currentUser.id;
    var sql_dept = "select mainJobList.dept_id, mainJobList.dept_id.name, mainJobList.post_id, mainJobList.post_id.name from bd.staff.StaffNew where user_id ='" + dept + "'";
    var deptObj = ObjectStore.queryByYonQL(sql_dept, "ucf-staff-center");
    var main = {};
    // 设置入参字段_status为更新
    main._status = "Insert";
    main.enable = "1";
    main.sysid = "youridHere";
    main.orgid = "youridHere";
    main.deptid = deptObj[0].mainJobList_dept_id;
    main.person = JSON.parse(res).currentUser.staffId;
    main.code = "";
    let name = {
      zh_CN: request.name
    };
    main.name = name;
    var apiData = { data: main };
    // 使用openLinker调用开放接口
    var strResponse = openLinker("POST", "https://www.example.com/", "GT8429AT6", JSON.stringify(apiData));
    var responseObj = JSON.parse(strResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });