let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询所有物料编码
    var wlarr = ObjectStore.queryByYonQL("select DISTINCT (productId.code) as materialCode from pc.product.ProductDetail where iUOrderStatus='Y' and productId.code!=50040005", "productcenter");
    let body = { data: wlarr };
    //获取token
    let func = extrequire("GT80750AT4.backDefaultGroup.getToKen");
    let token = func.execute().access_token;
    let xcldta = postman("post", "https://www.example.com/" + token, null, JSON.stringify(body));
    if (JSON.parse(xcldta).code == 200) {
      let datastr = JSON.parse(xcldta).data;
      //查询所有的数据
      var object = ObjectStore.queryByYonQL("select id from GT80750AT4.GT80750AT4.xcl_kckyl ");
      //清空表
      ObjectStore.deleteBatch("GT80750AT4.GT80750AT4.xcl_kckyl", object);
      //新增数据
      var objectList = [];
      for (let i = 0; i < datastr.length; i++) {
        let wldata = datastr[i];
        var wlname = ObjectStore.queryByYonQL("select  name from pc.product.Product where code='" + wldata.materialCode + "'", "productcenter");
        objectList.push({
          astinventory: wldata.astinventory,
          inventory: wldata.nccAstinventory,
          material_name: wlname[0].name,
          material_code: wldata.materialCode
        });
      }
      ObjectStore.insertBatch("GT80750AT4.GT80750AT4.xcl_kckyl", objectList, "");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });