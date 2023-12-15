let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let sql = "select verifystate,id,code,attachfile,contractno,sealtype  from GT89699AT3.GT89699AT3.sealapply   where id = '" + businessId + "'";
    let res = ObjectStore.queryByYonQL(sql);
    var verifystate = res[0].verifystate;
    if (verifystate == 2) {
      //流程完成并且是审批通过
      var attach = res[0].attachfile;
      var id = res[0].id;
      var contcode = res[0].contractno;
      var sealtype = res[0].sealtype;
      var sealcode = res[0].code;
      //获取用户token
      var appContextString = AppContext();
      var appContext = JSON.parse(appContextString);
      var token = appContext.token;
      var tenantId = appContext.currentUser.tenantId;
      let url = `https://c2.yonyoucloud.com/iuap-apcom-file/rest/v1/file/mdf/${attach}/files?includeChild=false&ts=1655781730750&pageSize=10`;
      let header = { "Content-Type": "application/json;charset=UTF-8", cookie: `yht_access_token=${token}` };
      let body = {};
      let apiResponse = postman("get", url, JSON.stringify(header), JSON.stringify(body));
      var apiResponsetext = JSON.parse(apiResponse);
      var resarray = apiResponsetext.data;
      var filePath = resarray[0].filePath;
      var filenames = resarray[0].fileName;
      var fileExtension = resarray[0].fileExtension;
      //调用u8c接口
      let body1 = { contnum: contcode, attach: attach, sealtype: "", url: filePath, id: id, code: sealcode, sealtype: sealtype, filename: filenames, tenantId: tenantId, fileExtension: fileExtension };
      let header1 = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let apiResponse1 = postman("post", "http://117.35.158.238:2105/service/operod?dataType=contfilesign", JSON.stringify(header1), JSON.stringify(body1));
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });