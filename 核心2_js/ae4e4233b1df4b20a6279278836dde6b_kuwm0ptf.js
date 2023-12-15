let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ybresult = request.data;
    var nowdate = request.date1;
    let func1 = extrequire("st.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var reqEquipsaveurl = "https://www.example.com/" + token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var equipArray = new Array();
    var pk_org = ybresult.salesOrg; //销售组织
    var code = ybresult.code; //出库单编码
    var cust = ybresult.cust; //客户
    var cReceiveAddress = ybresult.cReceiveAddress; //收货地址
    var vouchdate = ybresult.vouchdate; //单据日期
    var details = ybresult.details;
    details.forEach((detail) => {
      var productname = detail.product_cName; //物料名称
      var detailsId = detail.details_id; //子表主键
      var modelDescription = detail.modelDescription; //规格说明
      var product_model = detail.product_model; //型号
      var sns = detail.salesOutsSNs;
      if (sns != null && sns.length > 0) {
        sns.forEach((snvo) => {
          var sn = snvo.sn;
          var equipbody = {
            pk_org: pk_org,
            equip_code: sn,
            serial_num: sn,
            spec: modelDescription,
            model: product_model,
            customer: cust,
            install_address: cReceiveAddress,
            purchase_date: substring(vouchdate, 0, 10),
            equip_name: {
              zh_CN: productname
            },
            pk_used_status: "01",
            _status: "Insert"
          };
          equipArray.push(equipbody);
        });
      }
    });
    if (equipArray.length > 0) {
      var equipdata = {
        data: equipArray
      };
      var equipResponse = postman("Post", reqEquipsaveurl, JSON.stringify(header), JSON.stringify(equipdata));
      var equipResponseObj = JSON.parse(equipResponse);
      if ("200" == equipResponseObj.code || equipResponseObj == "") {
        var equipdata = equipResponseObj.data;
        let messages = equipdata.messages;
        messages.forEach((msg) => {
          if (message == "") {
            message = msg;
          } else {
            message = message + ";" + msg;
          }
        });
      }
    } else {
      message = "没有符合条件的生单数据";
    }
    return { message: message };
  }
}
exports({ entryPoint: MyAPIHandler });