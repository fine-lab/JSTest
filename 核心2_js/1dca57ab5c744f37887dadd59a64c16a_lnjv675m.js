let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { yhtUserId, serviceCode } = request;
    let funcquerymain = extrequire("GT9912AT31.auth.queryMainOrgs");
    if (serviceCode == null || serviceCode == undefined) {
      serviceCode = "1744445540608245764";
    }
    let tenantId = "yourIdHere";
    let quest = {
      yhtUserId,
      serviceCode,
      tenantId
    };
    let orgResult = funcquerymain.execute(quest).res;
    let { data } = orgResult;
    let authorgs = data;
    let neworgs = [];
    if (authorgs.length > 0) {
      let func = extrequire("GT9912AT31.org.searchParentOrgs");
      let result = func.execute({ ids: authorgs }).res;
      if (result.code == "999") {
        return result;
      }
      // 每个权限组织的上级
      let forgs = result.data;
      // 有的话就寻找到有权限的顶级节点
      // 如果顶级节点有权限但是没有在数组里面,就造一个节点放到数组里面
      // 如果顶级节点有权限并且已经在数组里面了,就沿着顶级依次创建下级
      // 创建下级的时候要判断是否已经有这个下级，如果有了就按照顺序一级一级查询，一直到没有这个组织才创建
      let keys = Object.keys(forgs);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let father = forgs[key];
        // 寻找上下级权限组
        let orgindex = searchTopArrOrg(father, authorgs);
        let indexs = orgindex.index;
        let orgxs = orgindex.org;
        for (let j = 0; j < orgxs.length; j++) {
          let orgarr = orgxs[j];
          let orgindexarr = indexs[j];
          // 获取头结点
          let numorgindex = getObj(orgarr[0].id);
          // 如果没有头节点
          if (numorgindex == null) {
            let obj = orgarr[0];
            neworgs.push(obj);
          } else {
            let { org, index } = numorgindex;
            let root = orgAddChild(org, orgarr);
            neworgs.splice(index, 1, root);
          }
        }
      }
    }
    // 添加节点
    function orgAddChild(root, orgs) {
      if (orgs.length == 1) return root;
      else {
        let pointer = root;
        for (let i = 1; i < orgs.length; i++) {
          let org = orgs[i];
          if (!pointer.children) {
            pointer.children = [org];
            pointer = org;
          } else {
            let children = pointer.children;
            let have = false;
            for (let j in children) {
              let child = children[j];
              if (child.id == org.id) {
                have = true;
                pointer = child;
                break;
              }
            }
            // 如果没有找到
            if (!have) {
              pointer.children.push(org);
              pointer = org;
            }
          }
        }
      }
      return root;
    }
    // 获取联系在一起的权限组
    function searchTopArrOrg(orgparients, orgs) {
      let lianxu = false;
      // 完整对象
      let arrorg = [];
      // 仅对象id
      let arrorgindex = [];
      for (let i = 0; i < orgparients.length; i++) {
        let org = orgparients[i];
        let id = org.id;
        // 如果有这个权限
        // 必须使用主组织权限Orgs来判断
        // 主组织权限上级forgs包含有顶级节点不满足不需要顶级条件的需求
        if (orgs.indexOf(id) > -1) {
          if (!lianxu) {
            lianxu = true;
            let arr = [org];
            arrorg.push(arr);
            arrorgindex.push([i]);
          } else {
            let size = arrorg.length;
            let last = size - 1;
            arrorg[last].push(org);
            arrorgindex[last].push(i);
          }
        } else {
          if (lianxu) {
            lianxu = false;
          }
        }
      }
      let orgindex = {
        org: arrorg,
        index: arrorgindex
      };
      return orgindex;
    }
    // 找到数据里面的节点
    function getObj(id) {
      for (let i in neworgs) {
        let org = neworgs[i];
        if (org.id == id) {
          return { org, index: i };
        }
      }
      return null;
    }
    return { data: neworgs };
  }
}
exports({ entryPoint: MyAPIHandler });