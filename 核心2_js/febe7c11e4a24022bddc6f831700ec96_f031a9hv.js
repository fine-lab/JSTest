let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 操作几天前的数据
    let day = 7;
    if (param !== undefined && param.day !== undefined) {
      day = param.day;
    }
    // 当前时间戳 new Date()少28800000
    var currentDate = new Date();
    //当前时间往后8个小时
    var nowDate = new Date(new Date().getTime() + 28800000);
    var pubts = timestampToTime(nowDate.setDate(nowDate.getDate() - day));
    var accessToken;
    // 第几页
    var pageIndex = 1;
    // 列表
    var dataList = [];
    // 数量
    var recordCount = 0;
    while ((dataList.length < recordCount && recordCount !== 0) || pageIndex === 1) {
      let singledataList = getdataList({
        pageIndex: pageIndex,
        pubts: pubts
      });
      dataList = dataList.concat(singledataList);
      pageIndex++;
    }
    if (dataList.length === 0) {
      return;
    }
    // 驳回订单
    var cancelCountdown = getCancelCountdown();
    var laterDate = nowDate.setDate(nowDate.getDate() + day - cancelCountdown);
    var opposeDatas = [];
    let defineParamList = [];
    dataList.forEach((self) => {
      let createTime = new Date(self.createTime).getTime();
      //如果单据创建日期大于最晚到期日并且支付状态等于支付完成的不进行自动取消
      if (createTime > laterDate || self.payStatusCode == "FINISHPAYMENT") {
        return;
      }
      let req = {
        id: self.id,
        code: self.code,
        status: 0,
        opposeMemo: "订单超时未付款，系统自动取消。"
      };
      let defineParam = {
        id: self.id,
        code: self.code,
        definesInfo: [
          {
            define9: currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate(), //完成时间
            isHead: true,
            isFree: true
          },
          {
            define32: "已取消", //完成状态
            isHead: true,
            isFree: false
          }
        ]
      };
      opposeDatas.push(req);
      defineParamList.push(defineParam);
    });
    // 批量驳回
    if (opposeDatas.length > 0) {
      opposeOrders(opposeDatas);
      updateSaleOrderDefine(defineParamList);
    }
    // 响应
    return {};
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getdataList(params) {
      let reqBody = {
        pageIndex: params.pageIndex,
        pageSize: 500,
        nextStatusName: "CONFIRMORDER",
        isSum: true,
        open_orderDate_begin: params.pubts
      };
      let saleOrderData = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      saleOrderData = JSON.parse(saleOrderData);
      if (saleOrderData.code != "200") {
        throw new Error("查询销售订单异常:" + saleOrderData.message);
      }
      if (saleOrderData.data !== undefined && saleOrderData.data.recordList !== undefined) {
        recordCount = saleOrderData.data.recordCount;
        return saleOrderData.data.recordList;
      } else {
        return [];
      }
    }
    function opposeOrders(params) {
      let reqBody = {
        data: params
      };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      res = JSON.parse(res);
      if (res.code != "200") {
        throw new Error("驳回订单异常:" + res.message);
      }
    }
    function updateSaleOrderDefine(params) {
      // 封装请求参数
      let reqBody = {
        billnum: "voucher_order",
        datas: params
      };
      // 响应信息
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("销售自定义项更新 " + e);
      }
    }
    function getCancelCountdown() {
      let req = {
        pageIndex: 1,
        pageSize: 10,
        custdocdefcode: "cancelOrder",
        code: "day"
      };
      let res = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(req));
      res = JSON.parse(res);
      if (res.code != "200") {
        throw new Error("查询自定义档案列表异常:" + res.message);
      }
      if (res.data.recordCount == 0) {
        throw new Error("自定义档案[" + req.custdocdefcode + "]无数据");
      }
      return GetBigDecimal(res.data.recordList[0].name.zh_CN);
    }
    function timestampToTime(timestamp) {
      //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var date = new Date(timestamp);
      var Y = date.getFullYear() + "-";
      var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
      var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":";
      var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }
  }
}
exports({ entryPoint: MyTrigger });