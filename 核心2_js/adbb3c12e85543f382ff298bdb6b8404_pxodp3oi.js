let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var obj = JSON.parse(AppContext());
    var tid = obj.currentUser.tenantId;
    let reqOperator = request.operator;
    let reqOrgId = request.org;
    let reqDept = request.dept;
    let reqDeptName = request.deptname;
    let deptRst = ObjectStore.queryByYonQL("select * from bd.adminOrg.DeptOrgVO where id='" + reqDept + "'", "ucf-org-center"); //orgId,deptId
    let staffRst = ObjectStore.queryByYonQL(
      "select *,deptId.name,deptId.code,deptId.level from hred.staff.StaffPart where staffId='" + reqOperator + "' and orgId='" + reqOrgId + "' and endFlag=0 and dr=0 ",
      "hrcloud-staff-mgr"
    );
    if (deptRst.length > 0) {
      let deptObj = deptRst[0];
      if (deptObj.parentorgid == reqOrgId || deptObj.id == reqOrgId) {
        //相同组织--不用变化
        if (staffRst.length == 1) {
          let staffObj = staffRst[0];
          return { rst: true, msg: "部门与销售组织一致", deptRst: deptRst, staffRst: staffRst, deptId: staffObj.deptId, deptName: staffObj.deptId_name, deptCode: staffObj.deptId_code };
        } else if (staffRst.length > 1) {
          let level = 10;
          let idx = 0;
          let staffObj = staffRst[0];
          for (var i in staffRst) {
            staffObj = staffRst[i];
            if (staffObj.deptId_level < level) {
              level = staffObj.deptId_level;
              idx = i;
            }
          }
          return { rst: true, msg: "部门与销售组织一致", deptRst: deptRst, staffRst: staffRst, deptId: staffObj.deptId, deptName: staffObj.deptId_name, deptCode: staffObj.deptId_code };
        } else {
          return { rst: true, msg: "部门与销售组织一致，但未找到员工对应的部门", deptRst: deptRst };
        }
      } else {
        //不一致
        if (staffRst.length == 1) {
          let staffObj = staffRst[0];
          return { rst: false, msg: "部门与销售组织不一致", deptRst: deptRst, staffRst: staffRst, deptId: staffObj.deptId, deptName: staffObj.deptId_name, deptCode: staffObj.deptId_code };
        } else if (staffRst.length > 1) {
          let level = 10;
          let idx = 0;
          let staffObj = staffRst[0];
          for (var i in staffRst) {
            staffObj = staffRst[i];
            if (staffObj.deptId_level < level) {
              level = staffObj.deptId_level;
              idx = i;
            }
          }
          return { rst: false, msg: "部门与销售组织不一致", deptRst: deptRst, staffRst: staffRst, deptId: staffObj.deptId, deptName: staffObj.deptId_name, deptCode: staffObj.deptId_code };
        } else {
          return { rst: false, msg: "部门与销售组织不一致，且未找到对应的部门", deptRst: deptRst };
        }
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });