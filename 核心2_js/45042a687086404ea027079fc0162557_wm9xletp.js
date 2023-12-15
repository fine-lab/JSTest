let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    try {
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
      if (param.data != undefined && param.data.length > 0 && param.data[0]._status == "Insert") {
        //简称
        var shortnametemp = "";
        if (param.data[0].productDetail.length > 0) {
          shortnametemp = param.data[0].productDetail[0].shortName;
        }
        //规格
        var modelDescriptiontemp = "";
        if (param.data[0].modelDescription != undefined) {
          modelDescriptiontemp = param.data[0].modelDescription.zh_CN;
        }
        var funAPI2 = extrequire(EffiveAPI);
        var resAPI2 = funAPI2.execute("API2");
        if (resAPI2.r) {
          var funhttp2 = extrequire(HttpsAPI);
          var reshttp2 = funhttp2.execute("HttpAPI2");
          //得到接口2地址
          var http2 = reshttp2.http;
          //单位名称
          var unitcode = getUnitCode(param.data[0].unit_Name);
          var shunfen = {
            productSn: param.data[0].code,
            appKey: "yourKeyHere",
            name: param.data[0].name.zh_CN,
            inventoryUnit: unitcode,
            defaultStationId: 117,
            itemSpecDTO: [
              {
                specName: modelDescriptiontemp,
                specValue: "无"
              }
            ]
          };
          //调用顺丰接口2
          var apiResponse2 = postman("post", http2, JSON.stringify(header), JSON.stringify(shunfen));
          var urllog2 = "https://www.example.com/";
          var bodylog2 = { fasongren: username, SrcJSON: JSON.stringify(shunfen), ToJSON: apiResponse2, Actype: 2 }; //请求参数
          var apiResponselog2 = openLinker("POST", urllog, "GZTBDM", JSON.stringify(bodylog));
          var apiResponsejson2 = JSON.parse(apiResponse2);
          if (apiResponsejson2.code == "200") {
          } else {
            if (apiResponsejson2.msg == undefined) {
              throw new Error("顺丰接口:" + param.data[0].code + apiResponsejson2.error);
            } else {
              throw new Error("顺丰接口:" + param.data[0].code + apiResponsejson2.msg);
            }
          }
        }
        //判断接口1有效
        var funAPI1 = extrequire(EffiveAPI);
        var resAPI1 = funAPI1.execute("API1");
        if (resAPI1.r) {
          var funhttp1 = extrequire(HttpsAPI);
          var reshttp1 = funhttp1.execute("HttpAPI1");
          var http1 = reshttp1.http;
          var qcinsert = {
            prd_id: param.data[0].id,
            prd_name: param.data[0].name.zh_CN,
            prd_code: param.data[0].code,
            prd_short_code: param.data[0].code,
            prd_barcode: param.data[0].code,
            class_name: "",
            prd_spec: modelDescriptiontemp,
            prd_brand: param.data[0].productClass_Name,
            prd_remarks: "",
            prd_sequ: 1000,
            with_tag_new: "true",
            with_tag_hot: "true",
            with_tag_gift: "false",
            with_tag_sale: "false",
            prd_suggest_price: 0,
            prd_cost_price: 0,
            prd_price: 0,
            prd_sale_status: "1",
            prd_status: "1",
            short_name: shortnametemp,
            use_stock: "1",
            use_batch: "1",
            use_valid_period: "0",
            use_serial_number: "0",
            sale_unit_name: param.data[0].unit_Name,
            purchase_unit_name: param.data[0].unit_Name,
            units: [
              {
                unit: param.data[0].unit,
                name: param.data[0].unit_Name,
                is_base: "1",
                ratio: 1
              }
            ]
          };
          //获取顺丰接口1地址
          var funhttpqc1 = extrequire(ZEQCHttpAPI);
          var reshttpqc1 = funhttpqc1.execute(http1, qcinsert);
          var getdizhi = reshttpqc1.di;
          //调用勤策接口1
          var apiResponse1 = postman("post", getdizhi, JSON.stringify(header), JSON.stringify(qcinsert));
          var urllog = "https://www.example.com/";
          var bodylog = { fasongren: username, SrcJSON: JSON.stringify(qcinsert), ToJSON: apiResponse1, Actype: 1 }; //请求参数
          var apiResponsejson1 = JSON.parse(apiResponse1);
          if (apiResponsejson1.return_code == "0") {
          } else {
            throw new Error("勤策接口:" + param.data[0].code + apiResponsejson1.return_msg);
          }
        }
      }
      if (param.data != undefined && param.data.length > 0 && param.data[0]._status == "Update") {
        //简称
        var shortnametemp = "";
        if (param.data[0].productDetail.length > 0) {
          shortnametemp = param.data[0].productDetail[0].shortName;
        }
        //规格
        var modelDescriptiontemp = "";
        if (param.data[0].modelDescription != undefined) {
          modelDescriptiontemp = param.data[0].modelDescription.zh_CN;
        }
        var funAPI2 = extrequire(EffiveAPI);
        var resAPI2 = funAPI2.execute("API2");
        if (resAPI2.r) {
          var funhttp2 = extrequire(HttpsAPI);
          var reshttp2 = funhttp2.execute("HttpAPI2");
          //得到接口2地址
          var http2 = reshttp2.http;
          //单位名称
          var unitid = param.data[0].unit;
          var resunitid = ObjectStore.queryByYonQL("select name from pc.unit.Unit  where id=" + unitid, "productcenter");
          var unitcode = getUnitCode(resunitid[0].name);
          var shunfen = {
            productSn: param.data[0].code,
            appKey: "yourKeyHere",
            name: param.data[0].name.zh_CN,
            inventoryUnit: unitcode,
            defaultStationId: 117,
            itemSpecDTO: [
              {
                specName: modelDescriptiontemp,
                specValue: "无"
              }
            ]
          };
          //调用顺丰接口2
          var apiResponse2 = postman("post", http2, JSON.stringify(header), JSON.stringify(shunfen));
          var urllog2 = "https://www.example.com/";
          var bodylog2 = { fasongren: username, SrcJSON: JSON.stringify(shunfen), ToJSON: apiResponse2, Actype: 2 }; //请求参数
          var apiResponsejson2 = JSON.parse(apiResponse2);
          if (apiResponsejson2.code == "200") {
          } else {
            if (apiResponsejson2.msg == undefined) {
              throw new Error("顺丰接口:" + param.data[0].code + apiResponsejson2.error);
            } else {
              throw new Error("顺丰接口:" + param.data[0].code + apiResponsejson2.msg);
            }
          }
        }
        //判断接口1有效
        var funAPI14 = extrequire(EffiveAPI);
        var resAPI14 = funAPI14.execute("API14");
        if (resAPI14.r) {
          var funhttp14 = extrequire(HttpsAPI);
          var reshttp14 = funhttp14.execute("HttpAPI14");
          var http14 = reshttp14.http;
          var qcinsert = {
            prd_id: param.data[0].id,
            prd_name: param.data[0].name.zh_CN,
            prd_code: param.data[0].code,
            prd_short_code: param.data[0].code,
            prd_barcode: param.data[0].code,
            class_name: "",
            prd_spec: modelDescriptiontemp,
            prd_brand: param.data[0].productClass_Name,
            prd_remarks: "",
            prd_sequ: 1000,
            with_tag_new: "true",
            with_tag_hot: "true",
            with_tag_gift: "false",
            with_tag_sale: "false",
            prd_suggest_price: 0,
            prd_cost_price: 0,
            prd_price: 0,
            prd_sale_status: "1",
            prd_status: "1",
            short_name: shortnametemp,
            use_stock: "1",
            use_batch: "1",
            use_valid_period: "0",
            use_serial_number: "0",
            sale_unit_name: resunitid[0].name,
            purchase_unit_name: resunitid[0].name,
            units: [
              {
                unit: param.data[0].unit,
                name: resunitid[0].name,
                is_base: "1",
                ratio: 1
              }
            ]
          };
          //获取顺丰接口1地址
          var funhttpqc14 = extrequire(ZEQCHttpAPI);
          var reshttpqc14 = funhttpqc14.execute(http14, qcinsert);
          var getdizhi = reshttpqc14.di;
          //调用勤策接口1
          var apiResponse14 = postman("post", getdizhi, JSON.stringify(header), JSON.stringify(qcinsert));
          var urllog = "https://www.example.com/";
          var bodylog = { fasongren: username, SrcJSON: JSON.stringify(qcinsert), ToJSON: apiResponse1, Actype: 14 }; //请求参数
          var apiResponselog = openLinker("POST", urllog, "GZTBDM", JSON.stringify(bodylog));
          var apiResponsejson14 = JSON.parse(apiResponse14);
          if (apiResponsejson14.return_code == "0") {
          } else {
            throw new Error("勤策接口:" + param.data[0].code + apiResponsejson14.return_msg);
          }
        }
      }
    } catch (e) {
      throw new Error(e);
    }
    return {};
    function getUnitCode(name) {
      if (name == "袋") {
        return "01";
      }
      if (name == "个") {
        return "02";
      }
      if (name == "盒") {
        return "03";
      }
      if (name == "片") {
        return "04";
      }
      if (name == "台") {
        return "05";
      }
      if (name == "套") {
        return "06";
      }
      if (name == "支") {
        return "07";
      }
      if (name == "箱") {
        return "08";
      }
      if (name == "EA") {
        return "09";
      }
      if (name == "张") {
        return "10";
      }
      if (name == "包") {
        return "11";
      }
      if (name == "捆") {
        return "12";
      }
    }
  }
}
exports({
  entryPoint: MyTrigger
});