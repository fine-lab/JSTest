let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ownStaff = JSON.parse(param.requestData); //请求的单卡参数
    var paramReturn = param.return;
    let item2839fe = ownStaff.item2839fe; //信息来源
    if (item2839fe == "WDZG") {
      let item4686ag = ownStaff.item4686ag; //上级主管系统员工ID
      let sysStaffID = ownStaff.sysStaff; //系统员工ID
      let item4918wf = ownStaff.item4918wf; //系统任职ID
      let item2721lk = ownStaff.item2721lk; //0为主任职  1为兼职
      //如果信息来源是-我的主管
      let func1 = extrequire("GT34544AT7.staff.showStaffById"); //查询系统员工详情
      let staff = func1.execute({ id: sysStaffID }).res.data;
      //拼装新的员工对象，用于更新员工卡片
      staff._status = "Update";
      delete staff.pubts;
      if (staff.bankAcctList !== undefined && staff.bankAcctList.length > 0) {
        delete staff.bankAcctList;
      }
      let mainJobList = staff.mainJobList;
      if (item2721lk == "0") {
        if (mainJobList[0].id == item4918wf) {
          //校验获取到的系统员工详情的任职ID是否与需要修改的数据一致
          mainJobList[0].director = item4686ag;
        }
        delete staff.ptJobList;
      } else {
        //需要将员工卡片某一条兼职信息停掉
        let ptJobList = staff.ptJobList;
        for (let i = 0; i < ptJobList.length; i++) {
          if (ptJobList[i].id == item4918wf) {
            //校验获取到的系统员工详情的任职ID是否与需要修改的数据一致
            ptJobList[i].director = item4686ag;
          }
          ptJobList[i]._status = "Update";
          delete ptJobList[i].pubts;
        }
      }
      mainJobList[0]._status = "Update";
      delete mainJobList[0].pubts;
      let request = {};
      request.uri = "/yonbip/digitalModel/staff/save";
      request.body = { data: staff };
      let func = extrequire("GT34544AT7.common.baseOpenApi");
      let sysStaff = func.execute(request).res;
      throw new Error(JSON.stringify(request));
      if (sysStaff.code !== "200") {
        let param999 = { title: "维护我的主管失败（老邻居员工）", content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message };
        let func999 = extrequire("GT34544AT7.common.push");
        let res999 = func999.execute(param999);
        throw new Error("\n维护系统员工卡片我的主管时出错：\n" + sysStaff.message);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });