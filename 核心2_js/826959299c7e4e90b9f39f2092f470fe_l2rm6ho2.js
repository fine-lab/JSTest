let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orderdetailfun = extrequire("GT30233AT436.backDefaultGroup.getDetailData");
    let detaildata = orderdetailfun.execute(request);
    let paystatusfun = extrequire("GT30233AT436.backDefaultGroup.getPayStatus");
    let paysttemap = paystatusfun.execute(null);
    let delivermap = getDelivertype();
    let orderstatusfun = extrequire("GT30233AT436.backDefaultGroup.getOrderStatus");
    let ordermap = orderstatusfun.execute(null);
    if (null !== detaildata && detaildata.length > 0) {
      for (var m = 0; m < detaildata.length; m++) {
        let object = getArrayList(detaildata[m].result, paysttemap, delivermap, ordermap);
        ObjectStore.insertBatch("GT30233AT436.GT30233AT436.kryorderdetailinfo", object, "de613db3");
      }
    }
    return {};
    function getArrayList(detaildata, paysttemap, delivermap, ordermap) {
      let arr = new Array(detaildata.length);
      for (var i = 0; i < detaildata.length; i++) {
        let orderdetailprofun = extrequire("GT30233AT436.backDefaultGroup.setorderdetail");
        let requestparameter = {
          detaildata: detaildata[i],
          delivermap: delivermap,
          paysttemap: paysttemap,
          ordermap: ordermap
        };
        let orderdetailinfos = orderdetailprofun.execute(requestparameter);
        arr[i] = orderdetailinfos;
      }
      return arr;
    }
    //就餐类型
    function getDelivertype() {
      let sql = "select   delivertypecode,delivertypename from  GT30233AT436.GT30233AT436.krydelivertype  where dr=0";
      let rst = ObjectStore.queryByYonQL(sql);
      let map = new Map();
      if (null !== rst && rst.length > 0) {
        for (var i = 0; i < rst.length; i++) {
          map.set(trim(rst[i].delivertypecode), rst[i].delivertypename);
        }
      }
      return map;
    }
  }
}
exports({ entryPoint: MyAPIHandler });