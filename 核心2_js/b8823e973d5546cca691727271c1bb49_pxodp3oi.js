let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let code = request.code;
    ObjectStore.updateById("GT3734AT5.GT3734AT5.QYSQD", { id: id, isClosed: true }, "d589f47a");
    //关联单据进行解耦,"schemeBillId":'',"schemeBillNo":''
    let schemeBillId = request.schemeBillId;
    let shiyebu = request.shiyebu; //事业部ID
    let orgres = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ orgId: shiyebu, docType: "org" }));
    let shiyebu_name = orgres.data.name.zh_CN;
    let billno = "c783f00c"; //AIMXI建机事业部
    let billuri = "GT3734AT5.GT3734AT5.AIMIXXPFASQ";
    if (includes(shiyebu_name, "环保")) {
      billno = "69939af7"; //
      billuri = "GT3734AT5.GT3734AT5.BTXPFASQ";
    } else if (includes(shiyebu_name, "游乐")) {
      billno = "b8a7fc44";
      billuri = "GT3734AT5.GT3734AT5.YLXPFASQ";
    }
    if (schemeBillId != undefined && schemeBillId != null && schemeBillId != "") {
      ObjectStore.updateById(billuri, { id: schemeBillId, signBillId: "", signBillNo: "" }, billno);
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyAPIHandler });