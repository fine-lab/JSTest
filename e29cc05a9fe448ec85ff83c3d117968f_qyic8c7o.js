let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 需要转移的数据
    const sql = "select id,custName from AT16A11A2C17080008.AT16A11A2C17080008.custInfo where isShow='1' and tenant_id = 'youridHere' and receiveIsTrue= '1' and receivePerson is not null limit 0,5";
    const res = ObjectStore.queryByYonQL(sql);
    // 对转移的数据名称做匹配，如果是中文字符的（），那么就加一个(),反之也如此
    let tempArr = [];
    res.forEach((item) => {
      if (item.custName && item.custName.includes("(")) {
        let willAddItem = JSON.parse(JSON.stringify(item));
        willAddItem.custName.replace("(", "（");
        willAddItem.custName.replace(")", "）");
        tempArr.push(willAddItem);
      }
      if (item.custName && item.custName.includes("（")) {
        let willAddItem = JSON.parse(JSON.stringify(item));
        willAddItem.custName.replace("（", "(");
        willAddItem.custName.replace("）", ")");
        tempArr.push(willAddItem);
      }
    });
    res.push(tempArr);
    let custNameStr = res.map((item) => "'" + item.custName + "'").join(",");
    // 获取客户数据
    const custSql = "select id,code from aa.merchant.Merchant where name in (" + custNameStr + ") limit 0,50000";
    const custRes = ObjectStore.queryByYonQL(custSql, "productcenter");
    // 获取客户id
    let custIdStr = custRes.map((item) => item.id);
    let arrraaa = [];
    custIdStr.forEach((id) => {
      let allObj = {
        clueRes: [],
        opptRes: [],
        contractRes: []
      };
      // 获取线索id
      const clueSql = "select id from sfa.clue.Clue where transCustomer = " + id;
      const clueRes = ObjectStore.queryByYonQL(clueSql, "yycrm");
      // 获取商机id
      const opptSql = "select id from sfa.oppt.Oppt where customer = " + id;
      const opptRes = ObjectStore.queryByYonQL(opptSql, "yycrm");
      // 获取联系人
      const contractSql = "select * from aa.merchant.Contacter where merchantId = " + id;
      const contractRes = ObjectStore.queryByYonQL(contractSql, "productcenter");
      allObj.clueRes.push(clueRes);
      allObj.opptRes.push(opptRes);
      allObj.contractRes.push(contractRes);
      arrraaa.push(allObj);
    });
    return {
      arrraaa
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});