let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    //每天更新开始
    let startdtNow = new Date();
    startdtNow.setTime(startdtNow.getTime() - 30 * 24 * 60 * 60 * 1000); //当天日期减1天，天*小时*分钟*秒*毫秒
    let makeTimeStart = startdtNow.toJSON().substr(0, 10);
    let makedatastart = replace(makeTimeStart, "-", "");
    let enddtNow = new Date();
    let makeTimeEnd = enddtNow.toJSON().substr(0, 10);
    let makedataend = replace(makeTimeEnd, "-", "");
    //每天更新结束
    let codenumber = "";
    let codesql = "";
    if (param != null) {
      if (param.codenumber != null) {
        codenumber = param.codenumber;
        codesql = " and code ='" + codenumber + "'";
      }
      if (param.makeTimeStart != null) {
        makedatastart = param.makeTimeStart;
      }
      if (param.makeTimeEnd != null) {
        makedataend = param.makeTimeEnd;
      }
    }
    //入库调整单主表查询
    let sqlidPa = "select id,srcitem,accentity,code,vouchdate,period" + " from ia.adjust.InAdjustVO where  vouchdate >= '" + makedatastart + "' and  vouchdate <= '" + makedataend + "'" + codesql;
    let resdataPa = ObjectStore.queryByYonQL(sqlidPa, "fiia");
    var insertDatas = [];
    if (resdataPa.length <= 0) {
      throw new Error("当前条件下没有需要同步的数据!");
    } else {
      for (let i = 0; i < resdataPa.length; i++) {
        let entityJson = resdataPa[i];
        var newData = {};
        var srcitemArr = {
          1: "手工",
          2: "自动生成",
          3: "库存",
          4: "成本管理",
          5: "手工"
        };
        newData["billid"] = entityJson.id; //主键ID
        newData["srcitem"] = srcitemArr[entityJson.srcitem]; //事项来源
        newData["makedate"] = entityJson.vouchdate; //单据日期
        newData["codenumber"] = entityJson.code; //单据编号
        newData["period"] = entityJson.period; //会计期间
        //入库调整单子表查询
        let sqlidSon = "select id, topsrcbillno,srcbillno,adjustmoney,material,srcbillitemno" + " from ia.adjust.InAdjustBodyVO " + "where header ='" + entityJson.id + "'";
        let resdataSon = ObjectStore.queryByYonQL(sqlidSon, "fiia");
        let srcbillno = "--";
        let material = "";
        let srcbillitemno = "";
        if (resdataSon.length > 0) {
          if (resdataSon[0].srcbillno != null) {
            srcbillno = resdataSon[0].srcbillno;
          }
          material = resdataSon[0].material; //物料id
          srcbillitemno = resdataSon[0].srcbillitemno; //来源单据行号
          newData["procureorderno"] = resdataSon[0].topsrcbillno; //源头单据号-采购订单编号
          newData["adjustmoney"] = resdataSon[0].adjustmoney; //调整金额
          newData["buyordernumber"] = srcbillno; //来源单据号-采购入库单号
        }
        let body = {
          pager: { pageIndex: 1, pageSize: "10" },
          code: srcbillno, //来源单号
          product_cName: material, //物料id
          "purInRecords.uplineno": srcbillitemno + "0" //来源单据行号
        };
        //采购入库列表查询--获取发票
        let url = "https://www.example.com/";
        let apiResponse = openLinker("POST", url, "AT19899ED209780001", JSON.stringify(body));
        let apiJson = JSON.parse(apiResponse).data.recordList;
        if (apiJson.length > 0) {
          newData["productcCode"] = apiJson[0].product_cCode; //物料编码
          newData["productcName"] = apiJson[0].product_cName; //物料名称
          newData["accentity"] = apiJson[0].accountOrg_name; //会计主体
          newData["invoicevalue"] = apiJson[0].totalBillOriSum; //发票金额
        }
        var objectSel = { billid: newData.billid };
        var resSelect = ObjectStore.selectByMap("AT19899ED209780001.AT19899ED209780001.InAdjustAll", objectSel);
        if (resSelect.length == 0) {
          var saveResponse = ObjectStore.insert("AT19899ED209780001.AT19899ED209780001.InAdjustAll", newData, "yb76a9a688List");
        } else {
          resSelect[0]["buyordernumber"] = newData.buyordernumber;
          resSelect[0]["invoicevalue"] = newData.invoicevalue;
          var updateRes = ObjectStore.updateById("AT19899ED209780001.AT19899ED209780001.InAdjustAll", resSelect, "yb76a9a688List");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });