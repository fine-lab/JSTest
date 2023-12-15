let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let updateObjects = request.updateObjects;
    for (var prop of updateObjects) {
      var storeid = prop.storeid;
      let cid = prop.cid;
      let onuse = prop.onuse;
      let leftnum = prop.leftnum;
      var object;
      var res;
      object = {
        id: storeid,
        storeprofile_bList: [
          { hasDefaultInit: true, id: cid, usenum: onuse, _status: "Update" },
          { hasDefaultInit: true, id: cid, leftnum: leftnum, _status: "Update" }
        ]
      };
      res = ObjectStore.updateById("GT80750AT4.GT80750AT4.storeprofile", object);
    }
    //循环结束后查询新开门店单据子表所有行的已使用数量不为0 就设置为已使用
    let isInUse = queryNewStore(storeid);
    if (isInUse) {
      object = { id: storeid, usestatus: "1" };
      res = ObjectStore.updateById("GT80750AT4.GT80750AT4.storeprofile", object);
    }
    return { code: 200, message: "success", data: res };
    function queryNewStore(storeid) {
      let result = true;
      let sql = `select 1 from GT80750AT4.GT80750AT4.storeprofile_b where storeprofile_id = 'youridHere'and usenum <> 0`;
      var res = ObjectStore.queryByYonQL(sql);
      if (res == undefined || res.length == 0) {
        result = false;
      }
      return result;
    }
  }
}
exports({ entryPoint: MyAPIHandler });