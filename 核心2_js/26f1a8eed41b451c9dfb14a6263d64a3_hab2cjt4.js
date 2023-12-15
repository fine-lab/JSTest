let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取token
    let func1 = extrequire("GT43085AT4.backDefaultGroup.getToken");
    let res1 = func1.execute();
    let token = res1.access_token;
    //数据部分
    var data = request.data;
    var DeptOrgVO = data.DeptOrgVO;
    var billnum = data.billnum;
    for (var i = 0; i < DeptOrgVO.length; i++) {
      //数据部分
      var dataa = DeptOrgVO[i];
      var parent_name = dataa.parent_name;
      var bizorgid_name = dataa.bizorgid_name;
      var code = dataa.code;
      var depttype_name = dataa.depttype_name;
      var __rowNum = dataa.__rowNum;
      var __orginSheetName = dataa.__orginSheetName;
      var name = dataa.name;
      var name2 = dataa.name2;
      var name3 = dataa.name3;
      var principal_name = dataa.principal_name;
      var branchleader_name = dataa.branchleader_name;
      var objid = dataa.objid;
      //插入还是更新标志位
      var _status = "Update";
      let obj1 = {
        token: token,
        code: code
      };
      let func2 = extrequire("GT43085AT4.selectDept.deptByCodeApi");
      let res2 = func2.execute(obj1);
      if (res2.data.length == 0) {
        _status = "Insert";
      }
      return { res2 };
    }
  }
}
exports({ entryPoint: MyAPIHandler });