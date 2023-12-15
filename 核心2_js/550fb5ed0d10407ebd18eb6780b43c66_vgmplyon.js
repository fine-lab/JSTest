let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param = request.param;
    let dept_id = param.dept_id;
    let dept_name = param.dept_name;
    let staffMaster = param.staffMaster;
    let body = {};
    body["pageIndex"] = 1;
    body["pageSize"] = 100;
    body["mainJobList.dept_id"] = dept_id;
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT165369EC09000003", JSON.stringify(body));
    let list = apiResponse.recordList;
    if (!list) {
      let message = "部门:" + dept_name + ",查无员工数据！";
      return { status: 1, message: message };
    }
    let staffList = [];
    for (var i = 0; i < list.length; i++) {
      let data = list[i];
      let staffid = data.id;
      if (staffMaster == staffid) {
        continue;
      }
      staffList.push(data.id);
    }
    return { staffList: staffList };
  }
}
exports({ entryPoint: MyAPIHandler });