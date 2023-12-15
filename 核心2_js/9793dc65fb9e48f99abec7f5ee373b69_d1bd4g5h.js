let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.data;
    datas.forEach((row) => {
      var rebateid = row.rebateid; //返利政策id
      var querybalance = ObjectStore.queryByYonQL("select balance from AT16388E3408680009.AT16388E3408680009.mzgd_RebatePolicys where id='" + rebateid + "'");
      // 改返利政策-余额数据
      var balce = querybalance[0].balance + row.rebateMoney;
      var objectupd = {
        id: rebateid,
        balance: balce
      };
      var updatarehate = ObjectStore.updateById("AT16388E3408680009.AT16388E3408680009.mzgd_RebatePolicys", objectupd);
      var object = { ChannelAgentID: row.agentfid };
      var res = ObjectStore.deleteByMap("AT16388E3408680009.AT16388E3408680009.flzcjlbzhu", object);
    });
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });