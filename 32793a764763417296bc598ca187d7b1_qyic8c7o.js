let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let jirakey = request.jirakey;
    //根据单据id从实体中查询对应的aid
    var res = ObjectStore.queryByYonQL("select id,aid,rqDate,rqStartDate,rqEndDate,JiraKey,paramId from AT16F67D6A08C80004.AT16F67D6A08C80004.rjss where aid=" + jirakey);
    let BillId = res[0].id;
    return { BillId };
  }
}
exports({ entryPoint: MyAPIHandler });