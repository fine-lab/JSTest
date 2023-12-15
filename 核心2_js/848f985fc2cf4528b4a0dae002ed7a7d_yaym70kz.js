let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", param.data[0].id);
    // 待更新字段内容
    var toUpdate = { zuizhongshenpiren: "" }; //key为需要回写的审批人字段编码，value为回写的具体值
    // 执行更新
    var res2 = ObjectStore.update("AT168837E809980003.AT168837E809980003.ad_pu1", toUpdate, updateWrapper, "ybf0122bfbList"); //第一个参数为执行审批流单据的实体URI（去对象建模中实体上找），第三个参数是执行审批流单据的单据编码（去页面建模中找）
    return {};
  }
}
exports({ entryPoint: MyTrigger });