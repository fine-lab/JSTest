let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.data[0]._status === null || param.data[0]._status === undefined) {
      throw new Error("无法判断页面状态，请找用友客服人员解决");
    }
    // 声明获取系统用户方法
    let getSysStaff = (staffid) => {
      let returnPromise = new cb.promise();
      cb.rest.invokeFunction("GT34544AT7.staff.showStaffById", { id: staffid }, function (err, res) {
        returnPromise.resolve(res);
        returnPromise.reject(err);
      });
      return returnPromise;
    };
    let request = {};
    // 获取数据
    let userId = param.data[0].userId;
    let id = param.data[0].staff_id;
    let mobile = param.data[0].userMobile;
    let email = param.data[0].userEmail;
    let code = mobile;
    let name = param.data[0].userName;
    //所有用户加入AllUser组织的Alluser_dept部门
    let funcd = extrequire("GT34544AT7.defaultconfig.getDefaultConfig");
    let resd = funcd.execute(request).res;
    let default_org = resd.default_sys_org;
    let default_dept = resd.default_sys_dept;
    let default_org_name = resd.default_sys_org_name;
    let default_dept_name = resd.default_sys_dept_name;
    let main_org_id = default_org;
    let dept_id = default_dept;
    let main_org_name = default_org_name;
    let dept_name = default_dept_name;
    let insert = param.data[0]._status === "Insert" ? true : false;
    // 通过手机或者邮箱判断用户是否存在租户
    let func1 = extrequire("GT34544AT7.ownUser.showOwnUserByTelOrEm");
    request.mobile = mobile;
    request.email = email;
    let res = func1.execute(request).res;
    // 假设不存在
    let userin = false;
    if (res.data !== undefined && res.data !== null) {
      // 用户存在
      userin = true;
    }
    let begindate = "";
    let staffid = userin ? res.data[0].staff_id : "";
    let staffCode = userin ? res.data[0].staff_code : "";
    let user_id = userin ? res.data[0].userId : "";
    if (userin && (res.data[0].userId === undefined || res.data[0].userId === null || res.data[0].userId === "")) {
      let staff_id = res.data[0].staff_id;
      getSysStaff(staff_id).then((res, err) => {
        let staffinfo = res.res.data;
        user_id = staffinfo.user_id;
        if (user_id === undefined || user_id === null || user_id === "") {
          if (staffinfo.enable === 0 || staffinfo.enable === 2) {
            //启用员工
            let eableBody = {
              body: {
                data: {
                  enable: 1,
                  id: staffid
                }
              }
            };
            let staffEnable = extrequire("GT34544AT7.staff.enableStaff");
            let resStaffEnable = staffEnable.execute(eableBody);
            let resEnableResult = resStaffEnable.res.res;
            if (resEnableResult.data === undefined || resEnableResult.data.user_id === undefined) {
              throw new Error(resEnableResult.message);
            }
            user_id += resEnableResult.data.user_id;
          } else {
            // 用户以启用但是没有同步员工
          }
        }
      });
    } else if (userin) {
      staffid += res.data[0].staff_id;
      staffCode += res.data[0].staff_code;
      // 判断员工是否启用
      getSysStaff(staffid).then((res, err) => {
        let staffinfo = res.res.data;
        let mainJob = staffinfo.mainJobList[0];
        main_org_id = mainJob.org_id;
        dept_id = mainJob.dept_id;
        main_org_name = mainJob.org_id_name;
        dept_name = mainJob.dept_id_name;
        // 员工未启用
        if (staffinfo.enable === 0 || staffinfo.enable === 2) {
          //启用员工
          let eableBody = {
            body: {
              data: {
                enable: 1,
                id: staffid
              }
            }
          };
          let staffEnable = extrequire("GT34544AT7.staff.enableStaff");
          let resStaffEnable = staffEnable.execute(eableBody);
          let resEnableResult = resStaffEnable.res.res;
          if (resEnableResult.data === undefined || resEnableResult.data.user_id === undefined) throw new Error(resEnableResult.message);
          user_id += resEnableResult.data.user_id;
        }
        //员工启用
        else {
          // 停用员工
          let disableBody = {
            body: {
              data: {
                enable: 2,
                id: staffid
              }
            }
          };
          let staffDisable = extrequire("GT34544AT7.staff.disableStaff");
          let resStaffDisable = staffDisable.execute(disableBody);
          let resDisableResult = resStaffDisable.res.res;
          // 启用员工
          let eableBody = {
            body: {
              data: {
                enable: 1,
                id: staffid
              }
            }
          };
          let staffEnable = extrequire("GT34544AT7.staff.enableStaff");
          let resStaffEnable = staffEnable.execute(eableBody);
          let resEnableResult = resStaffEnable.res.res;
          if (resEnableResult.data === undefined || resEnableResult.data.user_id === undefined) throw new Error(resEnableResult.message);
          user_id += resEnableResult.data.user_id;
        }
        //绑定用户身份
        let bindBody = {
          body: {
            staffCodeUserIdMap: {
              [staffCode]: user_id
            }
          }
        };
        let userBind = extrequire("GT34544AT7.staff.bindUserByStaffCode");
        let resUserBind = userBind.execute(bindBody).res;
      });
    } else {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      begindate += y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
      let body = {
        data: {
          id: insert ? null : id,
          code: code,
          name: name,
          mobile: mobile === undefined || mobile === null ? "" : mobile,
          email: email === undefined || email === null ? "" : email,
          _status: param.data[0]._status,
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
      let resStaffSave = staffSave.execute(request);
      let resStaffResult = resStaffSave.res.res;
      if (resStaffResult.data === undefined || resStaffResult.data.id === undefined) throw new Error(resStaffResult.message);
      staffid += resStaffResult.data.id;
      staffCode += resStaffResult.data.code;
      //启用员工
      let eableBody = {
        body: {
          data: {
            enable: 1,
            id: staffid
          }
        }
      };
      let staffEnable = extrequire("GT34544AT7.staff.enableStaff");
      let resStaffEnable = staffEnable.execute(eableBody);
      let resEnableResult = resStaffEnable.res.res;
      if (resEnableResult.data === undefined || resEnableResult.data.user_id === undefined) throw new Error(resEnableResult.message);
      user_id += resEnableResult.data.user_id;
      //绑定用户身份
      let bindBody = {
        body: {
          staffCodeUserIdMap: {
            [staffCode]: user_id
          }
        }
      };
      let userBind = extrequire("GT34544AT7.staff.bindUserByStaffCode");
      let resUserBind = userBind.execute(bindBody).res;
    }
    // 设置其他值
    param.data[0].set("userId", user_id);
    param.data[0].set("userName", name);
    param.data[0].set("staff_id", staffid);
    param.data[0].set("staff_code", staffCode);
    param.data[0].set("staff_org_id", main_org_id);
    param.data[0].set("staff_dept_id", dept_id);
    param.data[0].set("staff_begindate", begindate);
    param.data[0].set("staff_org_name", main_org_name);
    param.data[0].set("staff_dept_name", dept_name);
    return {};
  }
}
exports({ entryPoint: MyTrigger });