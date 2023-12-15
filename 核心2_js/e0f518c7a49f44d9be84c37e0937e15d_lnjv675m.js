let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgs = [];
    let ptorgs = [];
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
    let func1 = extrequire("GT39696AT9.user.getAppContext");
    let res1 = func1.execute(request).res;
    let context = res1.currentUser;
    let userId = context.id;
    let tenantId = context.tenantId;
    // 获取当前用户员工信息
    let func2 = extrequire("GT39696AT9.staff.showStaffByUserId");
    request.id = userId;
    let x1 = func2.execute(request);
    let res2 = x1.res;
    if (res2.data.status === "0") {
      throw new Error("当前用户未绑定员工");
    }
    let staffId = res2.data.data[0].id;
    let staffCode = res2.data.data[0].code;
    // 获取员工详细信息
    let func3 = extrequire("GT39696AT9.staff.showStaffInfoByIdCd");
    request.id = staffId;
    request.code = staffCode;
    let x = func3.execute(request);
    let res3 = x.res;
    // 获取员工兼职列表和主职信息;
    let mainJobList = res3.data.mainJobList;
    let ptJobList = res3.data.ptJobList;
    let mainJob = mainJobList[0];
    main_org_id = mainJob.org_id;
    main_dept_id = mainJob.dept_id;
    if (ptJobList === undefined || ptJobList === null || ptJobList.length === 0) {
    } else {
      // 获取所有启用组织
      let condition = {
        enable: 1
      };
      let func7 = extrequire("GT39696AT9.org.showOrgTreeByCod");
      request.condition = condition;
      let res7 = func7.execute(request).res;
      let treeRoot = res7.data;
      for (let i = 0; i < ptJobList.length; i++) {
        let ptJob = ptJobList[i];
        // 获取员工主职业务单元和部门
        let org_id = ptJob.org_id;
        let dept_id = ptJob.dept_id;
        if (!includes(ptorgs, org_id)) ptorgs.push(org_id);
        if (!includes(ptorgs, dept_id)) ptorgs.push(dept_id);
        // 获取员工所在主职部门单位的详情;
        // 搜索这个org_id下的自建组织表判断是否同步，是否是区域管理员所在
        // 获取所需要的poj
        let trt = searchOrg(treeRoot, org_id);
        let tree = [trt];
        saveTreeId(tree);
      }
    }
    return { orgs: orgs, ptorgs: ptorgs };
  }
}
exports({ entryPoint: MyAPIHandler });