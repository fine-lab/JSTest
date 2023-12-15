let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前租户ID
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantID;
    var userids = obj.currentUser.id;
    let stockId = request.stockId === undefined || request.stockId === null ? "" : request.stockId; //获取当前需要复审的盘点单主键
    let Shenhetime = request.Shenhetime === undefined || request.Shenhetime === null ? "" : request.Shenhetime; //审核时间
    var stockarea = "select * from Idx3.Idx3.dxq_checkresult where checkID='" + stockId + "' and dr=0 and (checkstatus=0||checkstatus=2)";
    var data = ObjectStore.queryByYonQL(stockarea);
    var stock = "select * from Idx3.Idx3.dxq_checkstock where id='" + stockId + "' and dr=0 ";
    var stockdata = ObjectStore.queryByYonQL(stock);
    let objs = [];
    if (data !== null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var checkstatus = data[i].hasOwnProperty("checkstatus") === false ? "" : data[i].checkstatus;
        var corfid = data[i].hasOwnProperty("coderfID") === false ? "" : data[i].coderfID;
        if (checkstatus === "2") {
          var stockcoderfid = "select * from Idx3.Idx3.dxq_coderfid where id='" + corfid + "' and dr=0";
          var datacode = ObjectStore.queryByYonQL(stockcoderfid);
          if (datacode !== null && datacode.length > 0) {
            //判断当前的物料是多的状态并且是发货的状态的需要走出库流程
            var rfid_status = datacode[0].RFIDStatus;
            if (rfid_status == "6") {
              let object = {
                checkResultID: data[i].hasOwnProperty("id") === false ? "" : data[i].id,
                checkID: data[i].hasOwnProperty("checkID") === false ? "" : data[i].checkID,
                coderfid: data[i].hasOwnProperty("coderfID") === false ? "" : data[i].coderfID,
                localtionID: data[i].hasOwnProperty("storkLocationID") === false ? "" : data[i].storkLocationID,
                product_id: data[i].hasOwnProperty("product_id") === false ? "" : data[i].product_id,
                product_sku_id: data[i].hasOwnProperty("product_sku_id") === false ? "" : data[i].product_sku_id,
                remark: data[i].hasOwnProperty("remark") === false ? "" : data[i].remark,
                checkstatus: data[i].hasOwnProperty("checkstatus") === false ? "" : data[i].checkstatus,
                LabelCount: data[i].hasOwnProperty("LabelCount") === false ? "" : data[i].LabelCount,
                status: 0,
                creator: userids,
                modifier: userids,
                org_id: stockdata[0].hasOwnProperty("org_id") === false ? "" : stockdata[0].org_id
              };
              objs.push(object);
            }
          }
        } else if (checkstatus === "0") {
          var stockrecordlist = "select * from Idx3.Idx3.dxq_storerecord where rfidcodeId='" + corfid + "' and dr=0";
          var datarecord = ObjectStore.queryByYonQL(stockrecordlist);
          if (datarecord !== null && datarecord.length > 0) {
            var batch_no = datarecord[0].hasOwnProperty("batch_no") === false ? "" : datarecord[0].batch_no;
            if (batch_no !== "") {
              let object = {
                checkResultID: data[i].hasOwnProperty("id") === false ? "" : data[i].id,
                checkID: data[i].hasOwnProperty("checkID") === false ? "" : data[i].checkID,
                coderfid: data[i].hasOwnProperty("coderfID") === false ? "" : data[i].coderfID,
                localtionID: data[i].hasOwnProperty("storkLocationID") === false ? "" : data[i].storkLocationID,
                product_id: data[i].hasOwnProperty("product_id") === false ? "" : data[i].product_id,
                product_sku_id: data[i].hasOwnProperty("product_sku_id") === false ? "" : data[i].product_sku_id,
                remark: data[i].hasOwnProperty("remark") === false ? "" : data[i].remark,
                checkstatus: data[i].hasOwnProperty("checkstatus") === false ? "" : data[i].checkstatus,
                LabelCount: data[i].hasOwnProperty("LabelCount") === false ? "" : data[i].LabelCount,
                status: 0,
                creator: userids,
                modifier: userids,
                org_id: stockdata[0].hasOwnProperty("org_id") === false ? "" : stockdata[0].org_id
              };
              objs.push(object);
            }
          }
        }
        //如果盘点的状态为亏，需要将数据库中的dr变成1
        if (checkstatus === "0") {
          var objectupdate = {
            id: data[i].hasOwnProperty("coderfID") === false ? "" : data[i].coderfID,
            modifier: userids,
            modify_time: Shenhetime,
            dr: 1
          };
          ObjectStore.updateById("Idx3.Idx3.dxq_coderfid", objectupdate, "");
        } else if (checkstatus === "2") {
          var objectupdate1 = {
            id: corfid,
            modifier: userids,
            modify_time: Shenhetime,
            RFIDStatus: 1
          };
          ObjectStore.updateById("Idx3.Idx3.dxq_coderfid", objectupdate1, "");
        }
      }
    }
    ObjectStore.insert("Idx3.Idx3.dxq_checkdiff", objs, "");
    var objectchuli = {
      id: stockId,
      ShenheStatus: 1,
      ShenheUser: userids,
      Shenhetime: Shenhetime
    };
    var resuphulue = ObjectStore.updateById("Idx3.Idx3.dxq_checkstock", objectchuli, "");
    return {
      res: objs
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});