let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = null;
    let app = request.object;
    function getdate() {
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
      var begindate = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
      return begindate;
    }
    // 配置变量
    let orgId = app.sysManagerOrg;
    let admincode = "OrgAdmin";
    let gxsorgId = app.managerOrg;
    let haveAdmin = "isOrgManager";
    let tablenamechildcode = "gxsOrgAdminList";
    let stafftable = "GT34544AT7.GT34544AT7.GxsStaff";
    let billNum = "65e9a2e2";
    let ownuid = app.GxsStaffFk;
    let request = { id: ownuid };
    let func1 = extrequire("GT34544AT7.GxsStaff.getGxsStaffById");
    let res1 = func1.execute(request).res;
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
    let rdata = JSON.parse(param.requestData);
    if (rdata._status === "Insert") {
      var ptJobList = [];
      ptJobList[0] = {
        org_id: orgId,
        dept_id: deptid,
        staff_id: res1[0].sysStaff,
        begindate: getdate(),
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
      // 更新子表
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
    var object = { id: gxsorgId, [haveAdmin]: app.isEnable };
    ObjectStore.updateById("GT34544AT7.GT34544AT7.GxsOrg", object, "f25b5dba");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });