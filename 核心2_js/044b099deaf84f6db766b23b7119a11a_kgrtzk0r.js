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
      var soid = param.data[0].id;
      var url = "https://www.example.com/" + soid + "";
      var apiResponse = openLinker("GET", url, "ST", JSON.stringify({}));
      var retapiResponse = JSON.parse(apiResponse);
      if (retapiResponse.code == "200") {
        if (retapiResponse.data != undefined) {
          var sodata = retapiResponse.data;
          var yzck = sodata.warehouse;
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
          if (sodata.salesOutDefineCharacter != undefined) {
            pinpai = sodata.salesOutDefineCharacter.attrext6;
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
          if (sodata.accountOrg == 2830809192386816 || sodata.salesOrgId_code == 2830809192386816) {
            var funAPI12 = extrequire(EffiveAPI);
            var resAPI12 = funAPI12.execute("API12");
            if (resAPI12.r) {
              var srcno = "";
              srcno = sodata.srcBillNO;
              sodata.details.forEach((row) => {
                if (srcno != "" || srcno != undefined) {
                  srcno = row.upcode;
                }
              });
              var ckcode = "";
              if (sodata.warehouse != undefined) {
                var ckres = ObjectStore.queryByYonQL(" select code from aa.warehouse.Warehouse where id=" + sodata.warehouse + "", "productcenter");
                if (ckres.length > 0) {
                  ckcode = ckres[0].code;
                }
              }
              var qcinsert = {
                sent_no: sodata.code,
                sent_date: sodata.vouchdate,
                order_no: srcno,
                order_id: "",
                sent_storehouse_code: ckcode,
                sign_status: "FH_DQS",
                business_status: "",
                receive_name: sodata.cReceiver,
                receive_phone: sodata.cReceiveMobile,
                receive_tel: sodata.cReceiveMobile,
                receive_addr: sodata.cReceiveAddress,
                receive_addr_id: "",
                sent_receive_code: "",
                prods: []
              };
              sodata.details.forEach((row) => {
                var prod = {
                  posnr: row.lineno / 10,
                  sent_num: row.qty,
                  sent_input_unit: "",
                  sent_input_unit_name: row.unitName,
                  sent_remark: ""
                };
                qcinsert.prods.push(prod);
              });
              var funhttp12 = extrequire(HttpsAPI);
              var reshttp12 = funhttp12.execute("HttpAPI12");
              var http12 = reshttp12.http;
              //获取顺丰接口1地址
              var funhttpqc12 = extrequire(ZEQCHttpAPI);
              var reshttpqc12 = funhttpqc12.execute(http12, qcinsert);
              var getdizhi = reshttpqc12.di;
              //调用勤策接口1
              var apiResponse12 = postman("post", getdizhi, JSON.stringify(header), JSON.stringify(qcinsert));
              var urllog12 = "https://www.example.com/";
              var bodylog12 = { fasongren: username, SrcJSON: JSON.stringify(qcinsert), ToJSON: apiResponse12, Actype: 12 }; //请求参数
              var apiResponselog12 = openLinker("POST", urllog12, "ST", JSON.stringify(bodylog12));
              var apiResponsejson12 = JSON.parse(apiResponse12);
              if (apiResponsejson12.return_code == "0") {
              } else {
                throw new Error("勤策接口:" + sodata.code + apiResponsejson12.return_msg);
              }
            }
          }
          if (sodata.accountOrg == 1772610381349388297 || sodata.salesOrgId_code == 1772610381349388297) {
            var funAPI13 = extrequire(EffiveAPI);
            var resAPI13 = funAPI13.execute("API13");
            if (resAPI13.r) {
              var ckcode = "";
              if (sodata.warehouse != undefined) {
                var ckres = ObjectStore.queryByYonQL(" select code from aa.warehouse.Warehouse where id=" + sodata.warehouse + "", "productcenter");
                if (ckres.length > 0) {
                  ckcode = ckres[0].code;
                }
              }
              var khcode1 = "";
              var khdata1 = ObjectStore.queryByYonQL("select code from aa.merchant.Merchant where id=" + sodata.cust + "", "productcenter");
              if (khdata1.length > 0) {
                khcode1 = khdata1[0].code;
              }
              var lsdoc = "";
              sodata.details.forEach((row) => {
                lsdoc = row.upcode;
              });
              var qcdh = {
                cmCode: khcode1,
                cmName: sodata.cust_name,
                distSendNo: lsdoc,
                sendTime: sodata.vouchdate,
                logNo: sodata.cLogisticsBillNo,
                logState: ""
              };
              var funhttp13 = extrequire(HttpsAPI);
              var reshttp13 = funhttp13.execute("HttpAPI13");
              var http13 = reshttp13.http;
              //获取顺丰接口1地址
              var funhttpqc13 = extrequire(ZEQCHttpAPI);
              var reshttpqc13 = funhttpqc13.execute(http13, qcdh);
              var getdizhi = reshttpqc13.di;
              //调用勤策接口1
              var apiResponse13 = postman("post", getdizhi, JSON.stringify(header), JSON.stringify(qcdh));
              var urllog13 = "https://www.example.com/";
              var bodylog13 = { fasongren: username, SrcJSON: JSON.stringify(qcdh), ToJSON: apiResponse13, Actype: 13 }; //请求参数
              var apiResponselog13 = openLinker("POST", urllog13, "ST", JSON.stringify(bodylog13));
              var apiResponsejson13 = JSON.parse(apiResponse13);
              if (apiResponsejson13.return_code == "0") {
              } else {
                throw new Error("勤策接口:" + sodata.code + apiResponsejson13.return_msg);
              }
            }
          }
        }
      } else {
        throw new Error(retapiResponse.message);
      }
    } catch (e) {
      throw new Error(e);
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});