let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var businessId = request.billno;
    let sql = "select sealway,verifystate,id,code,attachfile,contractno,sealtype  from GT89699AT3.GT89699AT3.sealapply   where code = '" + businessId + "'";
    let res = ObjectStore.queryByYonQL(sql);
    var attach = res[0].attachfile;
    var id = res[0].id;
    var contcode = res[0].contractno;
    var sealtype = res[0].sealtype;
    var code = res[0].code;
    var audit = res[0].verifystate;
    var sealway = res[0].sealway;
    if (audit == 2 && sealway == "FS01") {
      //获取用户token
      var appContextString = AppContext();
      var appContext = JSON.parse(appContextString);
      var token = appContext.token;
      var tenantId = appContext.currentUser.tenantId;
      var filePath = request.filePath;
      var filenames = request.fileName;
      var fileExtension = request.fileExtension;
      //调用u8c接口
      //调用u8c接口
      let body1 = { contnum: contcode, attach: attach, code: code, url: filePath, id: id, sealtype: sealtype, filename: filenames, tenantId: tenantId, fileExtension: fileExtension };
      let header1 = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let apiResponse1 = postman("post", "http://222.90.97.2:2105/service/operod?dataType=contfilesign", JSON.stringify(header1), JSON.stringify(body1));
      return { apiResponse1 };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });