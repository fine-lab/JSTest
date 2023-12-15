let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let params = request.params;
    let cBill = request.cBill;
    let runerr = false;
    if (params._status === undefined || params._status === null) {
      throw new Error("无法判断页面状态： _status=" + params._status);
    }
    let funcx = extrequire("GT6948AT29.custom.getZFund_MTB_docid");
    request = {};
    let resx = funcx.execute(request).res;
    let docId = resx.id;
    // 获取自定义档案系统id
    let ids = params.GL_fundID;
    function savecosdoc(args, condition) {
      // 通过args._status判断当前页面状态是insert还是update
      let insert = args._status !== undefined || args._status !== null ? (args._status === "Insert" ? true : false) : true;
      let code = args.code;
      let name = args.name;
      let orgid = args.org_id;
      let orgid_name = args.org_id_name;
      let id = ids;
      let body = {
        data: {
          orgid_name: orgid_name,
          orgid: orgid,
          code: code,
          name: {
            zh_CN: name,
            en_US: name,
            zh_TW: name
          },
          custdocdefid: docId,
          dr: 0,
          enable: args._status === "Insert" ? 1 : args.enable !== undefined ? (args.enable === 0 || args.enable === "0" ? 2 : args.enable) : 1,
          _status: args._status
        }
      };
      // 如果不是Insert状态就是Update状态就需要添加id
      if (!insert) body.data.id = id;
      // 通过是否是工作经费判断自定义档案数据是否要添加description
      if (condition != "A1") {
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
      // 如果同步成功则添加实体自定义档案id的GL_fundID的值
      else {
        let id = res2.data.id;
        args.GL_fundID = id;
        args.ToCustomFile = "1";
        return args;
      }
    }
    function svcustom(args) {
      let agsdata = args;
      if (agsdata.length !== 0) {
        let condition = args.fund_item_code;
        return savecosdoc(args, condition);
      } else return args;
    }
    let result = svcustom(params);
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", result.id);
    var res = ObjectStore.update("GT6948AT29.GT6948AT29.fund_MTB", result, updateWrapper, cBill)[0];
    if (runerr) res.docId = docId;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });