let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let id = pdata.id;
    let code = pdata.code;
    let extendReceBill = pdata.extendReceBill;
    if (extendReceBill) {
      var res = ObjectStore.queryByYonQL("select id from AT1703B12408A00002.AT1703B12408A00002.receiveBillWB where wbBillId='" + id + "'", "developplatform");
      let tid = 0;
      if (res.length > 0) {
        let tid = res[0].id;
      } else {
      }
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "GT3734AT5", JSON.stringify({ tid: tid, id: id, extendReceBill: extendReceBill, code: code }));
      return;
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });