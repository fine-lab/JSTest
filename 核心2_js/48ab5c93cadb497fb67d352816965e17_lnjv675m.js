let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgs = [];
    let ptorgs = [];
    let ptdepts = [];
    let main_org_id = null;
    let main_dept_id = null;
    // 搜索满足条件的组织
    let searchOrg = (data, sys_id) => {
      let targetOrg = null;
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== undefined && data[i] !== null) {
          if (data[i].id === sys_id) {
            targetOrg = data[i];
            break;
          } else {
            let childs = data[i].children;
            if (childs !== undefined && childs !== null) {
              targetOrg = searchOrg(childs, sys_id);
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
          if (id !== main_org_id && id !== main_dept_id) {
            if (!includes(orgs, id)) orgs.push(id);
          }
          // 如果res里面不包含就加入res
          let childs = data[i].children;
          if (childs !== undefined && childs !== null) {
            saveTreeId(childs);
          }
        }
      }
    };
    // 获取当前用户和租户id
    let func1 = extrequire("GT34544AT7.user.getAppContext");
    let res1 = func1.execute(request).res;
    let context = res1.currentUser;
    let userId = context.id;
    let tenantId = context.tenantId;
    let staffId = context.staffId;
    // 获取当前用户员工信息
    // 获取员工详细信息
    let func3 = extrequire("GT34544AT7.staff.showStaffInfoByIdCd");
    request.id = staffId;
    let res3 = func3.execute(request).res;
    // 获取员工兼职列表和主职信息;
    let mainJobList = res3.data.mainJobList;
    let ptJobList = res3.data.ptJobList;
    let mainJob = mainJobList[0];
    main_org_id = mainJob.org_id;
    main_dept_id = mainJob.dept_id;
    if (ptJobList === undefined || ptJobList === null || ptJobList.length === 0) {
      throw new Error("当前用户没有兼职信息");
    } else {
      // 获取所有启用组织
      let condition = {
        enable: 1
      };
      let func7 = extrequire("GT34544AT7.org.showOrgTreeByCod");
      request.condition = condition;
      let res7 = func7.execute(request).res;
      let treeRoot = res7.data;
      for (let i = 0; i < ptJobList.length; i++) {
        let ptJob = ptJobList[i];
        // 获取员工主职业务单元和部门
        let org_id = ptJob.org_id;
        let dept_id = ptJob.dept_id;
        if (!includes(ptorgs, org_id)) ptorgs.push(org_id);
        if (!includes(ptdepts, dept_id)) ptdepts.push(dept_id);
        // 获取员工所在主职部门单位的详情;
        let func4 = extrequire("GT34544AT7.org.showOrgInfoById");
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
        }
        // 获取所需要的poj
        let trt = searchOrg(treeRoot, sys_parent);
        let tree = [trt];
        saveTreeId(tree);
      }
    }
    return { orgs: orgs, ptorgs: ptorgs, ptdepts: ptdepts };
  }
}
exports({ entryPoint: MyAPIHandler });