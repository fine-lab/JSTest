let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data[0];
    let billnum = param.billnum;
    if (data) {
      var currentUser = JSON.parse(AppContext()).currentUser;
      //获取tekon
      let soData = [];
      let today = new Date(data.vouchdate);
      let month = today.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
      let hours = today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
      let mins = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
      let secs = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
      let date = today.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + mins + ":" + secs;
      let soH = {
        pk_org: data.st_salesout_userDefine002,
        cemployeeid: data.st_salesout_userDefine004,
        dmakedate: date,
        ccustomerid: data.st_salesout_userDefine001,
        cdeptid: data.st_salesout_userDefine003,
        dbilldate: date,
        vnote: "",
        vtrantypecode: "30-01",
        vbillcode: data.code
      };
      let soBs = [];
      for (let i = 0; i < data.details.length; i++) {
        let line = data.details[i];
        let sob = {
          crowno: line.rowno,
          nqtorigtaxprice: "10",
          nnum: line.qty,
          nastnum: line.subQty,
          nqtunitnum: line.priceQty,
          castunitid: line.st_salesouts_userDefine001,
          cunitid: line.st_salesouts_userDefine002,
          cmaterialvid: line.product_cCode,
          cmaterialid: line.product_cCode,
          nqtorigtaxprice: line.oriTaxUnitPrice,
          dsenddate: date
        };
        soBs.push(sob);
      }
      let paraData = [];
      paraData.push({ so_saleorder: soH, so_saleorder_b: soBs });
      throw new Error(JSON.stringify(paraData));
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", getTokenUrl, "AppCode", JSON.stringify(param));
      throw new Error(JSON.stringify(strResponse));
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });