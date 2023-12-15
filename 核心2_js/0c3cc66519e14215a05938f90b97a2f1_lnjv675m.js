let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let res = [];
    // 搜索满足条件的组织
    let searchOrg = (data) => {
      let targetOrg = null;
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== undefined && data[i] !== null) {
          if (data[i].id === sys_parent) {
            targetOrg = data[i];
            break;
          } else {
            let childs = data[i].children;
            if (childs !== undefined && childs !== null) {
              targetOrg = searchOrg(childs);
              if (targetOrg !== null) {
                break;
              }
            }
          }
        }
      }
      return targetOrg;
    };
    let saveTreeId = (data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== undefined && data[i] !== null) {
          let id = data[i].id;
          if (!includes(res, id)) res.push(id);
          // 如果res里面不包含就加入res
          let childs = data[i].children;
          if (childs !== undefined && childs !== null) {
            saveTreeId(childs);
          }
        }
      }
    };
    // 获取当前用户和租户id
    let func1 = extrequire("GT39696AT9.user.getAppContext");
    let res1 = func1.execute(request).res;
    let context = res1.currentUser;
    let userId = context.id;
    let tenantId = context.tenantId;
    // 获取当前用户员工信息
    let func2 = extrequire("GT39696AT9.staff.showStaffByUserId");
    request.id = userId;
    let res2 = func2.execute(request).res;
    if (res2.data.status === 0) {
      throw new Error("当前用户未绑定员工");
    }
    let staffId = res2.data.data[0].id;
    let staffCode = res2.data.data[0].code;
    // 获取员工详细信息
    let func3 = extrequire("GT39696AT9.staff.showStaffInfoByIdCd");
    request.id = staffId;
    request.code = staffCode;
    let res3 = func3.execute(request).res;
    // 获取员工兼职列表和主职信息;
    let mainJobList = res3.data.mainJobList;
    let ptJobList = res3.data.ptJobList;
    let mainJob = mainJobList[0];
    // 获取所有启用组织
    let condition = {
      enable: 1
    };
    let func7 = extrequire("GT39696AT9.org.showOrgTreeByCod");
    request.condition = condition;
    let res7 = func7.execute(request).res;
    let treeRoot = res7.data;
    // 获取员工主职业务单元和部门
    let org_id = mainJob.org_id;
    let dept_id = mainJob.dept_id;
    // 获取员工所在主职部门单位的详情;
    let func4 = extrequire("GT39696AT9.org.showOrgInfoById");
    request.id = org_id;
    let res4 = func4.execute(request).res;
    let org_code = res4.data.code;
    let sys_parent = res4.data.parent;
    if (sys_parent === undefined || sys_parent === null || sys_parent === "") {
      throw new Error("该人员属于顶级组织");
    }
    // 搜索这个org_id下的自建组织表判断是否同步，是否是区域管理员所在
    let func5 = extrequire("GT34544AT7.ownOrg.searchOOBySOId");
    request.id = sys_parent;
    let res5 = func5.execute(request).res;
    if (res5.length === 0) {
      throw new Error("该组织未同步无法得之是否是区域管理组织");
    } else {
      let ownOrg = res5[0];
      let cc = ownOrg.sys_code;
      let cclast = "";
      if (!(cc === undefined || cc === null || cc === "")) {
        cclast = cc.charAt(cc.length - 1);
      }
      if (!(ownOrg.is_area_org1 === 1 || ownOrg.is_area_org1 === "1" || ownOrg.is_area_org1 === true || ownOrg.is_area_org1 === "true" || ownOrg.is_area_org1 === "是")) {
        if (cclast === "P") {
          throw new Error("该组织P结尾但未改变其是否管理员所在标签");
        }
        throw new Error("该组织不是区域管理组织");
      }
    }
    // 获取所需要的poj
    let trt = searchOrg(treeRoot);
    let tree = [trt];
    saveTreeId(tree);
    return { res: res, sys_parent: sys_parent };
  }
}
exports({ entryPoint: MyAPIHandler });