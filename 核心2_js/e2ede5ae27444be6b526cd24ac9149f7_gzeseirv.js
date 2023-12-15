let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取数据
    let data = param.data;
    if (data) {
      //获取token
      let getUapToken = "https://www.example.com/";
      //友企联接口调用
      let tokenReq = openLinker("POST", getUapToken, "SCMSA", null);
      if (tokenReq) {
        //调用获取nc信用额度的接口的请求路径
        let getCreditUrl = "https://www.example.com/";
        //循环，将参数拼接在请求路径上
        for (let prop in tokenReq) {
          getCreditUrl += prop + "=" + tokenReq[prop];
        }
        //用于存放请求体的参数
        let creditParm = [];
        let custMap = new Map();
        data.forEach((ship) => {
          let res = ObjectStore.queryByYonQL(
            "select code,salesOrgId.code saleorgcode,settlementOrgId.code financeorgcode,agentId.code agentcode,totalMoney from voucher.delivery.DeliveryVoucher where id=" + ship.id
          );
          //封装参数
          creditParm.push({
            saleorgcode: res[0].saleorgcode,
            financeorgcode: res[0].financeorgcode,
            customercode: res[0].agentcode
          });
          if (custMap.get(res.agentcode)) {
            custMap.get(res.agentcode).push(creditParm);
          } else {
            custMap.set(res.agentcode, [res]);
          }
        });
        //调用接口获取nc信用额度
        let creditReq = openLinker("POST", getCreditUrl, "SCMSA", JSON.stringify(creditParm));
        //判断信用是否超出
        if (creditReq && creditReq.length > 0) {
          creditReq.forEach((credit) => {
            custMap.get(credit.ccustomercode).forEach((ship) => {
              if (credit.csaleorgcode === ship.saleorgcode) {
                if (totalMoney > credit.nbalancemny) {
                  //超出信用
                  throw new Error("单号" + ship.code + "信用超标,可用信用：" + credit.nbalancemny);
                }
              }
            });
          });
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });