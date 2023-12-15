let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let rep = {
        code: 0,
        msg: ""
      };
      let orderNo = request.cCode; //u8采购订单号
      let sql = "";
      sql = "select id,POPomainCodeYS from AT1767B4C61D580001.AT1767B4C61D580001.rdrecord_01 where Iarriveid='" + orderNo + "'";
      let res1 = ObjectStore.queryByYonQL(sql);
      let res2 = null;
      if (res1.length > 0) {
        var object = { id: res1[0].id };
        res2 = ObjectStore.deleteById("AT1767B4C61D580001.AT1767B4C61D580001.rdrecord_01", object, "yb89b91af0"); //POPomainCodeU8   OrderON
        //更新累计入库数量
        let POPomainCodeYS = res1[0].POPomainCodeYS;
        sql =
          "select  POPomainCodeYS POPomainCodeYS,b.PO_Podetails_id PO_Podetails_id,sum(b.Rd_Count)  Rd_Count from AT1767B4C61D580001.AT1767B4C61D580001.rdrecord_01 a inner join AT1767B4C61D580001.AT1767B4C61D580001.rdrecords b on a.id=b.rdrecord_01_id where 1=1 and(dr=0)  and POPomainCodeYS='" +
          POPomainCodeYS +
          "' GROUP BY(b.PO_Podetails_id,POPomainCodeYS)";
        var res = ObjectStore.queryByYonQL(sql);
        let ReceiptNum = 0;
        sql =
          "select code,b.id deid from AT1767B4C61D580001.AT1767B4C61D580001.PO_Pomain inner join AT1767B4C61D580001.AT1767B4C61D580001.PO_Podetails b on id=b.PO_Pomain_id where code='" +
          POPomainCodeYS +
          "'";
        var res5 = ObjectStore.queryByYonQL(sql); //采购订单采购累计入库数量更新为0;
        // 更新条件
        var updateWrapper2 = new Wrapper();
        updateWrapper2.eq("code", POPomainCodeYS);
        // 待更新字段内容
        var toUpdate2 = {
          PO_PodetailsList: []
        };
        for (let i = 0; i < res5.length; i++) {
          let deid = res5[i].deid;
          toUpdate2.PO_PodetailsList.push({
            id: deid,
            AddNum: 0,
            _status: "Update"
          });
        }
        ObjectStore.update("AT1767B4C61D580001.AT1767B4C61D580001.PO_Pomain", toUpdate2, updateWrapper2, "yb30647a2f");
        // 更新条件
        var updateWrapper = new Wrapper();
        updateWrapper.eq("code", POPomainCodeYS);
        // 待更新字段内容
        var toUpdate = {
          ReceiptNum: 0,
          PO_PodetailsList: []
        };
        for (let i = 0; i < res.length; i++) {
          let Rd_Count = res[i].Rd_Count;
          ReceiptNum += parseFloat(Rd_Count);
          toUpdate.PO_PodetailsList.push({
            id: res[i].PO_Podetails_id,
            AddNum: Rd_Count,
            _status: "Update"
          });
        }
        toUpdate.ReceiptNum = ReceiptNum;
        ObjectStore.update("AT1767B4C61D580001.AT1767B4C61D580001.PO_Pomain", toUpdate, updateWrapper, "yb30647a2f");
      }
      rep.code = 0;
      return rep;
    } catch (e) {
      return {
        code: 500,
        msg: e.message
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });