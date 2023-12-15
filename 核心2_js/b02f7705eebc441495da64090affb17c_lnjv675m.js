let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ownStaff = JSON.parse(param.requestData); //请求的单卡参数
    var paramReturn = param.return;
    let item2839fe = ownStaff.item2839fe; //信息来源
    if (item2839fe == "YGRZBD") {
      let item2721lk = ownStaff.item2721lk; // 0为主任职 1为兼职（有效任职指主任职）
      let sysStaffID = ownStaff.sysStaff; //系统员工ID
      //如果信息来源是-员工任职变动
      let OldStaffMainJob = ownStaff.item3757ff; //原任职ID
      let OldJobendDate = ownStaff.item4456jf; //原任职结束时间
      let OldSysDept = ownStaff.item4222nj; //原任职系统部门ID
      var gxsStaffMainJob = { id: OldStaffMainJob, endDate: OldJobendDate, isOnJob: "0" };
      var gxsStaffMainJobres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", gxsStaffMainJob, "f5ad586c"); //维护自建表
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
        //需要将员工卡片主任职信息停掉
        if (mainJobList[0].dept_id == OldSysDept) {
          //再次校验获取到的系统员工详情主任职部门是否与原主任职相同
          mainJobList[0].enddate = OldJobendDate;
        }
        delete staff.ptJobList;
      } else {
        //需要将员工卡片某一条兼职信息停掉
        let ptJobList = staff.ptJobList;
        for (let i = 0; i < ptJobList.length; i++) {
          if (ptJobList[i].dept_id == OldSysDept) {
            //再次校验获取到的系统员工详情主任职部门是否与原主任职相同
            ptJobList[i].enddate = OldJobendDate;
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
      if (sysStaff.code !== "200") {
        let param999 = { title: "老邻居任职变动出错（停用员工兼职）", content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message };
        let func999 = extrequire("GT34544AT7.common.push");
        let res999 = func999.execute(param999);
        throw new Error("\n维护系统员工卡片原任职结束时间时出错：\n" + sysStaff.message);
      }
      func1 = extrequire("GT34544AT7.staff.showStaffById"); //查询系统员工详情
      staff = func1.execute({ id: sysStaffID }).res.data;
      staff._status = "Update";
      delete staff.pubts;
      if (staff.bankAcctList !== undefined && staff.bankAcctList.length > 0) {
        delete staff.bankAcctList;
      }
      let obj = {
        enable: 1,
        _status: "Insert"
      };
      let ownMainJobList = ownStaff.gxsStaffMainJobList[0];
      let ownMainJobListKeyArr = Object.keys(ownMainJobList);
      for (let i = 0; i < ownMainJobListKeyArr.length; i++) {
        let ownMainJobListKey = ownMainJobListKeyArr[i];
        switch (ownMainJobListKey) {
          case "sysOrg":
            obj.org_id = ownMainJobList.sysOrg;
            break;
          case "sysDept":
            obj.dept_id = ownMainJobList.sysDept;
            break;
          case "beginDate":
            obj.begindate = ownMainJobList.beginDate;
            break;
          case "psncl":
            obj.psncl_id = ownMainJobList.psncl;
            break;
          case "director":
            obj.director = ownMainJobList.director;
            break;
          case "responsibilities":
            obj.responsibilities = ownMainJobList.responsibilities;
            break;
          case "jobGrade":
            obj.jobgrade_id = ownMainJobList.jobGrade;
            break;
          case "Position":
            obj.post_id = ownMainJobList.Position;
            break;
          case "job":
            obj.job_id = ownMainJobList.job;
        }
      }
      if (item2721lk == "0") {
        //需要添加主任职信息
        staff.mainJobList[0] = obj;
        delete staff.ptJobList;
      } else {
        //需要添加兼职信息
        staff.ptJobList.push(obj);
        delete mainJobList[0].pubts;
      }
      request.uri = "/yonbip/digitalModel/staff/save";
      request.body = { data: staff };
      func = extrequire("GT34544AT7.common.baseOpenApi");
      sysStaff = func.execute(request).res;
      if (sysStaff.code !== "200") {
        let param999 = { title: "老邻居任职变动出错（添加员工兼职）", content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message };
        let func999 = extrequire("GT34544AT7.common.push");
        let res999 = func999.execute(param999);
        throw new Error("\n新增系统员工任职时出错：\n" + sysStaff.message);
      }
      if (item2721lk == "0") {
        var sysMainJobId = sysStaff.data.mainJobList[0].id;
      } else {
        var sysMainJobId = sysStaff.data.ptJobList[sysStaff.data.ptJobList.length - 1].id;
      }
      let object = { id: paramReturn.gxsStaffMainJobList[0].id, txtID: paramReturn.gxsStaffMainJobList[0].id, sysMainJobId: sysMainJobId };
      let res = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", object, "fdc56adc");
      object = { id: ownStaff.gxsStaffMainJobList[0].source_id, NewStaffMainJob: paramReturn.gxsStaffMainJobList[0].id, NewJob: "1", sysMainJobId: sysMainJobId };
      res = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffChange", object, "yb308f28af");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });