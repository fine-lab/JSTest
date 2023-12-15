let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //后端函数调用后端函数
    //也可以调用api函数
    //获取当前用户信息
    // 查询销售出库
    //查询物料productOrgs.*
    //查询物料适用范围
    //查询员工部门
    //查询供应商档案productcenter
    //查询供应商联系人
    //查询自定义档案
    //查询汇率
    //获取附件
    //获取图片
    //查询汇率
    //查询手机号
    //查询采购合同
    //查询采购需求
    //查询批号
    //查询凭证
    //查询客户
    let sql = "select name,principals.* from aa.merchant.Merchant";
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    throw new Error(JSON.stringify(res));
    const map1 = new Map();
    map1.set("a", 1);
    map1.set("b", 2);
    map1.set("c", 3);
    map1.set("c", 4);
    throw new Error(map1);
    return { res };
  }
}
exports({ entryPoint: MyTrigger });