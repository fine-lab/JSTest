let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //提货、发车、在途、中转到库、中转出库、签收、附件上传、已邮寄签收单
    let status = { 提货: "1", 发车: "2", 在途: "3", 中转到库: "4", 中转出库: "5", 签收: "6", 附件上传: "7", 已邮寄签收单: "8" };
    if (request.rec_no == null) {
      throw new Error("到货单号不能为空");
    }
    if (request.log_no == null) {
      throw new Error("物流单号不能为空");
    }
    if (request.wlztxxmxList == null) {
      throw new Error("子数据不能为空");
    }
    let children = request.wlztxxmxList;
    children.map((item, i) => {
      if (item.status_code == null) {
        throw new Error("是否邮寄签收单不能为空");
      }
      if (item.status_name == null) {
        throw new Error("物流状态不能为空");
      }
      if (item.act_time == null) {
        throw new Error("操作时间不能为空");
      }
    });
    //查询
    var sql =
      "select (select * from wlztxxmxList) wlztxxmxList,rec_no,id,log_no,sign_status,sign_bill,mail_status from AT1707A99A16B00005.AT1707A99A16B00005.wlztxx  where rec_no = '" + request.rec_no + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      res[0].rec_no = request.rec_no;
      res[0].code = request.rec_no;
      res[0].log_no = request.log_no;
      res[0].status_name = status[request.status_name];
      res[0].sign_status = request.sign_status;
      res[0].mail_status = request.mail_status;
      res[0]._status = "Update";
      let bdChildren = res[0].wlztxxmxList;
      bdChildren.map((child, i) => {
        child._status = "Update";
      });
      children.map((item, i) => {
        item._status = "Insert";
        res[0].wlztxxmxList.push(item);
      });
      //更新
      res = ObjectStore.updateById("AT1707A99A16B00005.AT1707A99A16B00005.wlztxx", res, "yba8d3690f");
    } else {
      request.sign_bill =
        Math.random().toString(36).substr(2, 8) +
        "-" +
        Math.random().toString(36).substr(2, 4) +
        "-" +
        Math.random().toString(36).substr(2, 4) +
        "-" +
        Math.random().toString(36).substr(2, 4) +
        "-" +
        new Date().getTime().toString().substr(1, 12);
      //新增
      request.code = request.rec_no;
      request.status_name = status[request.status_name];
      res = ObjectStore.insert("AT1707A99A16B00005.AT1707A99A16B00005.wlztxx", request, "yba8d3690f");
    }
    var sql1 =
      "select (select * from wlztxxmxList order by act_time desc) wlztxxmxList,rec_no,id,log_no,sign_status,sign_bill,mail_status from AT1707A99A16B00005.AT1707A99A16B00005.wlztxx  where rec_no = '" +
      request.rec_no +
      "' ";
    var res1 = ObjectStore.queryByYonQL(sql1);
    try {
      // 回写要货计划
      request.wlztxx = res1;
      let func = extrequire("AT1707A99A16B00005.backOpenApiFunction.backWriteShi");
      let updateRes = func.execute(request);
    } catch (e) {}
    return res1[0];
  }
}
exports({ entryPoint: MyAPIHandler });