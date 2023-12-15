let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ownStaff = JSON.parse(param.requestData); //请求的单卡参数
    var paramReturn = param.return;
    let item2839fe = ownStaff.item2839fe; //信息来源
    if (item2839fe == "ZZGLYDJ") {
      let item1707ni = ownStaff.item1707ni; //系统员工编码
      let sysStaffID = ownStaff.sysStaff; //系统员工ID
      let item2421ci = ownStaff.item2421ci; //停用的员工
      let item2539th = ownStaff.item2539th; //停用员工的系统ID
      var sysStaffUnstopCode = "1534";
      if (item2421ci !== "true" && item2421ci !== true) {
        //有停用的系统员工信息
        let request = {};
        request.uri = "/yonbip/digitalModel/staff/unstop";
        let data = { enable: "2", id: item2539th };
        request.body = { data: data };
        let func = extrequire("GT34544AT7.common.baseOpenApi");
        let sysStaff = func.execute(request).res;
        sysStaffUnstopCode = sysStaff.code;
        if (sysStaffUnstopCode !== "200") {
          let param999 = { title: "组织管理员登记失败（启用员工）", content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message };
          let func999 = extrequire("GT34544AT7.common.push");
          let res999 = func999.execute(param999);
          throw new Error("系统员工启用失败！请联系管理员！\n" + sysStaff.message);
        }
      }
      if (sysStaffUnstopCode == "200") {
        //看是不是重启后的状态，如果是，要先把上一条任职记录的结束任职日期加上
        let func1 = extrequire("GT34544AT7.staff.showStaffById");
        let staff = func1.execute({ id: item2539th }).res.data;
        staff._status = "Update";
        delete staff.pubts;
        if (staff.bankAcctList !== undefined && staff.bankAcctList.length > 0) {
          delete staff.bankAcctList;
        }
        let mainJobList = staff.mainJobList;
        if (mainJobList.length == 0) {
          mainJobList[0] = {};
        }
        mainJobList[0]._status = "Update";
        let item2656id = ownStaff.item2656id;
        mainJobList[0].enddate = item2656id;
        delete mainJobList[0].pubts;
        request.body = { data: staff };
        let func = extrequire("GT34544AT7.common.baseOpenApi");
        let sysStaff = func.execute(request).res;
      }
      if (sysStaffID == undefined || sysStaffID == "" || sysStaffID.length == 0) {
        //说明是新增员工信息
        let code = paramReturn.code; //员工编码就要拿单据保存后返回的
        let addSysStaffData = {
          enable: 1,
          _status: "Insert",
          code: code,
          name: ownStaff.name,
          mobile: ownStaff.mobile,
          cert_no: ownStaff.cert_no
        };
        let ownMainJobList = ownStaff.gxsStaffMainJobList[0]; //任职子表数据
        addSysStaffData.mainJobList = [];
        addSysStaffData.mainJobList.push({
          org_id: ownMainJobList.sysOrg,
          dept_id: ownMainJobList.sysDept,
          begindate: ownMainJobList.beginDate,
          _status: "Insert"
        });
        addSysStaffData.ptJobList = [];
        addSysStaffData.ptJobList.push({
          org_id: ownMainJobList.sysOrg,
          dept_id: ownStaff.item5405yf,
          begindate: ownMainJobList.beginDate,
          _status: "Insert"
        });
        let request = {};
        request.uri = "/yonbip/digitalModel/staff/save";
        request.body = { data: addSysStaffData };
        let func = extrequire("GT34544AT7.common.baseOpenApi");
        let sysStaff = func.execute(request).res;
        if (sysStaff.code === "999") {
          let param999 = { title: "组织管理员登记失败", content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：无" };
          let func999 = extrequire("GT34544AT7.common.push");
          let res999 = func999.execute(param999);
          throw new Error("新增组织管理员失败！\n" + sysStaff.message);
        }
        //回写数据到gxs员工
        var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
        var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
        let sysMainJobId = sysStaff.data.mainJobList[0].id;
        //回写数据到任职子表
        var hxstaffobject = {
          id: paramReturn.gxsStaffMainJobList[0].id,
          isOnJob: "1",
          txtID: paramReturn.gxsStaffMainJobList[0].id,
          sysMainJobId: sysMainJobId,
          sysStaff: sysStaff.data.id,
          GxyStaffCode: paramReturn.code,
          sysStaffCode: code
        };
        var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
        //回写数据到供销社组织机构表
        var hxownorg = { id: paramReturn.gxsStaffMainJobList[0].GxsOrg, isOrgManager: 1 };
        var hxownorgres = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", hxownorg, "e1268035");
      } else {
        //如果不是新增员工（已经存在该系统员工）
        //两种情况，一种是该系统员工有主任职信息，一种是没有
        let isJZ = ownStaff.item2721lk;
        if (isJZ == "1" || isJZ == 1) {
          //有主任职信息
          let code = paramReturn.code; //员工编码就要拿单据保存后返回的
          let ownMainJobList = ownStaff.gxsStaffMainJobList[0]; //任职子表数据
          let func1 = extrequire("GT34544AT7.staff.showStaffById");
          let staff = func1.execute({ id: sysStaffID }).res.data;
          staff._status = "Update";
          delete staff.pubts;
          if (staff.bankAcctList !== undefined && staff.bankAcctList.length > 0) {
            delete staff.bankAcctList;
          }
          let mainJobList = staff.mainJobList;
          for (let i = 0; i < mainJobList.length; i++) {
            mainJobList[i]._status = "Update";
            delete mainJobList[i].pubts;
          }
          staff.ptJobList = [];
          staff.ptJobList.push({
            org_id: ownMainJobList.sysOrg,
            dept_id: ownMainJobList.sysDept,
            begindate: ownMainJobList.beginDate,
            _status: "Insert"
          });
          staff.ptJobList.push({
            org_id: ownMainJobList.sysOrg,
            dept_id: ownStaff.item5405yf,
            begindate: ownMainJobList.beginDate,
            _status: "Insert"
          });
          let request = {};
          request.uri = "/yonbip/digitalModel/staff/save";
          request.body = { data: staff };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let sysStaff = func.execute(request).res;
          if (sysStaff.code === "999") {
            let param999 = {
              title: "组织管理员登记失败",
              content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：有"
            };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("更新组织管理员兼职信息失败！\n" + sysStaff.message);
          }
          //回写数据到gxs员工
          var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
          var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
          let sysMainJobId = sysStaff.data.mainJobList[0].id;
          //回写数据到任职子表
          var hxstaffobject = {
            id: paramReturn.gxsStaffMainJobList[0].id,
            isOnJob: "1",
            txtID: paramReturn.gxsStaffMainJobList[0].id,
            sysMainJobId: sysMainJobId,
            sysStaff: sysStaff.data.id,
            GxyStaffCode: paramReturn.code,
            sysStaffCode: staff.code
          };
          var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
          //回写数据到供销社组织机构表
          var hxownorg = { id: paramReturn.gxsStaffMainJobList[0].GxsOrg, isOrgManager: 1 };
          var hxownorgres = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", hxownorg, "e1268035");
        } else {
          let addSysStaffData = {
            enable: 1,
            _status: "Update",
            name: ownStaff.name,
            mobile: ownStaff.mobile,
            cert_no: ownStaff.cert_no,
            id: sysStaffID
          };
          let code = ""; //员工编码就要拿单据保存后返回的
          if (item1707ni) {
            addSysStaffData.code = item1707ni;
          } else {
            addSysStaffData.code = paramReturn.code;
          }
          let ownMainJobList = ownStaff.gxsStaffMainJobList[0]; //任职子表数据
          addSysStaffData.mainJobList = [];
          addSysStaffData.mainJobList.push({
            org_id: ownMainJobList.sysOrg,
            dept_id: ownMainJobList.sysDept,
            begindate: ownMainJobList.beginDate,
            _status: "Insert"
          });
          addSysStaffData.ptJobList = [];
          addSysStaffData.ptJobList.push({
            org_id: ownMainJobList.sysOrg,
            dept_id: ownStaff.item5405yf,
            begindate: ownMainJobList.beginDate,
            _status: "Insert"
          });
          let request = {};
          request.uri = "/yonbip/digitalModel/staff/save";
          request.body = { data: addSysStaffData };
          let func = extrequire("GT34544AT7.common.baseOpenApi");
          let sysStaff = func.execute(request).res;
          if (sysStaff.code === "999") {
            let param999 = {
              title: "组织管理员登记失败",
              content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：无"
            };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("更新组织管理员兼职信息失败！\n" + sysStaff.message);
          }
          //回写数据到gxs员工
          var object = { id: paramReturn.id, isJob: "1", sysStaff: sysStaff.data.id };
          var res = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsStaff", object, "13073119");
          let sysMainJobId = sysStaff.data.mainJobList[0].id;
          //回写数据到任职子表
          var hxstaffobject = {
            id: paramReturn.gxsStaffMainJobList[0].id,
            isOnJob: "1",
            txtID: paramReturn.gxsStaffMainJobList[0].id,
            sysMainJobId: sysMainJobId,
            sysStaff: sysStaff.data.id,
            GxyStaffCode: paramReturn.code,
            sysStaffCode: addSysStaffData.code
          };
          var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
          //回写数据到供销社组织表
          var hxownorg = { id: paramReturn.gxsStaffMainJobList[0].GxsOrg, isOrgManager: 1 };
          var hxownorgres = ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", hxownorg, "e1268035");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });