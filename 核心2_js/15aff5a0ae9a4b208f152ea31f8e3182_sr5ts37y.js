let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sql = "select * from AT1665917408780003.AT1665917408780003.XSFPDR_BT where verifystate = 2 and shifoushengchengfapiao ='1'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    if (result[0]) {
      //查询20条子表id和行id 汇总
      var sqlC = "select distinct chukuId from AT1665917408780003.AT1665917408780003.XSFADR_MX where  XSFPDR_BT_id= '" + result[0].id + "' and sfscfp is null  order by chukuId desc limit 20";
      var resultC = ObjectStore.queryByYonQL(sqlC, "developplatform");
      //调用生成发票接口
      if (resultC[0]) {
        for (let chuku = 0; chuku < resultC.length; chuku++) {
          var sqlCe =
            "select detaisId,id from AT1665917408780003.AT1665917408780003.XSFADR_MX where  chukuId= '" + resultC[chuku].chukuId + "' and XSFPDR_BT_id= '" + result[0].id + "' and sfscfp is null";
          var resultCe = ObjectStore.queryByYonQL(sqlCe, "developplatform");
          var bpmTaskActions = [];
          for (let j = 0; j < resultCe.length; j++) {
            var sqlCv =
              "select ziduan16,fapiaohaoma,shijikaipiaoriqi from AT1665917408780003.AT1665917408780003.XSFADR_MX where detaisId='" + resultCe[j].detaisId + "' and XSFPDR_BT_id=" + result[0].id;
            var resultCv = ObjectStore.queryByYonQL(sqlCv, "developplatform");
            var detail = {
              qty: resultCv[0].ziduan16,
              sourceid: resultC[chuku].chukuId,
              sourceautoid: resultCe[j].detaisId,
              memo: result[0].code + "/" + resultCv[0].fapiaohaoma + "/" + resultCv[0].shijikaipiaoriqi,
              saleInvoiceDetailDefineCharacter: {
                attrext8: result[0].code,
                attrext9: resultCv[0].fapiaohaoma,
                attrext10: resultCv[0].shijikaipiaoriqi
              },
              _status: "Insert"
            };
            bpmTaskActions.push(detail);
          }
          //获取当前时间
          var timezone = 8; //目标时区时间，东八区
          var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
          var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
          var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
          let body = {
            data: {
              resubmitCheckKey: date.valueOf(),
              transactionTypeId: "yourIdHere",
              vouchdate: result[0].danjuriqi,
              invoiceAsynTaxMark: true,
              isNotSendTax: false,
              modifyInvoiceType: true,
              saleInvoiceDetails: bpmTaskActions,
              _status: "Insert"
            }
          };
          //拿销售出货单数据调用销售发票生成接口，生成发票
          let url = "https://www.example.com/";
          let apiResponse = openLinker("POST", url, "AT1665917408780003", JSON.stringify(body));
          //清空子表集合
          bpmTaskActions = [];
          //回写子表行状态
          var XSFADR_MXList = [];
          for (const rowId of resultCe) {
            var MXList = {
              id: rowId.id,
              sfscfp: "2",
              _status: "Update"
            };
            XSFADR_MXList.push(MXList);
          }
          var objectMXList = { id: result[0].id, XSFADR_MXList: XSFADR_MXList };
          var resMXList = ObjectStore.updateById("AT1665917408780003.AT1665917408780003.XSFPDR_BT", objectMXList, "15cc9bfe");
          XSFADR_MXList = [];
        }
      } else {
        var object = { id: result[0].id, shifoushengchengfapiao: "2" };
        var res = ObjectStore.updateById("AT1665917408780003.AT1665917408780003.XSFPDR_BT", object, "15cc9bfe");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });