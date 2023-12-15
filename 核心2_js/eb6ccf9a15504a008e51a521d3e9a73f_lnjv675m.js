let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    function gettime() {
      let date = new Date();
      var currTimestamp = date.getTime();
      var targetTimestamp = currTimestamp + 8 * 3600 * 1000;
      date = new Date(targetTimestamp);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      let begindate = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
      return begindate;
    }
    var res = null;
    let app = param.return;
    // 配置变量
    // 子表外键编码
    let MyStaff_id = "youridHere";
    // 任职组织系统id
    let orgId = app.sysManagerOrg;
    // 部门后缀
    let admincode = "OrgAdmin";
    // 子实体在主实体中的名称
    let tablenamechildcode = "GxyCustomerOrgAdminList";
    // 主实体名称
    let stafftable = "GT1559AT25.GT1559AT25.GxyCustomerStaff";
    // 主子表编码
    let billNum = "7eb05366";
    // 获取所属主表信息
    let ownuid = app[MyStaff_id];
    let conditions = { id: ownuid };
    let res1 = ObjectStore.selectByMap(stafftable, conditions);
    let body = {
      externalData: {
        parentorgid: orgId,
        enable: ["1"]
      }
    };
    let uri = "/yonbip/digitalModel/admindept/tree";
    let baseurl = "https://www.example.com/";
    let url = baseurl + uri;
    let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let result = JSON.parse(apiResponse);
    let deptlist = result.data;
    let deptid = null;
    for (let i in deptlist) {
      let dept1 = deptlist[i];
      if (dept1.code.indexOf(admincode) > -1) {
        deptid = dept1.id;
      }
    }
    if (rdata._status === "Insert") {
      var ptJobList = [];
      ptJobList[0] = {
        org_id: orgId,
        dept_id: deptid,
        staff_id: res1[0].sysStaff,
        begindate: gettime(),
        _status: "Insert"
      };
      let sss = {
        _status: "Update",
        code: res1[0].code,
        enable: 1,
        id: res1[0].sysStaff,
        ptJobList: ptJobList,
        name: res1[0].name
      };
      var jsonstr = { data: sss };
      let staffSave = extrequire("GT34544AT7.staff.createStaff");
      request.body = jsonstr;
      let resStaffSave = staffSave.execute(request);
      res = resStaffSave.res.res;
      let targer = null;
      if (res.code === "999") {
        throw new Error("更新员工失败:" + res.message);
      }
      let pt = res.data.ptJobList;
      for (let i in pt) {
        let job = pt[i];
        if (job.org_id == orgId && job.dept_id == deptid && job.enddate == undefined) {
          targer = job.id;
          break;
        }
      }
      if (targer != null) {
        let pjobj = { id: app.id, sysJobId: targer, txtID: app.id, _status: "Update" };
        let nnobj = [];
        let nobj = { id: app.GxsStaffFk, _status: "Update" };
        nnobj.push(pjobj);
        nobj[tablenamechildcode] = nnobj;
        let nn = ObjectStore.updateById(stafftable, nobj, billNum);
      }
    }
    // 如果是停用状态就删除兼职信息
    else if (app.isEnable == 0) {
      let staffId = res1[0].sysStaff;
      let func1 = extrequire("GT34544AT7.staff.showStaffById");
      request.id = staffId;
      let ss = func1.execute(request);
      let accept = ss.res;
      let staffinfo = accept.data;
      if (!!staffinfo) {
        let ptJobList = staffinfo.ptJobList;
        let taget = null;
        for (let i = 0; i < ptJobList.length; i++) {
          let ptJob = ptJobList[i];
          if (ptJob.org_id === orgId && ptJob.dept_id === deptid && ptJob.enddate == undefined) {
            taget = ptJob;
            break;
          }
        }
        if (!!taget) {
          var ptJobList1 = [];
          ptJobList1[0] = {
            id: taget.id,
            staff_id: staffId,
            org_id: taget.org_id,
            dept_id: taget.dept_id,
            begindate: taget.begindate,
            enddate: app.disableDate,
            _status: "Update"
          };
          let sss = {
            _status: "Update",
            code: res1[0].code,
            enable: 1,
            id: staffId,
            ptJobList: ptJobList1,
            mobile: res1[0].mobile,
            name: res1[0].name
          };
          var jsonstr = { data: sss };
          let staffSave = extrequire("GT34544AT7.staff.createStaff");
          request.body = jsonstr;
          let resStaffSave = staffSave.execute(request);
          res = resStaffSave.res.res;
        }
      }
    }
    // 修改是否有管理员标记
    return {};
  }
}
exports({ entryPoint: MyTrigger });