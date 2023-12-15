let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let id = pdata.id;
    let code = pdata.code;
    let extendReceBill = pdata.extendReceBill;
    if (extendReceBill) {
      var res = ObjectStore.queryByYonQL("select id from AT1703B12408A00002.AT1703B12408A00002.receiveBillWB where wbBillId='" + id + "'", "developplatform");
      if (res.length > 0) {
        let tid = res[0].id;
        let url = "https://www.example.com/";
        let apiResponse = openLinker("POST", url, "GT3734AT5", JSON.stringify({ tid: tid, del: 1 }));
      } else {
      }
      return;
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });