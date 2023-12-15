let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let request = {};
    // 获取数据
    let userId = param.data[0].userId;
    let id = param.data[0].staff_id;
    let mobile = param.data[0].userMobile;
    let email = param.data[0].userEmail;
    let code = param.data[0].staff_code;
    let name = param.data[0].userName;
    //所有用户加入AllUser组织的Alluser_dept部门
    let main_org_id = "youridHere";
    let dept_id = "youridHere";
    let main_org_name = "租户用户";
    let dept_name = "用户主职部门";
    let insert = userId === undefined || userId === null ? true : false;
    // 通过手机或者邮箱判断用户是否存在租户
    let func1 = extrequire("GT34544AT7.staff.searchStaffByTel");
    request.mobile = mobile;
    request.email = email;
    let res = func1.execute(request).res;
    // 假设不存在
    let userin = false;
    if (res.data.length > 0) {
      // 用户存在
      userin = true;
    }
    // 判断自有表中是否有数据
    if ((mobile !== null && mobile !== undefined) || (email !== null && email !== undefined)) {
      if (insert) {
        let func5 = extrequire("GT34544AT7.ownUser.searchOUByTelOrEmail");
        let res5 = func5.execute(request);
        if (res5.arr.length > 0) {
          throw new Error("用户已经存在于自建表中");
        }
      }
    }
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d = date.getDate();
    d = d < 10 ? "0" + d : d;
    let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    let begindate = y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    if (!userin) {
      let body = {
        data: {
          id: insert ? null : id,
          code: code,
          name: name,
          mobile: mobile === undefined || mobile === null ? "" : mobile,
          email: email === undefined || email === null ? "" : email,
          _status: insert ? "Insert" : "Update",
          enable: 0,
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
      staffid = resStaffResult.data.id;
      staffCode = resStaffResult.data.code;
    }
    //启用员工
    let eableBody = {
      body: {
        data: {
          enable: 1,
          id: userin ? res.data[0].id : staffid
        }
      }
    };
    let staffEnable = extrequire("GT34544AT7.staff.enableStaff");
    let resStaffEnable = staffEnable.execute(eableBody);
    let resEnableResult = resStaffEnable.res.res;
    if (resEnableResult.data === undefined || resEnableResult.data.user_id === undefined) throw new Error(resEnableResult.message);
    let user_id = resEnableResult.data.user_id;
    //绑定用户身份
    let bindBody = {
      body: {
        staffCodeUserIdMap: {
          [userin ? res.data[0].code : staffCode]: user_id
        }
      }
    };
    let userBind = extrequire("GT34544AT7.staff.bindUserByStaffCode");
    let resUserBind = userBind.execute(bindBody);
    // 用户id查询用户详细信息
    let func2 = extrequire("GT34544AT7.user.searchUserInfoByUid");
    request.id = user_id;
    let res2 = func2.execute(request).res;
    let userinfo = res2.data[0];
    // 设置其他值
    parm.data[0].set("userId", userinfo["userId"]);
    parm.data[0].set("userCode", userinfo["userCode"]);
    parm.data[0].set("userName", userinfo["userName"]);
    parm.data[0].set("userActivate", userinfo["userActivate"]);
    parm.data[0].set("userAvatorNew", userinfo["userAvatorNew"]);
    parm.data[0].set("userBigAvatorNew", userinfo["userBigAvatorNew"]);
    parm.data[0].set("userSmallAvatorNew", userinfo["userSmallAvatorNew"]);
    parm.data[0].set("sysId", userinfo["sysId"]);
    parm.data[0].set("registerDate", begindate);
    parm.data[0].set("staff_id", userin ? res.data[0].id : staffid);
    parm.data[0].set("staff_code", userin ? res.data[0].code : code);
    parm.data[0].set("staff_org_id", userin ? res.data[0].mainjobinfo[0].org_id : main_org_id);
    parm.data[0].set("staff_dept_id", userin ? res.data[0].mainjobinfo[0].dept_id : dept_id);
    parm.data[0].set("staff_begindate", userin ? res.data[0].mainjobinfo[0].begindate : begindate);
    if (userin) {
      // 组织id查询组织姓名
      let func3 = extrequire("GT34544AT7.org.orgSearch");
      request.id = res.data[0].mainjobinfo[0].org_id;
      let res3 = func3.execute(request).res;
      org_name = res3.data.name;
      // 部门id查询组织姓名
      let func4 = extrequire("GT34544AT7.org.orgSearch");
      request.id = res.data[0].mainjobinfo[0].dept_id;
      let res4 = func4.execute(request).res;
      dept_name = res4.data.name;
    }
    parm.data[0].set("staff_org_name", userin ? org_name : main_org_name);
    parm.data[0].set("staff_dept_name", userin ? dept_name : dept_name);
    // 授权获取关联自建组织id
    // 获取系统组织id和code
    let own_org_code = parm.data[0]["item198eb"];
    let own_org_id = parm.data[0]["item104yb"];
    // 获取当前操作用户信息
    let c_user_id = JSON.parse(AppContext()).currentUser.id;
    let func7 = extrequire("GT34544AT7.ownUser.searchOUBySUid");
    request.id = c_user_id;
    let res7 = func7.execute(request).res;
    let c_own_uid = res7.id;
    // 获取当前操作者身份
    // 查询管理区域
    let func8 = extrequire("GT34544AT7.ownUser.searchAreaAdminInfo");
    request.id = c_own_uid;
    request.areaId = own_org_id;
    let res8 = func8.execute(request).arr;
    if (arr.length > 0) {
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });