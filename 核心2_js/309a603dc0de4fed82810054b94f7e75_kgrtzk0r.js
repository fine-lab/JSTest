let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
      //发送人
      var username = JSON.parse(AppContext()).currentUser.name;
      //有效性后端链接
      var EffiveAPI = "AT18DC6E5E09E00008.backDesignerFunction.getEffive";
      //接口地址后端链接
      var HttpsAPI = "AT18DC6E5E09E00008.backDesignerFunction.getHttps";
      //解析后勤策后端链接
      var ZEQCHttpAPI = "AT18DC6E5E09E00008.backDesignerFunction.getZEQCHttp";
      var header = {
        "Content-Type": "application/json"
      };
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
            var yzck = podata.warehouse;
            if (yzck == "" || yzck == undefined) {
              return {};
            } else {
              var yzckurl = "https://www.example.com/" + yzck + "";
              var yzckResponse = openLinker("GET", yzckurl, "ST", JSON.stringify({}));
              var yzckResponseres = JSON.parse(yzckResponse);
              if (yzckResponseres.code == "200") {
                if (yzckResponseres.data != undefined && yzckResponseres.data.defineCharacter != undefined && yzckResponseres.data.defineCharacter.A0010 == "1") {
                } else {
                  return {};
                }
              } else {
                return {};
              }
            }
            var pinpai = "";
            if (podata.othOutRecordDefineCharacter != undefined) {
              pinpai = podata.othOutRecordDefineCharacter.attrext6;
              if (pinpai == "" || pinpai == undefined) {
                return {};
              }
              var resattrext6 = ObjectStore.queryByYonQL("select code,randKeywords from pc.brand.Brand where id=" + pinpai + "", "productcenter");
              if (resattrext6.length > 0) {
                if (resattrext6[0].randKeywords != "接口") {
                  return {};
                }
              } else {
                return {};
              }
            } else {
              return {};
            }
            var nowdate = getNowDate();
            var resck = ObjectStore.queryByYonQL("select code from aa.warehouse.Warehouse where id=" + podata.warehouse + "", "productcenter");
            var dizhi = "";
            var shrxm = "";
            var receiverPhone = "";
            if (podata.othOutRecordDefineCharacter != undefined) {
              dizhi = podata.othOutRecordDefineCharacter.s002;
              shrxm = podata.othOutRecordDefineCharacter.s001;
              receiverPhone = podata.othOutRecordDefineCharacter.s003;
            }
            var jsonqtc = {
              type: "其他出库",
              appKey: "yourKeyHere",
              stationNo: resck[0].code,
              billNumber: podata.code,
              billDate: nowdate,
              remark: podata.memo,
              detailAddress: dizhi,
              recipientCompany: shrxm,
              receiverName: shrxm,
              receiverZipCode: "300000",
              receiverPhone: receiverPhone,
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
            var urllog11 = "https://www.example.com/";
            var bodylog11 = { fasongren: username, SrcJSON: JSON.stringify(jsonqtc), ToJSON: apiResponse11, Actype: 11 }; //请求参数
            var apiResponselog11 = openLinker("POST", urllog11, "ST", JSON.stringify(bodylog11));
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