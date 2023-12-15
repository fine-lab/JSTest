let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户绑定的员工
    let staffOfCurrentUser = {};
    let orgId = request.orgId;
    //获取当前用户的身份信息-----------
    let currentUser = JSON.parse(AppContext()).currentUser; //通过上下文获取当前的用户信息
    //查询员工基本信息
    let sql = "select id,code,name, deptId, deptId.code deptCode, deptId.name deptName from hred.staff.Staff where userId = '" + currentUser.id + "'";
    let staffInfo = ObjectStore.queryByYonQL(sql, "hrcloud-staff-mgr");
    //查询员工组织信息
    if (staffInfo.length > 0) {
      let orgSql = "select orgId,orgId.code orgCode, orgId.name orgName from hred.staff.StaffOrgRel where staffId = '" + staffInfo[0].id + "' and endFlag = '0' ";
      let staffOrgInfo = ObjectStore.queryByYonQL(orgSql, "hrcloud-staff-mgr");
      if (staffOrgInfo.length > 0 && staffOrgInfo[0].orgId == orgId) {
        staffInfo[0].orgId = staffOrgInfo[0].orgId;
        staffInfo[0].orgCode = staffOrgInfo[0].orgCode;
        staffInfo[0].orgName = staffOrgInfo[0].orgName;
      }
      staffOfCurrentUser = staffInfo[0];
    }
    for (let key in request) {
      if (request[key] != undefined) {
        request[key] = request[key].toString();
      }
    }
    let map = {
      1: {
        table: "GT22176AT10.GT22176AT10.sy01_limitPurProducts",
        errorInfo: "限制采购,请核对限采表"
      },
      2: {
        table: "GT22176AT10.GT22176AT10.sy01_limitSaleProducts",
        errorInfo: "限制销售,请核对限销表"
      }
    };
    let yonql =
      "select product,sku,sy01_specialDrugCfg_id.staff staff from " +
      map[request.type]["table"] +
      " where product = '" +
      request.productId +
      "' and sy01_specialDrugCfg_id.org_id = '" +
      request.orgId +
      "' and dr = 0";
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    if (res.length == 0) {
      return { info: "" };
    }
    let operator = request.operator;
    //查询到专人购销数据，那么业务员必填
    if (operator == undefined && request.type == 1) {
      return { info: "请录入采购员!\n\r" };
    }
    //查询到专人购销数据，那么业务员必填
    if (operator == undefined && request.type == 2) {
      return { info: "请录入销售业务员!\n\r" };
    }
    if (staffOfCurrentUser.id != operator) {
      return { info: "第" + request.rowno + "行药品【" + request.productName + "】限销限采，当前用户关联员工与单据中业务员不一致。\n\r" };
    }
    operator = operator.toString();
    let productMap = new Map();
    for (let i = 0; i < res.length; i++) {
      let obj = {
        product: res[i].product.toString(),
        sku: res[i].sku == undefined ? "" : res[i].sku.toString()
      };
      obj = JSON.stringify(obj);
      if (!productMap.has(obj)) {
        productMap.set(obj, []);
      }
      productMap.get(obj).push(res[i].staff.toString());
    }
    //如果传参没有sku
    if (request.productsku == undefined) {
      //先判断有无进行非sku购销控制
      let obj = {
        product: request.productId.toString(),
        sku: ""
      };
      obj = JSON.stringify(obj);
      let flag = true;
      //如果对非sku进行了相关设置，且专人中没有此业务员，那么报错
      if (productMap.has(obj) && productMap.get(obj).indexOf(operator) == -1) {
        flag = false;
      }
      //也存在一种可能，productMap中存在sku级别，那么理论上，只要存在sku级别，无论有没有进行相关，都得报错
      for (let key of productMap.keys()) {
        if (JSON.parse(key).sku != "") {
          flag = false;
          break;
        }
      }
      if (!flag) {
        return { info: "第" + request.rowno + "行药品【" + request.productName + "】" + map[request.type]["errorInfo"] + "。\n\r" };
      }
    }
    //传sku的情况，那么无需flag，有符合条件即可
    if (request.productsku != undefined) {
      let obj1 = {
        product: request.productId.toString(),
        sku: ""
      };
      obj1 = JSON.stringify(obj1);
      let obj2 = {
        product: request.productId.toString(),
        sku: request.productsku.toString()
      };
      obj2 = JSON.stringify(obj2);
      //如果存在非sku维度
      if (productMap.has(obj1)) {
        //业务员匹配，即可
        if (productMap.get(obj1).indexOf(operator) != -1) {
          return { info: "" };
        } else {
          //业务员不匹配，那么sku维度必须要有
          if (productMap.has(obj2) && productMap.get(obj2).indexOf(operator) != -1) {
            return { info: "" };
          }
        }
      } else {
        //如果两种都没有，或者sku维度有
        if (!productMap.has(obj2) || (productMap.has(obj2) && productMap.get(obj2).indexOf(operator) != -1)) {
          return { info: "" };
        }
      }
      return { info: "第" + request.rowno + "行药品【" + request.productName + "】" + map[request.type]["errorInfo"] + "。\n\r" };
    }
    return { info: "" };
  }
}
exports({ entryPoint: MyAPIHandler });