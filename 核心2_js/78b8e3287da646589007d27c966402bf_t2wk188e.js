let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取客户编码
    var code = request.code;
    var res02 = [];
    var cc = 0;
    if (code != "all") {
      //依据编码查询客户表，然后依据客户表查询客户联系人
      let sql = "select id from aa.merchant.Merchant where code = '" + code + "'";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      let merchantId = res[0].id;
      let sql02 = "select * from aa.merchant.Contacter where merchantId ='" + merchantId + "' ";
      res02 = ObjectStore.queryByYonQL(sql02, "productcenter");
    } else {
      //基础模块：aa.merchant.Merchant    aa.merchant.Contacter  领域编码：productcenter
      let sql02 = "select code,name,customer,id,telephone  from  cust.contact.Contact " + " order by createDate desc   LIMIT 0,200";
      res02 = ObjectStore.queryByYonQL(sql02, "yycrm");
    }
    let json = {};
    if (res02 != undefined && res02.length > 0) {
      json.code = "200";
      json.message = "查询到客户[" + code + "]数据的联系人条数:" + res02.length;
      json.data = res02;
    } else {
      json.code = "404";
      json.message = "未查询到客户[" + code + "]数据的联系人数据";
    }
    return json;
  }
}
exports({ entryPoint: MyAPIHandler });