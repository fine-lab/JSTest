let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = {};
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
    // 员工id,新组织id,新部门code
    var { staff_id, org_id, admincode } = request;
    var body = {
      externalData: {
        parentorgid: org_id,
        enable: ["1"]
      }
    };
    // 查找下面的区域管理部门
    let uri = "/yonbip/digitalModel/admindept/tree";
    let baseurl = "https://www.example.com/";
    let url = baseurl + uri;
    let apiResponse = openLinker("POST", url, "GT53685AT3", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    let result = JSON.parse(apiResponse);
    let deptlist = result.data;
    let dept_id = null;
    var deptinfo = {};
    for (let i in deptlist) {
      let dept1 = deptlist[i];
      if (dept1.code.indexOf(admincode) > -1) {
        deptinfo = dept1;
        dept_id = dept1.id;
      }
    }
    if (dept_id == null) {
      throw new Error("找不到" + admincode + "部门");
    } else {
    }
    // 查找员工信息
    let func1 = extrequire("GT34544AT7.staff.showStaffById");
    request.id = staff_id;
    let ss = func1.execute(request);
    let accept = ss.res;
    let staffinfo = accept.data;
    // 获取主兼职信息
    var { mainJobList, ptJobList } = staffinfo;
    // 查找兼职里面是否有需要任主任职的信息，有就修改结束时间
    if (!!ptJobList) {
      let taget = null;
      for (let i = 0; i < ptJobList.length; i++) {
        let ptJob = ptJobList[i];
        if (ptJob.org_id === org_id && ptJob.dept_id === dept_id && ptJob.enddate == undefined) {
          taget = ptJob;
          break;
        }
      }
      if (!!taget) {
        var ptJobList1 = [];
        ptJobList1[0] = {
          id: taget.id,
          staff_id: staff_id,
          org_id: taget.org_id,
          dept_id: taget.dept_id,
          begindate: taget.begindate,
          enddate: getdate(),
          _status: "Update"
        };
        let sss = {
          _status: "Update",
          code: staffinfo.code,
          enable: 1,
          id: staff_id,
          ptJobList: ptJobList1,
          mobile: staffinfo.mobile,
          name: staffinfo.name
        };
        var jsonstr = { data: sss };
        let staffSave = extrequire("GT34544AT7.staff.createStaff");
        request.body = jsonstr;
        let resStaffSave = staffSave.execute(request);
        res = resStaffSave.res.res;
      }
    }
    // 主任职切换
    if (!!mainJobList) {
      let taget = null;
      for (let i = 0; i < mainJobList.length; i++) {
        let mainJob = mainJobList[i];
        if (mainJob.enddate == undefined && mainJob.org_id !== org_id && mainJob.dept_id !== dept_id) {
          taget = mainJob;
          break;
        }
      }
      if (!!taget) {
        var mainJobList1 = [];
        mainJobList1[0] = {
          id: taget.id,
          staff_id: staff_id,
          org_id: taget.org_id,
          dept_id: taget.dept_id,
          begindate: taget.begindate,
          enddate: getdate(),
          _status: "Update"
        };
        mainJobList1[1] = {
          org_id: org_id,
          dept_id: dept_id,
          staff_id: staff_id,
          begindate: getdate(),
          _status: "Insert"
        };
        let sss = {
          _status: "Update",
          code: staffinfo.code,
          enable: 1,
          id: staff_id,
          mainJobList: mainJobList1,
          mobile: staffinfo.mobile,
          name: staffinfo.name
        };
        var jsonstr = { data: sss };
        let staffSave = extrequire("GT34544AT7.staff.createStaff");
        request.body = jsonstr;
        let resStaffSave = staffSave.execute(request);
        res = resStaffSave.res.res;
      }
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });