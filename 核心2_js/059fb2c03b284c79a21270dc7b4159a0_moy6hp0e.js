let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    let sql = "";
    let sql01 = "";
    sql01 = "select code,id from aa.warehouse.Warehouse where code in ('WH06','WH50')";
    let dt01 = ObjectStore.queryByYonQL(sql01, "productcenter"); //收货仓库编码 为空时查询所有 1665022687532023840  ,1665022696121958424
    let warehouses = [];
    dt01.map((v) => {
      warehouses.push(v.id);
    });
    try {
      sql = "select warehouse,product,pubts from stock.currentstock.CurrentStock where 1=1  ";
      if (dt01.length > 0) {
        sql += " and warehouse in (" + warehouses + ")";
      }
      sql += " order by pubts desc ";
      let dt = ObjectStore.queryByYonQL(sql, "ustock");
      rsp.dataInfo = dt;
    } catch (ex) {
      console.log("错误信息" + ex.toString());
      rsp.code = 500;
      rsp.msg = ex.toString();
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });