let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var pdata = param.data[0];
    //已经传到EBS的单据
    if (pdata.defines && pdata.defines.define1 == "true") {
      return { code: 200 };
    }
    let sql1 = "select define1 from org.func.BaseOrgDefine where id=" + pdata.inorg;
    var res1 = ObjectStore.queryByYonQL(sql1, "ucf-org-center");
    let sql2 = "select code from aa.warehouse.Warehouse where id = " + pdata.outwarehouse;
    var res2 = ObjectStore.queryByYonQL(sql2, "productcenter");
    let sql3 = "select code from aa.warehouse.Warehouse where id = " + pdata.inwarehouse;
    var res3 = ObjectStore.queryByYonQL(sql3, "productcenter");
    //查询子表信息
    let sql4 = "select * from st.storein.StoreInDetail where mainid=" + pdata.id;
    var res4 = ObjectStore.queryByYonQL(sql4, "ustock");
    let products = [];
    for (var item of res4) {
      //根据id查物理编码
      let sql5 = "select code from pc.product.Product where id=" + item.product;
      var res5 = ObjectStore.queryByYonQL(sql5, "productcenter");
      products.push({ qty: item.qty, code: res5[0].code });
    }
    var pparam = {
      stockorgcode: res1[0].define1,
      source: res2[0].code,
      target: res3[0].code,
      time: pdata.vouchdate,
      products: products
    };
    let base_path = "https://www.example.com/";
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = { resdata: pparam };
    let func = extrequire("udinghuo.backDefaultGroup.getOpenApiToken");
    var token = func.execute("").access_token;
    let apiResponse = postman("post", base_path.concat("?access_token=" + token), JSON.stringify(header), JSON.stringify(body));
    //调用二开中的调入库单更新接口
    var token2 = func.execute("").access_token;
    let base_path2 = "https://www.example.com/";
    let body2 = {
      date: {
        id: pdata.id,
        defines: {
          id: pdata.id,
          define1: "true"
        }
      }
    };
    throw new Error(JSON.stringify(body2));
    let apiResponse2 = postman("post", base_path2.concat("?access_token=" + token2), JSON.stringify(header), JSON.stringify(body2));
    throw new Error(apiResponse2);
    var obj2 = JSON.parse(apiResponse2);
    if (obj2.code != "200") {
      throw new Error("更新失败!" + obj2.message);
    } else {
      if (obj2.data.code == "200") {
        return { code: 200 };
      } else {
        throw new Error("更新失败!" + obj2.data.message);
      }
    }
    //加判断
    var obj = JSON.parse(apiResponse);
    var code = obj.code;
    if (code != "200") {
      throw new Error("失败!" + obj.message);
    } else {
      if (obj.data.message.indexOf("成功") == -1) {
      } else {
        throw new Error("失败!" + obj.data.message);
      }
    }
    return { code: code };
  }
}
exports({ entryPoint: MyTrigger });