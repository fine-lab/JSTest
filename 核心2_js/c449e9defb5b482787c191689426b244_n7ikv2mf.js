let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var formatDate = function (date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    };
    let body = {};
    let header = {};
    let strResponse = postman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    let gatewayUrl = JSON.parse(strResponse).data.gatewayUrl;
    let tokenUrl = JSON.parse(strResponse).data.tokenUrl;
    let curTime = formatDate(new Date()); //'2023-08-14';
    let sql = "select * from AT17E908FC08280001.AT17E908FC08280001.yccontract_detail where  dr=0 and (updateDate<>'" + curTime + "' or updateDate is null) limit 0,20"; //
    var res = ObjectStore.queryByYonQL(sql);
    let ycConUrl = gatewayUrl + "/n7ikv2mf/commonProductCls/commonProduct/yccontract/querysale";
    let updateData = [];
    for (let ii = 0; ii < res.length; ii++) {
      let purchase_code = res[ii].purchase_code; //'BJ2208260001S1W01';//
      ycConUrl =
        "https://www.example.com/" +
        purchase_code +
        "&token=QWxkLVFXUUNIeS1nWlNSaUJ1YndIYXNBVk1wUVl4V21lSlgtc1dhZk1DUlJrX0ZaU0NIa2ZYeTZaRkhucVZJcQ==";
      let apiResponse = postman("get", ycConUrl, JSON.stringify({}), JSON.stringify({}));
      let datas = JSON.parse(apiResponse).data;
      if (datas && datas.length > 0) {
        let data = datas[0];
        updateData.push({
          id: res[ii].id,
          purchase_amount: data.purchase_amount,
          purchase_income_amount: data.purchase_income_amount,
          purchase_pay_amount: data.purchase_pay_amount,
          sale_amount: data.sale_amount,
          sale_contract_code: data.sale_contract_code,
          sale_income_amount: data.sale_income_amount,
          sale_rec_amount: data.sale_rec_amount,
          pro_progress: data.pro_progress,
          updateDate: curTime
        });
      } else {
        updateData.push({
          id: res[ii].id,
          updateDate: curTime
        });
      }
    }
    let eee;
    if (updateData.length > 0) {
      eee = ObjectStore.updateBatch("AT17E908FC08280001.AT17E908FC08280001.yccontract_detail", updateData, "yb1e1b6db5");
    }
    return { res, updateData, eee };
  }
}
exports({ entryPoint: MyAPIHandler });