let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var object = {};
    var res = {};
    object = { logdesc: "流程入参【全局变量】：context", loginfo: JSON.stringify(context) };
    res = ObjectStore.insert("GT43930AT272.GT43930AT272.scriptlog", object, "3ad6f8a9");
    object = { logdesc: "流程入参【单据数据】：variablesMap", loginfo: JSON.stringify(param.variablesMap) };
    res = ObjectStore.insert("GT43930AT272.GT43930AT272.scriptlog", object, "3ad6f8a9");
    object = { logdesc: "流程入参【单据ID】：businessKey", loginfo: param.businessKey };
    res = ObjectStore.insert("GT43930AT272.GT43930AT272.scriptlog", object, "3ad6f8a9");
    object = { logdesc: "流程入参【流程实例ID】：procInstId", loginfo: param.procInstId };
    res = ObjectStore.insert("GT43930AT272.GT43930AT272.scriptlog", object, "3ad6f8a9");
    object = { logdesc: "流程入参【流程定义ID】：procDefId", loginfo: param.procDefId };
    res = ObjectStore.insert("GT43930AT272.GT43930AT272.scriptlog", object, "3ad6f8a9");
    var AdminOrg_name = param.variablesMap.AdminOrg_name;
    var xiaoshouren_name = param.variablesMap.xiaoshouren_name;
    object = { logdesc: "流程入参【单据部分数据】：行政组织 >> 销售人姓名", loginfo: AdminOrg_name + " >> " + xiaoshouren_name };
    res = ObjectStore.insert("GT43930AT272.GT43930AT272.scriptlog", object, "3ad6f8a9");
    var resultInfo = "";
    if (xiaoshouren_name == "付振") {
      resultInfo = "付振";
    } else if (AdminOrg_name == "深圳劲嘉集团股份有限公司") {
      resultInfo = "深圳劲嘉";
    } else if (AdminOrg_name == "深圳劲嘉集团股份有限公司" && xiaoshouren_name == "付振") {
      //当【销售人】=“付振”且【行政组织】=“深圳劲嘉”时有多个审批分支符合条件，
      // 而业务要求多个条件同时符合时，环节“销售人等于<付振>”优先级为最高，所以流程脚本返回“付振”
      resultInfo = "付振";
    } else {
      resultInfo = "其他";
    }
    return resultInfo;
  }
}
exports({ entryPoint: MyTrigger });