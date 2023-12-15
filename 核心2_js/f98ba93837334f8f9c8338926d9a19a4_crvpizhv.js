let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var supdata = param.data[0];
    var code = "";
    var taxpayerid = supdata.defines.define4;
    var name = supdata.supEnterpriseName.zh_CN; //.getValue("");
    let body = { code: code, name: name, taxpayerid: taxpayerid };
    let header = { "Content-Type": "application/json" };
    let headerparam = JSON.stringify(header);
    let bodyparam = JSON.stringify(body);
    let strResponse = postman("post", "http://61.49.60.150:78/service/YCSupplierQueryServlet", headerparam, bodyparam);
    var relSearch = "select code from aa.vendor.Vendor where name = '" + name + "'";
    var res = ObjectStore.queryByYonQL(relSearch);
    if ((res == null || res == "") && strResponse == "true") {
      throw new Error("NC中存在此供应商，请先将NC中的供应商同步采购云");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });