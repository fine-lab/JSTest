let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    //从流程数据中获取单据id
    let id = eval(split(activityEndMessage.businessKey, "_", 2))[1];
    //根据单据id从实体中查询对应的aid（主表）
    //新方法带Cookie
    let token = JSON.parse(AppContext()).token;
    let funid = "youridHere";
    //信息头
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      Cookie: "yht_access_token=" + token
    };
    body.microService = {
      appVersion: "2.0",
      productCategory: "tc",
      domainCloud: "devTestCase",
      domain: "ceshi",
      microServiceGroup: "ceshi",
      code: "iuap-blockchain-test",
      name: "宋天振----------",
      appNum: "",
      privateFlag: "1",
      type: "后端",
      appType: "YMS",
      department: "Devops研发部",
      department_manager: "书超",
      departmentManagerMail: "xss@yonyou.com    ",
      departmentManagerPhone: "13212344321",
      developer: "某人",
      developerMail: "https://www.example.com/",
      developerPhone: "14323454321",
      codeAlias: "微服务别名",
      selectFlag: "1",
      redisPublic: "30",
      redisPrivate: "30",
      dbPublic: "iuap-devops-data",
      dbPrivate: "iuap-devops-data",
      gitUrl: "https://git.yonyou.com",
      projectPath: "/bootstrap/web",
      scriptPath: "/bootstrap/",
      architect: "张三，李四",
      rpcDomain: "xxx"
    };
    let venderinnfo = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    //调试用-----将结果插入测试实体
    var object = { new1: id, insetnew6: JSON.stringify(body) };
  }
}
exports({ entryPoint: WorkflowAPIHandler });