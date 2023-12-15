let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var message;
    var sussecc;
    var bipid;
    //查新采购方案是否生成采购合同  如果存在不能删除
    var queryctsql = "select  * from  AT168837E809980003.AT168837E809980003.pk_fct_ap_b_ad_pu1 where  dr=0 and source_id=" + request.id;
    var resquery = ObjectStore.queryByYonQL(queryctsql);
    if (resquery != undefined && resquery.length > 0) {
      sussecc = "N";
      message = "删除失败,采购方案已经生成合同不能删除!" + JSON.stringify(resquery);
    } else {
      var res = ObjectStore.deleteByMap("AT168837E809980003.AT168837E809980003.puorder1", request, "ybdcaa4177");
      if (message == undefined) {
        sussecc = "Y";
        message = "删除成功";
        bipid = res.id;
      } else {
        sussecc = "N";
        message = "删除失败" + JSON.stringify(res);
      }
    }
    return { sussecc, message };
  }
}
exports({ entryPoint: MyAPIHandler });