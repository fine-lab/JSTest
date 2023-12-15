let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let app = JSON.parse(param.requestData);
    let returnData = param.return;
    let _status = app._status;
    let stafftable = "GT1559AT25.GT1559AT25.GxyCustomerStaff";
    let billno = "1f193fe1";
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
    let sysemail = code + "-" + S4() + "@gxy.com";
    let email = !!app.WorkEmail ? app.WorkEmail : sysemail;
    var haveOwnMainJob = app.GxyCustomerStaffMainJobList[0]; //是否有子实体
    // 获取任职组织
    let gco = app.gxyCustomer;
    // 获取任职部门
    let gcd = haveOwnMainJob.GxyCustomerDept;
    // 客户组织
    let gcotable = "GT1559AT25.GT1559AT25.GxyCustomer";
    // 客户部门
    let gcdtable = "GT1559AT25.GT1559AT25.GxyCustomerDept";
    //查询客户组织
    var gcOrg = ObjectStore.selectById(gcotable, { id: gco });
    // 查询客户部门
    var gcDept = ObjectStore.selectById(gcdtable, { id: gcd });
    let main_org_id = gcOrg.sysOrg;
    let dept_id = gcDept.sysDept;
    let begindate = haveOwnMainJob.beginDate;
    if (!!main_org_id && !!dept_id && !!begindate) {
      // 先查看是否存在这个员工
      let staffinfo = getSysStaff(staffcode);
      if (!!staffinfo && staffinfo._emptyResult == null) {
        throw new Error(JSON.stringify(staffinfo));
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
        // 员工保存
        let staffSave = extrequire("GT34544AT7.staff.createStaff");
        request.body = body;
        let resStaffSave = staffSave.execute(request).res.res;
        let staff = resStaffSave.data;
        let ngcstaff = {
          id: returnData.id,
          org_id: main_org_id,
          sysStaff: staff.id,
          sysemail: email,
          _status: "Update",
          GxyCustomerStaffMainJobList: [
            {
              id: returnData.GxyCustomerStaffMainJobList[0].id,
              GxyCustomerOrg: gco,
              sysStaff: staff.id,
              sysStaffCode: staff.code,
              sysOrg: main_org_id,
              sysOrgCode: gcOrg.OrgCode,
              sysDept: dept_id,
              sysDeptCode: gcDept.DeptCode,
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