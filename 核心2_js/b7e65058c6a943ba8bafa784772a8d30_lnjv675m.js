let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let app = JSON.parse(param.requestData);
    let returnData = param.return;
    let _status = app._status;
    let stafftable = "GT1559AT25.GT1559AT25.AgentStaff";
    let billno = "579f1ffe";
    if (_status === null || _status === undefined) {
      throw new Error("无法判断页面状态，请找用友客服人员解决");
    }
    let staffcode = app.code;
    // 声明获取系统员工方法
    function getSysStaff(staffcode) {
      let req = {
        code: staffcode
      };
      let showSysStaff = extrequire("GT34544AT7.staff.showStaffInfoByIdCd");
      let sysstaff = showSysStaff.execute(req).res;
      let data1 = sysstaff.data;
      return data1;
    }
    let request = {};
    let code = app.code;
    let name = app.name;
    let sysemail = code + "_" + S4() + "@gxy.com";
    let email = !!app.WorkEmail ? app.WorkEmail : sysemail;
    var haveOwnMainJob = app.AgentStaffMainJobList[0]; //是否有子实体
    // 获取任职组织
    let gco = app.agentOrg;
    // 获取任职部门
    let gcd = haveOwnMainJob.AgentDept;
    // 客户组织部门
    let gcotable = "GT1559AT25.GT1559AT25.AgentOrg";
    //查询客户组织
    var gcOrg = ObjectStore.selectById(gcotable, { id: gco });
    // 查询客户部门
    var gcDept = ObjectStore.selectById(gcotable, { id: gcd });
    let main_org_id = gcOrg.sysOrg;
    let dept_id = gcDept.sysOrg;
    let begindate = haveOwnMainJob.beginDate;
    if (!!main_org_id && !!dept_id && !!begindate) {
      let staffinfo = getSysStaff(staffcode);
      // 先查看是否存在这个员工
      if (!!staffinfo && staffinfo._emptyResult == null) {
        throw new Error("员工编码重复，请联系管理员删除重试。");
      } else {
        let body = {
          data: {
            code: code,
            name: name,
            email: email,
            _status: _status,
            enable: 1,
            mainJobList: {
              org_id: main_org_id,
              dept_id: dept_id,
              begindate: begindate,
              _status: "Insert"
            }
          }
        };
        //员工保存
        let staffSave = extrequire("GT34544AT7.staff.createStaff");
        request.body = body;
        let resStaffSave = staffSave.execute(request).res.res;
        let staff = resStaffSave.data;
        let ngcstaff = {
          id: returnData.id,
          sysStaff: staff.id,
          sysemail: email,
          _status: "Update",
          AgentStaffMainJobList: [
            {
              id: returnData.AgentStaffMainJobList[0].id,
              AgentOrg: gco,
              sysStaff: staff.id,
              sysStaffCode: staff.code,
              sysOrg: main_org_id,
              sysOrgCode: gcOrg.OrgCode,
              sysDept: dept_id,
              sysDeptCode: gcDept.OrgCode,
              _status: "Update"
            }
          ]
        };
        let gcsf = ObjectStore.updateById(stafftable, ngcstaff, billno);
      }
    } else {
      if (main_org_id == undefined || main_org_id == null) {
        throw new Error("组织未同步");
      }
      if (dept_id == undefined || dept_id == null) {
        throw new Error("部门未同步");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });