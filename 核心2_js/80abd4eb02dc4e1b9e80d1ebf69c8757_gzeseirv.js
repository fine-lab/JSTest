let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取单据数据
    let data = param.data;
    //单据总金额
    let totalMoney = null;
    //存放获取nc信用额度的接口请求参数
    let creditParm = [];
    if (data) {
      //获取access_token
      let func1 = extrequire("SCMSA.common.getOpenApiToken");
      let res = func1.execute(param);
      let access_token = res.access_token;
      let uap_usercode = null;
      let uap_token = null;
      let uap_dataSource = null;
      //获取uap_token
      let getUapToken = "https://www.example.com/";
      let tokenReq = openLinker("POST", getUapToken, "SCMSA", null);
      if (tokenReq) {
        tokenReq = JSON.parse(tokenReq);
        uap_usercode = tokenReq.uap_usercode;
        uap_token = tokenReq.uap_token;
        uap_dataSource = tokenReq.uap_dataSource;
      }
      let getCreditUrl =
        "https://www.example.com/" +
        uap_usercode +
        "&uap_token=" +
        uap_token +
        "&uap_dataSource=" +
        uap_dataSource +
        "&access_token=" +
        access_token;
      data.forEach((ship) => {
        var sql1 = "select totalMoney,settlementOrgId.code financeorgcode,agentId.code agentcode from voucher.delivery.DeliveryVoucher where id=" + ship.id;
        var sql2 = "select detailSalesOrgId.code saleorgcode from voucher.delivery.DeliveryDetail where deliveryId=" + ship.id;
        let res1 = ObjectStore.queryByYonQL(sql1);
        let res2 = ObjectStore.queryByYonQL(sql2);
        let saleorgcode = res2[0].saleorgcode;
        let financeorgcode = res1[0].financeorgcode;
        let customercode = res1[0].agentcode;
        //封装参数
        let obj = {
          saleorgcode: res2[0].saleorgcode,
          financeorgcode: res1[0].financeorgcode,
          customercode: res1[0].agentcode
        };
        creditParm.push(obj);
        //调用接口获取nc信用额度
        let creditResult = postman("POST", getCreditUrl, null, JSON.stringify(creditParm));
        if (includes(creditResult, "[")) {
          let creditReq = JSON.parse(creditResult);
          if (creditReq && creditReq.length > 0) {
            for (let i = 0; i < creditReq.length; i++) {
              for (let j = 0; j < creditParm.length; j++) {
                if (creditReq[i].ccustomercode === creditParm[j].customercode && creditReq[i].csaleorgcode === creditParm[j].saleorgcode) {
                  //查询所有发货已审的单据占用的信用额度之和
                  let sumsql =
                    "select sum(totalMoney) as sum from voucher.delivery.DeliveryVoucher where statusCode='DELIVERING' and salesOrgId.code=" +
                    "'" +
                    creditParm[j].saleorgcode +
                    "'" +
                    " and agentId.code=" +
                    "'" +
                    creditParm[j].customercode +
                    "'";
                  let sumsqlResult = ObjectStore.queryByYonQL(sumsql);
                  //所有发货已审的发货单占用额度总和
                  let occupation = null;
                  if (sumsqlResult && sumsqlResult.length > 0) {
                    occupation = sumsqlResult[0].sum;
                  } else {
                    occupation = 0;
                  }
                  let remaining = creditReq[i].nbalancemny;
                  //当前可用额度
                  let available = remaining - occupation;
                  //判断信用额度是否超过
                  if (totalMoney > available) {
                    throw new Error("单号" + data[i].code + "信用超标,可用信用：" + available);
                  } else {
                    throw new Error("单号" + data[i].code + "信用额度为" + remaining + ",占用额度为" + occupation);
                  }
                }
              }
            }
          }
        }
      });
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});