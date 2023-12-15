let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //流转单主键
    var idnumber = request.idnumber;
    //服务中心人才库主键
    var cerContract_number = request.cerContract_number;
    //流转单号
    var codenumber = request.codenumber;
    //状态
    var innerStatus = request.innerStatus;
    //若已存在轨迹，则不可继续引用 issuingContract_code
    var rcksql = "select * from GT60601AT58.GT60601AT58.serCenPerDepot where inReceiContract_code=null and id=" + cerContract_number;
    var rckrst = ObjectStore.queryByYonQL(rcksql);
    if (rckrst.length > 0) {
      //是外部出证合同推送
      var gjsql = "select * from GT60601AT58.GT60601AT58.serCenPerDepot_a where serCenPerDepot_id=" + cerContract_number;
      var gjrst = ObjectStore.queryByYonQL(gjsql);
      if (idnumber === undefined && gjrst.length > 0) {
        throw new Error("所选的证书合同号为外部合同数据，不可多次引用！");
      } else if (idnumber !== undefined && codenumber != gjrst[0].circu_number) {
        throw new Error("所选的证书合同号为外部合同数据，不可多次引用！");
      }
    }
    if (innerStatus == 2) {
      //状态为【使用中】时进行唯一性校验
      var sql = 'select id from GT60601AT58.GT60601AT58.serCenInnerCircu where innerStatus=2 and cerContract_number ="' + cerContract_number + '"';
      var rst = ObjectStore.queryByYonQL(sql);
      if (idnumber === undefined && rst.length > 0) {
        throw new Error("所选的证书合同号在本次流转中已存在【使用中】数据，不可再次添加！");
      } else if (idnumber !== undefined && idnumber != rst[0].id) {
        throw new Error("所选的证书合同号在本次流转中已存在【使用中】数据，不可再次添加！");
      }
    }
    return { rst };
  }
}
exports({ entryPoint: MyAPIHandler });