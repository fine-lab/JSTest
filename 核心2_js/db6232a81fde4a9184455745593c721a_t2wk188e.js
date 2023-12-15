let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前用户的身份信息-----------
    var currentUser = JSON.parse(AppContext()).currentUser;
    var orgBillData = request.data;
    var orgBillChildData = orgBillData.st_check_bList;
    var access_token = request.access_token;
    var suffix = "?access_token=" + access_token;
    var msgIn = "",
      msgOut = "",
      msgCK = "";
    var mode = "POST";
    var otherInChildData_T = [];
    var otherOutChildData_T = [];
    var t1 = 0,
      t2 = 0;
    for (let i = 0; i < orgBillChildData.length; i++) {
      var invData = orgBillChildData[i];
      t1 = invData.bookqty;
      t2 = invData.checkqty;
      if (t1 > t2) {
        invData.outqty = t1 - t2;
        otherOutChildData_T.push(invData);
      }
      if (t1 < t2) {
        invData.inqty = t2 - t1;
        otherInChildData_T.push(invData);
      }
    }
    let otherInUrl = "https://www.example.com/" + suffix;
    let othInRecords = [];
    for (let i = 0; i < otherInChildData_T.length; i++) {
      let child = otherInChildData_T[i];
      let otherInRecord = {};
      otherInRecord.product = child.invid;
      otherInRecord.product_cCode = child.invcode;
      otherInRecord.product_cName = child.invname;
      otherInRecord.productsku = child.skuid;
      otherInRecord.productsku_cCode = child.skucode;
      otherInRecord.productsku_cName = child.skuname;
      otherInRecord.qty = child.inqty;
      //计量单位
      otherInRecord.unit = child.unitid;
      //库存计量单位
      otherInRecord.stockUnitId = child.unitid;
      //交易类型
      otherInRecord.bustype = "A08002";
      othInRecords.push(otherInRecord);
    }
    if (othInRecords.length > 0) {
      var otherBillData = {};
      //单据编号
      otherBillData.code = "QTRK" + makeCodeFromDate();
      //库存组织id，或库存组织code
      otherBillData.org = orgBillData.org_id;
      //会计主体id，或会计主体code
      otherBillData.accountOrg = orgBillData.org_id;
      //单据日期,时间戳
      otherBillData.vouchdate = formatDateTime(new Date());
      //仓库id，或仓库code
      otherBillData.warehouse = orgBillData.warecode;
      //交易类型
      otherBillData.bustype = "A08002";
      //操作标识, Insert:新增、Update:更新
      otherBillData._status = "Insert";
      //制单人
      otherBillData.creator = currentUser.name;
      otherBillData.creatorid = currentUser.staffid;
      //其他入库单子表
      otherBillData.othInRecords = othInRecords;
      let jsonStr = JSON.stringify(otherBillData);
      console.log(jsonStr);
      msgIn = CallAPI(mode, otherInUrl, { data: otherBillData });
      console.log(JSON.stringify(msgIn));
    }
    let otherOutUrl = "https://www.example.com/" + suffix;
    let othOutRecords = [];
    for (let i = 0; i < otherOutChildData_T.length; i++) {
      let child = otherOutChildData_T[i];
      let otherOutRecord = {};
      otherOutRecord.product = child.invid;
      otherOutRecord.product_cCode = child.invcode;
      otherOutRecord.product_cName = child.invname;
      otherOutRecord.productsku = child.skuid;
      otherOutRecord.productsku_cCode = child.skucode;
      otherOutRecord.productsku_cName = child.skuname;
      otherOutRecord.qty = child.outqty;
      //计量单位
      otherOutRecord.unit = child.unitid;
      otherOutRecord.stockUnitId = child.unitid;
      //交易类型
      otherOutRecord.bustype = "A10002";
      othOutRecords.push(otherOutRecord);
    }
    if (othOutRecords.length > 0) {
      var otherBillData = {};
      //单据编号
      otherBillData.code = "QTCK" + makeCodeFromDate();
      //库存组织id，或库存组织code
      otherBillData.org = orgBillData.org_id;
      //会计主体id，或会计主体code
      otherBillData.accountOrg = orgBillData.org_id;
      //单据日期,时间戳
      otherBillData.vouchdate = formatDateTime(new Date());
      //仓库id，或仓库code
      otherBillData.warehouse = orgBillData.warecode;
      //交易类型
      otherBillData.bustype = "A10002";
      //操作标识, Insert:新增、Update:更新
      otherBillData._status = "Insert";
      //制单人
      otherBillData.creator = currentUser.name;
      otherBillData.creatorid = currentUser.staffid;
      //其他出库单子表
      otherBillData.othOutRecords = othOutRecords;
      console.log("其他出库单数据:" + JSON.stringify(otherBillData));
      msgOut = CallAPI(mode, otherOutUrl, { data: otherBillData });
      console.log("其他出库单执行结果:" + JSON.stringify(msgOut));
    }
    let bFlag = false;
    let ids = "";
    if (msgIn !== "" && msgIn.data.failCount === 0) {
      bFlag = true;
      ids = msgIn.data.infos[0].id;
    }
    if (msgOut !== "" && msgOut.data.failCount === 0) {
      bFlag = true;
      ids += ":" + msgOut.data.infos[0].id;
    }
    let res = {};
    if (bFlag) {
      res = ObjectStore.updateById("GT15688AT14.GT15688AT14.st_check_h", { id: orgBillData.id, verifystate: 2, ids: ids, _status: "Update" });
    }
    //设置时间带时分秒
    function formatDateTime(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
    }
    //依据日期生成编码
    function makeCodeFromDate() {
      var date = new Date();
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return y + "" + m + "" + d + "" + hh + "" + mm + "" + ss;
    }
    function CallAPI(mode, url, param) {
      //请求头
      var header = { "Content-Type": "application/json" };
      var strResponse = postman(mode, url, JSON.stringify(header), JSON.stringify(param));
      //返回数据
      return JSON.parse(strResponse);
    }
    console.log("审核结果:" + res);
    res.flag = bFlag;
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });