let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 处理回调业务 [developplatform]
    let user = ObjectStore.user();
    //服务错误：{"_entityName":null,"_keyName":null,"id":"1847601798813057033","_status":null,"verifystate":2,"ytenant":"yaym70kz","pubts":"2023-10-26 11:12:26"}111111
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", param.data[0].id);
    // 待更新字段内容
    var toUpdate = { zuizhongshenpiren: user.id }; //key为需要回写的审批人字段编码，value为回写的具体值
    // 执行更新
    var res2 = ObjectStore.update("AT168837E809980003.AT168837E809980003.ad1", toUpdate, updateWrapper, "ybfcd0be3dList"); //第一个参数为执行审批流单据的实体URI（去对象建模中实体上找），第三个参数是执行审批流单据的单据编码（去页面建模中找）
    return {};
  }
}
exports({ entryPoint: MyTrigger });