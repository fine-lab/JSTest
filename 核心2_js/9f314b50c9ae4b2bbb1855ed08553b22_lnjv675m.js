let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var user = JSON.parse(AppContext());
    var userinfo = user.currentUser;
    function log(msg) {
      console.log(msg);
    }
    let body = {
      data: {
        parent: request.par,
        parentorgid: request.par,
        code: request.code,
        enable: !!request.enable ? request.enable : 1,
        name: {
          zh_CN: request.name
        },
        isEnd: 1,
        sysid: "youridHere",
        orgtype: 2,
        _status: request._status
      }
    };
    if (!!request.parentorgid) {
      body.data.parentorgid = request.parentorgid;
    }
    if (!!request.define3) {
      body.data["deptdefinefeature"] = { attrext25: request.define3 };
    }
    if (!!request.shortname && request.shortname !== undefined) {
      body.data.shortname = request.shortname;
    }
    if (!!request.principal) {
      body.data.principal = request.principal;
    }
    if (!!request.branchleader) {
      body.data.branchleader = request.branchleader;
    }
    // 判断是否是组织型部门，组织型部门为1，非组织型部门为0
    let is_unit_dept = 1;
    if (request._status === "Update") {
      body.data.innercode = request.innercode;
      body.data.id = request.id;
      if (!body.data.innercode) {
        let apiget = extrequire("GT34544AT7.common.baseOpenApiGet");
        var req1 = {
          uri: "/yonbip/digitalModel/admindept/detail",
          parm: { id: request.id }
        };
        let deptdeal = apiget.execute(req1).res;
        log("GT34544AT7.dept.deptInsert 搜索到部门详情");
        log(deptdeal);
        body.data.innercode = deptdeal.data.innercode;
      }
    }
    log("GT34544AT7.dept.deptInsert 再次更新data");
    log(body);
    let func1 = extrequire("GT34544AT7.common.baseOpenApi");
    request.body = body;
    request.uri = "/yonbip/digitalModel/admindept/save";
    let res1 = func1.execute(request);
    var resx = res1.res;
    let ndept = resx.data;
    log("GT34544AT7.dept.deptInsert 保存到部门详情");
    if (!!resx.code && (resx.code == "999" || resx.code == 999)) {
      let url = "https://www.example.com/";
      let body3 = {
        data: {
          code: [request.code]
        }
      };
      let apiResponse3 = openLinker("POST", url, "GT53685AT3", JSON.stringify(body3));
      let r3 = JSON.parse(apiResponse3);
      if (r3.data.length > 0) {
        ndept = r3.data[0];
      }
      log("找到这个部门");
      log(ndept);
    }
    if (!ndept) {
      if (res1.res.message.indexOf("组织型部门") > -1) {
        log("GT34544AT7.dept.deptInsert 遇到组织型部门");
        is_unit_dept = 1;
        let currentUser = JSON.parse(AppContext()).currentUser;
        let tenantId = currentUser.tenantId;
        request.uri = "/yonbip/digitalModel/orgunit/save";
        delete body.data["parentorgid"];
        delete body.data["innercode"];
        (body.data["exchangerate"] = tenantId),
          (body.data["exchangerate_name"] = "基准汇率"),
          (body.data["adminOrg"] = {
            enable: body.data["enable"]
          });
        body["externalData"] = {
          typelist: ["adminorg"]
        };
        if (request._status !== undefined && request._status !== null) {
          if (request._status === "Update") {
            body.data["id"] = request.id;
            body.data.adminOrg = { enable: "1", id: request.id };
          } else if (request._status === "Insert") {
            body.data.adminOrg = { enable: "1" };
          }
        }
        if (request.par !== undefined && request.par !== null) {
          body.data.parent = request.par;
          body.data.adminOrg.parentid = request.par;
          body.data.adminOrg.parentorgid = request.par;
        }
        request.body = body;
        request.uri = "/yonbip/digitalModel/orgunit/save";
        let orgdeptfunc = func1.execute(request);
        ndept = orgdeptfunc.res.data;
        log("GT34544AT7.dept.deptInsert 组织型部门再次更新");
        log(ndept);
      } else {
        let funcdept = extrequire("GT34544AT7.common.baseOpenApi");
        request.body = {
          data: {
            code: [request.code]
          }
        };
        request.uri = "/yonbip/digitalModel/basedoc/dept/list";
        var rr = funcdept.execute(request).res;
        if (rr.data.length > 0) {
          ndept = rr.data[0];
        } else {
          throw new Error(
            JSON.stringify(body.data) + "\n组织没有人力资源职能部门,无法创建下级部门\n" + JSON.stringify(res1) + "\n搜索输入值:" + JSON.stringify(request.body) + "\n搜索返回值:" + JSON.stringify(rr)
          );
        }
      }
    }
    // 如果是非组织型部门就更新一下path
    var res = ndept;
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });