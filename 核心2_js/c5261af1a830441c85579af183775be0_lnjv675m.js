let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ownStaff = JSON.parse(param.requestData); //请求的单卡参数
    var paramReturn = param.return;
    var gxsStaffMainJobList = ownStaff.gxsStaffMainJobList;
    let staffSource = ownStaff.staffSource; //信息来源
    if (staffSource == "CJQYGLY") {
      let sysStaffCode = gxsStaffMainJobList[0].sysStaffCode; //系统员工编码
      let sysStaffID = ownStaff.sysStaff; //系统员工ID
      let org_id = ownStaff.org_id;
      let mobile = ownStaff.mobile;
      let sql = "select AdminOrgVO from GT34544AT7.GT34544AT7.gxsAreaAdmin where sysManagerOrg = '" + org_id + "' and mobile = '" + mobile + "' and isEnable = '1'";
      let sqlres = ObjectStore.queryByYonQL(sql);
      let AdminOrgVO = sqlres[0].AdminOrgVO;
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
          dept_id: AdminOrgVO,
          begindate: ownMainJobList.beginDate,
          _status: "Insert"
        });
        let request = {};
        request.uri = "/yonbip/digitalModel/staff/save";
        request.body = { data: addSysStaffData };
        let func = extrequire("GT34544AT7.common.baseOpenApi");
        let sysStaff = func.execute(request).res;
        if (sysStaff.code === "999") {
          let param999 = { title: "创建区域管理员失败", content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：无" };
          let func999 = extrequire("GT34544AT7.common.push");
          let res999 = func999.execute(param999);
          throw new Error("新增区域管理员失败！\n" + sysStaff.message);
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
          GxyStaffCode: paramReturn.code
        };
        var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
        //回写数据到管理单位表
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
            dept_id: AdminOrgVO,
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
              title: "创建区域管理员失败",
              content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：有"
            };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("更新区域管理员兼职信息失败！\n" + sysStaff.message);
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
            GxyStaffCode: paramReturn.code
          };
          var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
          //回写数据到管理单位表
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
          if (sysStaffCode) {
            addSysStaffData.code = sysStaffCode;
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
            dept_id: AdminOrgVO,
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
              title: "创建区域管理员失败",
              content: "请求参数:\n" + JSON.stringify(request.body.data) + "\n\n\n失败原因:\n" + sysStaff.message + "\n\n系统有无该员工：有" + "\n\n系统有无任职：无"
            };
            let func999 = extrequire("GT34544AT7.common.push");
            let res999 = func999.execute(param999);
            throw new Error("更新区域管理员主任职信息失败！\n" + sysStaff.message);
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
            GxyStaffCode: paramReturn.code
          };
          var hxstaffres = ObjectStore.updateById("GT34544AT7.GT34544AT7.gxsStaffMainJob", hxstaffobject, "fdc56adc");
          //回写数据到管理单位表
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });