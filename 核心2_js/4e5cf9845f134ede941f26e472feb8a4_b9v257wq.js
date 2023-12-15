let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    try {
      let code = request.code; //编码
      let des = request.des || []; //详细
      // 更新条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("code", code);
      // 待更新字段内容
      var toUpdate = { settlementOrNot: "YJS", consignmentListList: [] }; //更新为已结算
      var res;
      if (des.length > 0) {
        des.forEach((item, index) => {
          toUpdate.consignmentListList.push({
            id: item.id,
            poCode: item.poCode, //采购订单编码
            flg: "已结算",
            _status: "Update"
          });
        });
        res = ObjectStore.update("AT18623B800920000A.AT18623B800920000A.consignment", toUpdate, updateWrapper, "yb7138aa38");
      }
      try {
        //更新结算标识
        var updateWrapper01 = new Wrapper();
        updateWrapper01.eq("code", code);
        // 待更新字段内容
        var toUpdate01 = { settlementOrNot: "YJS" }; //更新为已结算
        let sql1 =
          "select count(0) count from AT18623B800920000A.AT18623B800920000A.consignment inner join AT18623B800920000A.AT18623B800920000A.consignmentList b on b.consignment_id=id where code='" +
          code +
          "' and b.flg!='已结算'";
        let dt01 = ObjectStore.queryByYonQL(sql1, "developplatform");
        if (dt01.length > 0) {
          let tq = dt01[0].count;
          if (tq > 0) {
            toUpdate01.settlementOrNot = "BFJS";
          }
          res = ObjectStore.update("AT18623B800920000A.AT18623B800920000A.consignment", toUpdate01, updateWrapper01, "yb7138aa38");
        }
      } catch (e) {}
      rsp.dataInfo = res;
    } catch (ex) {
      rsp.code = 500;
      rsp.msg = ex.message;
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });