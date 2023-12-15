let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    var res = AppContext();
    var objs = JSON.parse(res);
    //获取子表
    let sql1 = "select * from GT18216AT3.GT18216AT3.khdzqrdh2 where khdzqrd2_id=" + pdata.id;
    var ps = ObjectStore.queryByYonQL(sql1);
    var oth = {};
    var othOutRecords = [];
    for (var item of ps) {
      //根据id拿到物料sku
      let sql4 = "select id from pc.product.ProductSKU where productId=" + item.materialNo; //item.materialNo;
      var res5 = ObjectStore.queryByYonQL(sql4, "productcenter");
      //根据物料id拿到物料ID,库存单位
      let sql3 = "select id,stockUnit from pc.product.ProductExtend where id=" + item.materialNo;
      var res4 = ObjectStore.queryByYonQL(sql3, "productcenter");
      oth = {
        product: res4[0].id,
        productsku: res5[0].id,
        qty: item.lossNo,
        stockUnitId: res4[0].stockUnit,
        _status: "Insert"
      };
      othOutRecords.push(oth);
    }
    var pdatas = {
      data: {
        accountOrg: objs.currentUser.orgId,
        code: pdata.code,
        org: objs.currentUser.orgId,
        vouchdate: pdata.billDate,
        bustype: "A10001",
        warehouse: pdata.wareHouse,
        status: "1",
        _status: "Insert",
        othOutRecords: othOutRecords
      }
    };
    var resdata = JSON.stringify(pdatas);
    let base_path = "https://www.example.com/";
    var hmd_contenttype = "application/json;charset=UTF-8";
    let header = {
      "Content-Type": hmd_contenttype
    };
    var body = {
      resdata: resdata
    };
    //拿到access_token
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    let res_r = func.execute("");
    var token2 = res_r.access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(pdatas));
    var strrr = JSON.stringify(body);
    //加判断
    var obj = JSON.parse(apiResponse);
    var resp = obj.data;
    var code = obj.code;
    if (code != "200") {
      throw new Error("失败!" + obj.message);
    }
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });