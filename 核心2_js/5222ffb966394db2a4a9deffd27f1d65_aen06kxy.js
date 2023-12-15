let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rows = request.rows;
    let myDate = new Date();
    let docId = request.docId;
    let code = myDate.getHours() + myDate.getMinutes() + myDate.getSeconds() + myDate.getMilliseconds();
    rows.forEach((row) => {
      let body = {
        data: {
          name: row.name,
          code: row.code,
          orgid_name: row.org_id_realname,
          orgid: row.orgid,
          custdocdefid: docId,
          dr: 0,
          enable: 1,
          _status: "Insert"
        }
      };
      // 插入自定义档案api
      let func2 = extrequire("GT6948AT29.custom.insertCustomCnfData");
      request.cofid = docId;
      request.body = body;
      let res2 = func2.execute(request).res;
      // 是否插入成功
      if (res2.code != "200") {
        console.log("同步自定义档案失败");
        return args;
      }
      // 如果同步成功则添加实体自定义档案id的GL_fundID的值
      else {
        let id = res2.data.id;
        param.data[0].set("GL_fundID", id);
        return param;
      }
    });
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });