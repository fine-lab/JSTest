let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //需要更新需求申请的 是否退回字段
    var idValue = request.id;
    var billno = request.billno;
    var shenqingjine = request.shenqingjine;
    var sql = "select id,shengyujine,zaitujine  from  GT879AT352.GT879AT352.htxqc where billno = '" + billno + "'";
    var htxqc = ObjectStore.queryByYonQL(sql);
    var res;
    if (shenqingjine) {
      //更新付款申请为退回  直接通过提交按钮状态来判断,不加值了
      let beforeSYValue = new Big(htxqc[0].shengyujine);
      let beforeZTValue = new Big(htxqc[0].zaitujine);
      //剩余金额减去申请金额
      let afterSYValue = beforeSYValue.plus(shenqingjine);
      //在途金额加上申请金额
      let afterZTValue = beforeZTValue.minus(shenqingjine);
      var object = { id: htxqc[0].id, shengyujine: afterSYValue, zaitujine: afterZTValue };
      res = ObjectStore.updateById("GT879AT352.GT879AT352.htxqc", object, "7b78e263");
    } else {
      throw new Error("金额数据中有值为空");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });