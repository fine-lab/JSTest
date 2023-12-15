let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let res = [];
    var userres = AppContext();
    let orgid = JSON.parse(userres).currentUser.orgId; //当前用户主任职ID。
    //根据当前用户主任职ID，查询系统业务单元
    let func1 = extrequire("GT39696AT9.common.baseOpenApiGet");
    request = {};
    request.parm = {};
    request.parm.id = orgid;
    request.uri = "/yonbip/digitalModel/orgunit/detail";
    let orgres = func1.execute(request).res;
    if (orgres.code == "200") {
      let orgCode = orgres.data.code;
      var isP = includes(orgCode, "P");
      if (isP) {
        res.push(orgres.data.parent);
        request = {};
        request.uri = "/yonbip/digitalModel/queryChildrenOrgInfos";
        request.body = { funcType: "adminorg", id: orgres.data.parent };
        let Orgfunc = extrequire("GT34544AT7.common.baseOpenApi");
        let Orgfuncres = Orgfunc.execute(request).res;
        if ((Orgfuncres.code = "200")) {
          let orgArr = Orgfuncres.data;
          if (orgArr.length > 0) {
            for (let j = 0; j < orgArr.length; j++) {
              if (orgArr[j].is_biz_unit == 1 && orgArr[j].enable == 1) {
                res.push(orgArr[j].id);
              }
            }
          }
        } else {
          res.push("99999999999999999999999999999999999");
          throw new Error("查询下级节点时出错\n" + res.message);
        }
      } else {
        //如果不是P节点
        res.push("99999999999999999999999999999999999");
      }
    } else {
      throw new Error("查询主任职是出错\n" + res.message);
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });