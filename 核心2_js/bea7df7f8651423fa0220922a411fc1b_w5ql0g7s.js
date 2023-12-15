let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let params = request.params;
    let cBill = request.cBill;
    let runerr = false;
    // 自定义档案id
    let id1 = "GL_discussionfundID";
    // 如果同步成功则添加实体的项目id
    if (params._status === undefined || params._status === null) {
      throw new Error("无法判断页面状态： _status=" + params._status);
    }
    // 通过args._status判断当前页面状态是insert还是update
    let insert = params._status !== undefined || params._status !== null ? (params._status === "Insert" ? true : false) : true;
    // 获取自定义档案配置id
    let funcx = extrequire("GT6948AT29.custom.getZDisfdMTBdocid");
    request = {};
    let resx = funcx.execute(request).res;
    let docId = resx.id;
    let result = svcustom(params);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", result.id);
    var res = ObjectStore.update("GT6948AT29.GT6948AT29.discussionfund_MTB", result, updateWrapper, cBill)[0];
    if (runerr) res.docId = docId;
    // 自定义档案和项目存储
    function svcustom(args) {
      let agsdata = args;
      if (agsdata.length !== 0) {
        let condition = args.fund_item_code;
        // 判断存储
        return savecosdoc(args, condition);
      } else return args;
    }
    function savecosdoc(args, condition) {
      let code = args.code;
      let name = args.name;
      let orgid = args.org_id;
      let orgid_name = args.org_id_name;
      let body = {
        data: {
          orgid_name: orgid_name,
          orgid: orgid,
          code: code,
          name: name,
          custdocdefid: docId,
          dr: 0,
          enable: args._status === "Insert" ? 1 : args.enable !== undefined ? (args.enable === 0 || args.enable === "0" ? 2 : args.enable) : 1,
          _status: args._status
        }
      };
      // 如果不是Insert状态就是Update状态就需要添加id
      if (!insert) body.data.id = args[id1];
      // 通过工作经费判断自定义档案数据是否要添加description
      if (condition !== "A1" && condition !== undefined && condition !== null && condition !== "") {
        let description = args.org_id + "," + args.fund_usedirection;
        body.data.description = description;
      }
      // 插入自定义档案api
      let func2 = extrequire("GT6948AT29.custom.insertCustomCnfData");
      request.docId = docId;
      request.body = body;
      let res2 = func2.execute(request).res;
      // 是否插入成功
      if (res2.code !== "200") {
        runerr = true;
        return args;
      }
      // 如果同步成功则添加实体的自定义档案id：GL_discussionfundID的值
      else {
        let id = res2.data.id;
        args[id1] = id;
        args.ToCustomFile = "1";
      }
      return args;
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });