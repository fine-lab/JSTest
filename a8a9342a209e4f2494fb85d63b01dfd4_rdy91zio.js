let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取crm收款单token
    const crm_token_Url = "https://www.example.com/";
    const crm_Url = "https://www.example.com/";
    const objName = "skls";
    const token_body = {
      client_id: "youridHere",
      client_secret: "yoursecretHere",
      password: "yourpasswordHere",
      username: "https://www.example.com/",
      grant_type: "password",
      redirect_uri: "https://api.tencent.xiaoshouyi.com"
    };
    var crm_token_link = postman("post", crm_token_Url, null, JSON.stringify(token_body));
    var crm_token_link_value = JSON.parse(crm_token_link);
    var crm_receipt_token = crm_token_link_value.access_token;
    var crm_header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + crm_receipt_token
    };
    let data = request.data;
    let message = "";
    let hasLegal = false;
    for (var i = 0; i < data.length; i++) {
      let rows = new Array();
      let sql = "select id,amount from voucher.upaymentvoucher.PaymentVerification where verificationType = 1 and orderId ='" + data[i].code + "'";
      let res = ObjectStore.queryByYonQL(sql);
      if (res.length == 0) {
        message += "单据编号:" + data[i].orderCode + "不存在支付类型为余额支付的数据" + "\n";
        continue;
      }
      for (var j = 0; j < res.length; j++) {
        let item = {
          orderCode: data[i].orderCode,
          code: res[j].id,
          receiptDate: data[i].receiptDate,
          totalprice: res[j].amount,
          homeAmount: res[j].amount,
          receiptType: data[i].receiptType,
          status: 1
        };
        rows.push(item);
        hasLegal = true;
      }
      var crm_body = {
        objName: objName,
        rows: rows
      };
      var crm_link = postman("post", crm_Url, JSON.stringify(crm_header), JSON.stringify(crm_body));
    }
    //将参数推送给crm接口
    let result = "";
    if (message.length == 0) {
      result += "所有单据余额回传成功";
      return { result };
    }
    if (hasLegal) {
      message += "其余合法单据余额回传成功";
      result += message;
      return { result };
    }
    result = message;
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });