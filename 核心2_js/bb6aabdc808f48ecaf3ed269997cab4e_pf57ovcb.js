let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let httpURL = "https://c2.yonyoucloud.com"; //域名升级，世贸生产域名变量
    //返回数据结构
    let resJson = { code: 200, message: "" };
    let voucherNumCodeEntity = "AT17C47D1409580006.AT17C47D1409580006.VoucherNumCode";
    let voucherNumCodeBillnum = "ybc38ee7e9List";
    let appCode = "AT17C47D1409580006";
    //先删除未同步的数据
    let sqlid = "select id from " + voucherNumCodeEntity + " where statusLine=0";
    let delIds = ObjectStore.queryByYonQL(sqlid);
    var res = ObjectStore.deleteBatch(voucherNumCodeEntity, delIds, voucherNumCodeBillnum);
    //初始化时间范围
    //初始化账簿编码
    let accbookCode = "001";
    let accbookId = request.accbookId;
    let accbookBody = {
      fields: ["id", "code", "name"],
      pageIndex: 1,
      pageSize: 100,
      conditions: [
        {
          field: "id",
          value: accbookId,
          operator: "="
        }
      ]
    };
    let accbookUrl = httpURL + "/iuap-api-gateway/yonbip/fi/fipub/basedoc/querybd/accbook";
    let accbookResponse = openLinker("POST", accbookUrl, appCode, JSON.stringify(accbookBody));
    let accbookJson = JSON.parse(accbookResponse);
    if (accbookJson.code != 200) {
      resJson.code = 999;
      resJson.message = "账簿查询错误:" + accbookJson.message;
      return resJson;
    }
    if (accbookJson.total == 0) {
      resJson.code = 999;
      resJson.message = "账簿查询错误:" + accbookId;
      return resJson;
    } else {
      accbookCode = accbookJson.data[0].code;
    }
    //会计起始期间
    let accountPeriod = request.accountPeriod;
    let makeTimeStart = request.makeTimeStart;
    let makeTimeEnd = request.makeTimeEnd;
    //从凭证同步数据
    let maxPageSize = 1000;
    let body = {
      pager: { pageIndex: 1, pageSize: maxPageSize },
      accbookCode: accbookCode, //账簿编号
      voucherTypeCodeList: ["1", "2", "3"],
      voucherStatusList: ["04"], //凭证状态（00暂存，01保存，02错误，03已审核，04已记账，05作废，空值查全部）
      makeTimeStart: makeTimeStart, //起始制单日期
      makeTimeEnd: makeTimeEnd, ////截止制单日期
      periodStart: accountPeriod, //起始会计期间
      periodEnd: accountPeriod //截止制单日期
    };
    let url = httpURL + "/iuap-api-gateway/yonbip/fi/ficloud/openapi/voucher/queryVouchers";
    let apiResponse = openLinker("POST", url, appCode, JSON.stringify(body));
    let apiJson = JSON.parse(apiResponse);
    if (apiJson.code != 200) {
      resJson.code = 999;
      resJson.message = "凭证列表查询错误:" + apiJson.message;
      return resJson;
    }
    if (apiJson.data.recordList.length == 0) {
      resJson.code = 999;
      resJson.message = "凭证当前时间内，未查到数据";
      return resJson;
    }
    if (apiJson.data.recordCount >= maxPageSize) {
      resJson.code = 999;
      resJson.message = "筛选数据大于" + maxPageSize + ",请缩小数据同步范围";
      return resJson;
    }
    //查询已同步的数据
    let selectsql = "select voucherId from " + voucherNumCodeEntity + " where statusLine!=0 ";
    if (accountPeriod != null) {
      let accountPeriodSql = "and accountPeriod>='" + accountPeriod + "' and accountPeriod<='" + accountPeriod + "'";
      selectsql = join(selectsql, accountPeriodSql);
    }
    if (makeTimeStart != null) {
      let timeStartSql = "and makerDate>='" + makeTimeStart + "'";
      selectsql = join(selectsql, timeStartSql);
    }
    if (makeTimeEnd) {
      let timeEndSql = "and makerDate<='" + makeTimeEnd + "'";
      selectsql = join(selectsql, timeEndSql);
    }
    let selectIds = ObjectStore.queryByYonQL(selectsql);
    //向凭证号sap编码表插入数据
    var insertDatas = [];
    for (var i = 0; i < apiJson.data.recordList.length; i++) {
      var rowData = apiJson.data.recordList[i];
      let isAdd = true;
      for (var x = 0; x < selectIds.length; x++) {
        if (selectIds[x].voucherId == rowData.header.id) {
          isAdd = false;
          break;
        }
      }
      if (isAdd) {
        // 获取来源单据编号
        let description = rowData.body[0].description;
        let descriptionSplit = split(description, "-", 2);
        let descriptionArr = JSON.parse(descriptionSplit);
        if (descriptionArr.length >= 1) {
          var descriptionBody = descriptionArr[0];
        }
        var newData = {
          voucherId: rowData.header.id,
          accbookId: rowData.header.accbook.id,
          accountPeriod: rowData.header.period,
          makerDate: rowData.header.maketime,
          voucherNumberYs: rowData.header.displayname,
          billCode: rowData.header.billcode,
          voucherTypeCode: rowData.header.vouchertype.code,
          descriptionBody: descriptionBody, // 来源单据编号
          statusLine: 0
        };
        insertDatas.push(newData);
      }
    }
    var res = ObjectStore.insertBatch(voucherNumCodeEntity, insertDatas, voucherNumCodeBillnum);
    return resJson;
  }
}
exports({ entryPoint: MyAPIHandler });