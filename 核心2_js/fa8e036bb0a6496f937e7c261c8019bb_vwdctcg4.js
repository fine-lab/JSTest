let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    if (param.data[0].verifystate != 4) {
      throw new Error(" 删除失败，只有【已保存】状态的单据可以删除");
    }
    //执行删除
    let mainId = param.data[0].id;
    var detRes = ObjectStore.queryByYonQL("select id from GT4691AT1.GT4691AT1.MFrontSaleOrderDet where MFrontSaleOrderDetFk='" + mainId + "'");
    var object = { id: mainId };
    var detDel = ObjectStore.deleteBatch("GT4691AT1.GT4691AT1.MFrontSaleOrderDet", detRes, "0966e17f");
    var mainDel = ObjectStore.deleteById("GT4691AT1.GT4691AT1.MFrontSaleOrderMain", object, "0966e17f");
    if (detDel.length > 0) {
      return { message: "删除成功！" };
    } else {
      throw new Error("删除失败！请刷新重试");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });