let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //友户通 token   let token = JSON.parse(AppContext()).token;
    //获取令牌
    var obj = { subject: param.variablesMap.subject, sourceTypeName: param.variablesMap.sourceTypeName, hetongbianhao: param.variablesMap.subject.billno, deptName: param.variablesMap.deptName };
    let func1 = extrequire("AT1603F47809D0000B.backOpenApiFunction.协同合同插入");
    let res = func1.execute(obj);
    throw new Error(JSON.stringify(res));
    //地址 https://c2.yonyoucloud.com/iuap-yonbuilder-designer/ucf-wh/designer/funcScript/func/index.html#/functions?id=3e0a1634621c49f39dda86163a8da0e2
    return {};
  }
}
exports({ entryPoint: MyTrigger });