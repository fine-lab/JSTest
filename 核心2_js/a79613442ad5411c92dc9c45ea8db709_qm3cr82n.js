let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var object = { bstarted: "1", iwarehousevol: "0", iwarehousestock: "0" };
    var res = ObjectStore.queryByYonQL("select *,creator.userName as creator_userName,modifier.userName as modifier_userName from GT61071AT236.GT61071AT236.param6 where id='youridHere' ");
    var res_warehouseid = ObjectStore.queryByYonQL(
      "select id,iwarehouseid,fkid,iwarehouseid.name as iwarehouseid_name from GT61071AT236.GT61071AT236.param6_iwarehouseid where fkid='youridHere'"
    );
    // 返回  {"res":[{"acount":1}],"spendtime":11}
    var objarr = res;
    var id = objarr[0].id;
    if (id == "") {
      res = ObjectStore.insert("GT61071AT236.GT61071AT236.param6", object, "1b0cc357");
    }
    res[0].param6_iwarehouseidList = res_warehouseid;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });