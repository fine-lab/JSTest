let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let orderNo = request.cCode; //u8订单号
      let sql = "";
      let rep = {
        code: 0,
        msg: ""
      };
      sql = "select id,POPomainCodeYS from AT1767B4C61D580001.AT1767B4C61D580001.rdrecord_01 where Iarriveid='" + orderNo + "'";
      //是否存在数据
      let res1 = ObjectStore.queryByYonQL(sql);
      if (res1.length > 0) {
        var updateWrapper = new Wrapper();
        updateWrapper.eq("Iarriveid", orderNo);
        // 待更新字段内容
        var toUpdate = {
          VyState: "已同步U8已弃审"
        };
        ObjectStore.update("AT1767B4C61D580001.AT1767B4C61D580001.rdrecord_01", toUpdate, updateWrapper, "yb89b91af0");
        //更新采购订单入库数量
        //更新累计入库数量
      }
      return rep;
    } catch (e) {
      return {
        code: 500,
        msg: e.message,
        data: null
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });