let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return {
      //这里要查询身份select * from online0205.treeucfbase.treeucfbase_Treetable  where shenfenma = param1
      //返回经销商、销售地区、产品代码、产品名称、出货单号
    };
  }
}
exports({ entryPoint: MyTrigger });