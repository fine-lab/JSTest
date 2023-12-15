let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paramObj = JSON.parse(param);
    let businessId = paramObj.businessId;
    let sqlStr = "select * from GT3734AT5.GT3734AT5.QYSQD where id = '" + businessId + "'";
    let queryRes = ObjectStore.queryByYonQL(sqlStr);
    let dataDetail = queryRes[0];
    let schemeBillNo = dataDetail.schemeBillNo; //方案单据编码
    let schemeBillId = dataDetail.schemeBillId; //方案单据ID
    let code = dataDetail.code;
    let shiyebu = dataDetail.shiyebu; //事业部ID
    let orgres = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ orgId: shiyebu, docType: "org" }));
    let shiyebu_name = orgres.data.name.zh_CN;
    let billno = "c783f00c"; //AIMXI建机事业部
    let billuri = "GT3734AT5.GT3734AT5.AIMIXXPFASQ";
    if (includes(shiyebu_name, "环保")) {
      billno = "69939af7"; //
      billuri = "GT3734AT5.GT3734AT5.BTXPFASQ";
    } else if (includes(shiyebu_name, "游乐")) {
      billno = "b8a7fc44"; //
      billuri = "GT3734AT5.GT3734AT5.YLXPFASQ";
    }
    if (dataDetail.verifystate == 2) {
      //审核态
      ObjectStore.updateById(billuri, { id: schemeBillId, signBillId: businessId, signBillNo: code }, billno);
    } else {
      ObjectStore.updateById(billuri, { id: schemeBillId, signBillId: "", signBillNo: "" }, billno);
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });