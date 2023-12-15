let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取前端选中数据
    let data1 = request.data;
    let num;
    let responseStr;
    let param;
    let cshu;
    let customer;
    let sign;
    let zid;
    let id;
    let ztt;
    let qssj;
    let kdssxx;
    let zwzt;
    let lssj;
    let statusCodes;
    let ftimes;
    let lanshoutime;
    for (var d in data1) {
      let value = data1[d];
      num = value.ckkddhzibList_kuaidigongsidanhao;
      let key = "yourkeyHere";
      let body = {};
      //信息头
      let header = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let url = "https://www.example.com/" + "key=" + key + "&" + "num=" + num;
      responseStr = postman("get", url, JSON.stringify(header), null);
      let responseObj = JSON.parse(responseStr);
      let comCode = responseObj[0].comCode;
      //主表id
      id = value.id;
      //子表id
      zid = value.ckkddhzibList_id;
      param = {
        resultv2: 4,
        //快递公司编码
        com: comCode,
        //快递公司单号
        num: num,
        order: "desc"
      };
      cshu = JSON.stringify(param);
      customer = "0DE9268B2DF5205D9DB8A573C9A7817A";
      sign = MD5Encode(cshu + key + customer).toUpperCase();
      let url1 = "https://www.example.com/" + "?" + "customer=" + customer + "&" + "sign=" + sign + "&" + "param=" + cshu;
      let responseStr1 = postman("post", url1, JSON.stringify(header), JSON.stringify(body));
      // 可以直观的看到具体的错误信息
      let responseObj1 = JSON.parse(responseStr1);
      let aa = responseObj1.data;
      aa.forEach((item) => {
        statusCodes = item.statusCode;
        ftimes = item.ftime;
      });
      qssj = responseObj1.data[0].ftime;
      kdssxx = responseObj1.data[0].context;
      if (responseObj1.state === "0") {
        zwzt = "在途";
      } else if (responseObj1.state === "1") {
        zwzt = "揽收";
      } else if (responseObj1.state === "2") {
        zwzt = "疑难";
      } else if (responseObj1.state === "3") {
        zwzt = "签收";
      } else if (responseObj1.state === "4") {
        zwzt = "退签";
      } else if (responseObj1.state === "5") {
        zwzt = "派件";
      } else if (responseObj1.state === "6") {
        zwzt = "退回";
      } else if (responseObj1.state === "7") {
        zwzt = "转投";
      } else if (responseObj1.state === "8") {
        zwzt = "清关";
      } else if (responseObj1.state === "14") {
        zwzt = "拒签";
      } else if (responseObj1.state === "101") {
        zwzt = "已下单";
      } else if (responseObj1.state === "102") {
        zwzt = "待揽收";
      } else if (responseObj1.state === "103") {
        zwzt = "已揽收";
      } else if (responseObj1.state === "1001") {
        zwzt = "到达派件城市";
      } else if (responseObj1.state === "1002") {
        zwzt = "干线";
      } else if (responseObj1.state === "1003") {
        zwzt = "转递";
      } else if (responseObj1.state === "501") {
        zwzt = "投柜或驿站";
      } else if (responseObj1.state === "301") {
        zwzt = "本人签收";
      } else if (responseObj1.state === "302") {
        zwzt = "派件异常后签收";
      } else if (responseObj1.state === "303") {
        zwzt = "代签";
      } else if (responseObj1.state === "304") {
        zwzt = "投柜或站签收";
      } else if (responseObj1.state === "401") {
        zwzt = "已销单";
      } else if (responseObj1.state === "14") {
        zwzt = "拒签";
      } else if (responseObj1.state === "201") {
        zwzt = "超时未签收";
      } else if (responseObj1.state === "202") {
        zwzt = "超时未更新";
      } else if (responseObj1.state === "203") {
        zwzt = "拒收";
      } else if (responseObj1.state === "204") {
        zwzt = "派件异常";
      } else if (responseObj1.state === "205") {
        zwzt = "柜或驿站超时未取";
      } else if (responseObj1.state === "206") {
        zwzt = "无法联系";
      } else if (responseObj1.state === "207") {
        zwzt = "超区";
      } else if (responseObj1.state === "208") {
        zwzt = "滞留";
      } else if (responseObj1.state === "209") {
        zwzt = "破损";
      } else if (responseObj1.state === "10") {
        zwzt = "待清关";
      } else if (responseObj1.state === "11") {
        zwzt = "清关中";
      } else if (responseObj1.state === "12") {
        zwzt = "已清关";
      } else if (responseObj1.state === "13") {
        zwzt = "清关异常";
      }
      //更新实体 主子同时更新
      var object = {
        id: id,
        ckkddhzibList: [
          { hasDefaultInit: true, com: comCode, kuaidizhuangtai: zwzt, kuaidiqianshoushijian: qssj, kuaidishishixinxi: kdssxx, shishikuaidizhuangtai: ftimes, id: zid, _status: "Update" }
        ]
      };
      var res = ObjectStore.updateById("GT1691AT14.GT1691AT14.ckkddhzhub", object, "2cd2ae07");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });