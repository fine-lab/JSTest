let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var accessToken;
    let jk_id = JSON.parse(param.requestData).id;
    var jk_code = JSON.parse(param.requestData).code;
    let productClassSql =
      "select srcbillid,srcbillno,srcbillitemid,topsrcbillitemid,topsrcbillno,mainid.createTime,mainid.modifyTime,mainid.paytime,mainid.settledate,mainid.auditTime,mainid.pubts from arap.receivebill.ReceiveBill_b where mainid.code = '" +
      jk_code +
      "'  ";
    let productClassInfo = ObjectStore.queryByYonQL(productClassSql, "fiarap");
    let srcbillno = productClassInfo[0].srcbillno;
    let jksql =
      "select srcbillid,srcbillno,srcbillitemid,topsrcbillitemid,topsrcbillno,mainid.createTime,mainid.modifyTime,mainid.paytime,mainid.settledate,mainid.auditTime,mainid.pubts from arap.receivebill.ReceiveBill_b where topsrcbillno = '" +
      srcbillno +
      "'  and mainid.code != '" +
      jk_code +
      "' ";
    let hxdate = "";
    let updateSaleOrderParam = [];
    let orderno = "";
    if (srcbillno === undefined || srcbillno === null) {
      return "";
    } else {
      if (includes(srcbillno, "UR-")) {
        orderno = saleReturnByCode({ code: srcbillno }).orderNo;
      } else {
        orderno = srcbillno;
      }
    }
    let jkvo = ObjectStore.queryByYonQL(jksql, "fiarap");
    let orders = getSaleOrderData(orderno);
    if (jkvo === undefined || jkvo === null) {
      updateSaleOrderParam.push({
        id: orders[0].id,
        code: orderno,
        definesInfo: [
          {
            isHead: true,
            isFree: true,
            define17: hxdate
          }
        ]
      });
    } else {
      jkvo.forEach((self) => {
        if (hxdate === "") {
          hxdate = self.mainid_pubts;
        } else {
          var newdate = new Date(self.mainid_pubts).getTime();
          var olddate = new Date(hxdate).getTime();
          if (newdate > olddate) {
            hxdate = self.mainid_pubts;
          }
        }
      });
      updateSaleOrderParam.push({
        id: orders[0].id,
        code: orderno,
        definesInfo: [
          {
            isHead: true,
            isFree: true,
            define17: hxdate
          }
        ]
      });
    }
    //回写核销日期--zb
    if (updateSaleOrderParam.length > 0) {
      updateSaleOrderData(updateSaleOrderParam);
    }
    //查询销售订单号
    function queryOrder(id) {
      let data2 = {
        id: id
      };
      let verification2 = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + id, "", "");
      // 返回信息
      let jkdata = JSON.parse(verification2);
      if (jkdata.code != "200") {
        throw new Error(jkdata.message);
      }
      return jkdata.data.ReceiveBill_b[0].orderno;
    }
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    //查询核销日期
    function queryHX(orderno, code) {
      let data = {
        pageIndex: "1",
        pageSize: "100",
        orderno: orderno,
        simpleVOs: [
          {
            conditions: [
              {
                field: "code",
                op: "neq",
                value1: code
              }
            ]
          }
        ]
      };
      throw new Error(JSON.stringify(data));
      let verification = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(data));
      // 返回信息校验
      throw new Error(verification);
      let ordernodata = JSON.parse(verification);
      if (ordernodata === null || ordernodata === undefined) {
        return "";
      }
      if (ordernodata.code === "200") {
        var date = "";
        ordernodata.data.recordList.forEach((self) => {
          if (date === "") {
            date = self.pubts;
          } else {
            var newdate = new Date(self.pubts).getTime();
            var olddate = new Date(newdate).getTime();
            if (newdate > olddate) {
              date = self.pubts;
            }
          }
        });
        return newdate;
      } else {
        return "";
      }
    }
    //修改销售订单自定义项---ZB
    function updateSaleOrderData(params) {
      let data = { datas: params, billnum: "voucher_order" };
      throw new Error(JSON.stringify(data));
      let saleOrderupdateData = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(data));
      let returnorderXX = JSON.parse(saleOrderupdateData);
      let returncode = returnorderXX.code;
      if (returncode != "200") {
        throw new Error(returnorderXX.message);
      }
    }
    function getSaleOrderData(params) {
      let reqBody = {
        pageIndex: "1",
        pageSize: "100",
        isSum: true,
        simpleVOs: [
          {
            op: "eq",
            value1: params,
            field: "code"
          }
        ]
      };
      // 响应信息
      let saleOrderData = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      // 转为JSON对象
      saleOrderData = JSON.parse(saleOrderData);
      // 返回信息校验
      if (saleOrderData.code != "200") {
        throw new Error("查询销售订单异常(writeOrderOaStatus):" + saleOrderData.message);
      }
      if (saleOrderData.data !== undefined && saleOrderData.data.recordList !== undefined && saleOrderData.data.recordList.length != 0) {
        let id = saleOrderData.data.recordList[0].barCode;
        id = substring(id, 14, id.length);
        saleOrderData.data.recordList[0].id = id;
        return saleOrderData.data.recordList;
      } else {
        return [];
      }
    }
    function us_date_format(_date, fmt) {
      if (fmt == undefined) {
        fmt = "yyyy-MM-dd hh:mm:ss";
      }
      var o = {
        "M+": _date.getMonth() + 1, //月份
        "d+": _date.getDate(), //日
        "h+": _date.getHours(), //小时
        "m+": _date.getMinutes(), //分
        "s+": _date.getSeconds(), //秒
        "q+": Math.floor((_date.getMonth() + 3) / 3), //季度
        S: _date.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return fmt;
    }
    function saleReturnByCode(params) {
      let reqBody = {
        code: params.code,
        pageIndex: "1",
        pageSize: "10",
        isSum: true
      };
      // 响应信息
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      try {
        result = JSON.parse(result);
        if (result.code != "200" || result.data === undefined) {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询销售退货  " + e);
      }
      return result.data.recordList[0];
    }
    return null;
  }
}
exports({ entryPoint: MyTrigger });