let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let postId = request.postId;
    let deptName = request.deptName;
    let deptId = request.deptId;
    let gridData = [];
    if (postId) {
      //查询岗位下的人员信息
      let queryStaff =
        "select name staffName,id staffId,sub.beginDate effectiveDate   from hred.staff.Staff main inner join hred.staff.StaffJob sub on main.id=sub.staffId " +
        " where sub.endFlag='N' " +
        " and sub.isMainJob='Y'" +
        " and sub.postId='" +
        postId +
        "'";
      let staffMessageArray = ObjectStore.queryByYonQL(queryStaff, "hrcloud-staff-mgr");
      if (staffMessageArray) {
        staffMessageArray.map((staff) => {
          staff.deptName = deptName;
          staff.deptId = deptId;
          gridData.push(staff);
        });
      }
    }
    return { gridData };
  }
}
exports({ entryPoint: MyAPIHandler });