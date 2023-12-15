let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var objects = [];
    var url = "https://www.example.com/";
    var body = {
      pageIndex: 1,
      pageSize: 1000
    }; //请求参数
    var apiResponse = openLinker("POST", url, "AT179D04BE0940000B", JSON.stringify(body)); //TODO：注意填写应用编码(请看注意事项)
    var apiResponseJSON = JSON.parse(apiResponse);
    apiResponseJSON.data.recordList.forEach((row) => {
      var code = row.code;
      var name = row.name.zh_CN;
      var sjh = "";
      var lxr = "";
      var dz = "";
      var id = row.id;
      var reslxr = ObjectStore.queryByYonQL("select fullName,mobile from aa.merchant.Contacter where merchantId=" + id + "", "productcenter");
      if (reslxr.length > 0) {
        lxr = reslxr[0].fullName;
        sjh = reslxr[0].mobile;
      }
      var resdz = ObjectStore.queryByYonQL("select receiver,mobile,address from aa.merchant.AddressInfo where merchantId=" + id + "", "productcenter");
      if (resdz.length > 0) {
        if (sjh == "") {
          sjh = resdz[0].mobile;
        }
        if (lxr == "") {
          lxr = resdz[0].receiver;
        }
        dz = resdz[0].address;
      }
      var object = {
        CustCode: code,
        CustName: name,
        lianxiren: lxr,
        lianxidianhua: sjh,
        xiangxidizhi: dz
      };
      objects.push(object);
    });
    var res = ObjectStore.insertBatch("AT179D04BE0940000B.AT179D04BE0940000B.CustomerData", objects, "yb3d3f4c0a");
    return {};
  }
}
exports({ entryPoint: MyTrigger });