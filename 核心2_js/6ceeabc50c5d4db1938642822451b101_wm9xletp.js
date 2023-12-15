let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //发送人
    var username = JSON.parse(AppContext()).currentUser.name;
    //有效性后端链接
    var EffiveAPI = "AT179D04BE0940000B.frontDesignerFunction.getEffive";
    //接口地址后端链接
    var HttpsAPI = "AT179D04BE0940000B.frontDesignerFunction.getHttps";
    //解析后勤策后端链接
    var ZEQCHttpAPI = "AT179D04BE0940000B.frontDesignerFunction.getZEQCHttp";
    var header = {
      "Content-Type": "application/json"
    };
    try {
      var poid = param.data[0].id;
      var url = "https://www.example.com/" + poid + "";
      var apiResponse = openLinker("GET", url, "ST", JSON.stringify({}));
      var retapiResponse = JSON.parse(apiResponse);
      var funAPI11 = extrequire(EffiveAPI);
      var resAPI11 = funAPI11.execute("API11");
      if (resAPI11.r) {
        if (retapiResponse.code == "200") {
          if (retapiResponse.data != undefined) {
            var podata = retapiResponse.data;
            var nowdate = getNowDate();
            var resck = ObjectStore.queryByYonQL("select code from aa.warehouse.Warehouse where id=" + podata.warehouse + "", "productcenter");
            var jsonqtc = {
              type: "其他出库",
              stationNo: resck[0].code,
              billDate: nowdate,
              remark: podata.memo,
              outStockDetailList: []
            };
            podata.othOutRecords.forEach((row) => {
              var resjldw = ObjectStore.queryByYonQL("select code from pc.unit.Unit where id=" + row.unit + "", "productcenter");
              var dj = 0;
              if (row.natUnitPrice == undefined) {
                dj = 0;
              } else {
                dj = row.natUnitPrice;
              }
              var zj = 0;
              if (row.natMoney == undefined) {
                zj = 0;
              } else {
                zj = row.natMoney;
              }
              var outStockDetail = {
                productNo: row.product_cCode,
                inventoryUnit: resjldw[0].code,
                unitPrice: dj,
                unitFreePrice: dj,
                totalPrice: zj,
                totalFreePrice: zj,
                free: 0,
                outStockCount: row.qty,
                retailPrice: dj,
                actTranPrice: dj,
                singleProDisAmount: ""
              };
              jsonqtc.outStockDetailList.push(outStockDetail);
            });
            var funhttp11 = extrequire(HttpsAPI);
            var reshttp11 = funhttp11.execute("HttpAPI11");
            //得到接口11地址
            var http11 = reshttp11.http;
            //调用顺丰接口11
            var apiResponse11 = postman("post", http11, JSON.stringify(header), JSON.stringify(jsonqtc));
            var apiResponsejson11 = JSON.parse(apiResponse11);
            if (apiResponsejson11.code == "200") {
            } else {
              if (apiResponsejson11.msg == undefined) {
                throw new Error("顺丰接口:" + apiResponsejson11.error);
              } else {
                throw new Error("顺丰接口:" + apiResponsejson11.msg);
              }
            }
          }
        } else {
          throw new Error(retapiResponse.message);
        }
      }
    } catch (e) {
      throw new Error(e);
    }
    var str = JSON.stringify(jsonqtc);
    function getNowDate() {
      //定义日期格式化函数
      var date = new Date();
      var year = date.getFullYear(); //获取年份
      var month = date.getMonth() + 1; //获取月份，从0开始计数，所以要加1
      var day = date.getDate(); //获取日期
      month = month < 10 ? "0" + month : month; //如果月份小于10，前面补0
      day = day < 10 ? "0" + day : day; //如果日期小于10，前面补0
      return year + "-" + month + "-" + day; //拼接成yyyymmdd形式字符串
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});