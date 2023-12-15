let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var updateStatusObj = request.updateStatusObj;
    let configParamsFun = extrequire("AT160194EA17D00009.api.configParamsFun");
    let configParams = configParamsFun.execute(request.envUrl).configParams;
    let body = JSON.stringify({ data: updateStatusObj });
    //查询采购入库单数据
    let sql = "select *,  records.id recordsid,records.rowno  rowno, records.product product,records.invExchRate invExchRate,records.unitExchangeType  unitExchangeType,";
    sql +=
      " records.stockUnitId stockUnitId, records.unitExchangeTypePrice unitExchangeTypePrice,	records.invPriceExchRate  invPriceExchRate, records.priceUOM priceUOM,records.taxitems  taxitems,records.autoCalcCost  autoCalcCost , records.qty arrivalNum";
    sql += " from st.purinrecord.PurInRecord left join  st.purinrecord.PurInRecords records on id = records.mainid  ";
    let updateResponse = [];
    let result = ObjectStore.queryByYonQL(sql, "ustock");
    let apiResponse = [];
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < updateStatusObj.length; j++) {
        if (result[i].id == updateStatusObj[j].id) {
          updateStatusObj[j].id = result[i].id;
          updateStatusObj[j].org = result[i].org;
          updateStatusObj[j].purchaseOrg = result[i].purchaseOrg;
          updateStatusObj[j].accountOrg = result[i].accountOrg;
          updateStatusObj[j].inInvoiceOrg = result[i].inInvoiceOrg;
          updateStatusObj[j].vouchdate = result[i].vouchdate;
          updateStatusObj[j].bustype = result[i].bustype;
          updateStatusObj[j].warehouse = result[i].warehouse;
          updateStatusObj[j].vendor = result[i].vendor;
          updateStatusObj[j].currency = result[i].currency;
          updateStatusObj[j].natCurrency = result[i].natCurrency;
          updateStatusObj[j].exchRateType = result[i].exchRateType;
          updateStatusObj[j].exchRate = result[i].exchRate;
          updateStatusObj[j].resubmitCheckKey = MD5Encode(uuid());
          updateStatusObj[j].purInRecords = [];
          let purInRecordsdata = {};
          purInRecordsdata.id = result[i].recordsid;
          purInRecordsdata.rowno = result[i].rowno;
          purInRecordsdata.product = result[i].product;
          purInRecordsdata.invExchRate = result[i].invExchRate;
          purInRecordsdata.unitExchangeType = result[i].unitExchangeType;
          purInRecordsdata.stockUnitId = result[i].stockUnitId;
          purInRecordsdata.unitExchangeTypePrice = result[i].unitExchangeTypePrice;
          purInRecordsdata.invPriceExchRate = result[i].invPriceExchRate;
          purInRecordsdata.priceUOM = result[i].priceUOM;
          purInRecordsdata.autoCalcCost = result[i].autoCalcCost;
          purInRecordsdata.qty = result[i].arrivalNum;
          purInRecordsdata.taxitems = result[i].taxitems || "";
          purInRecordsdata._status = "Update";
          purInRecordsdata.extendGapSettleMark = updateStatusObj[j].gapSettlementMark;
          updateStatusObj[j].purInRecords.push(purInRecordsdata);
          let url = "https://www.example.com/";
          let apiResponse = openLinker("POST", url, "AT160194EA17D00009", JSON.stringify({ data: updateStatusObj[j] }));
          if (JSON.parse(apiResponse).code != "200") {
            updateResponse.push(JSON.parse(apiResponse));
          }
        }
      }
    }
    return { updateResponse };
  }
}
exports({ entryPoint: MyAPIHandler });