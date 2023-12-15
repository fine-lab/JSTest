let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var allData = param.data;
    if (allData.length != 0) {
      var value = allData[0];
    }
    var selzt = param.requestData;
    var newSelzt = JSON.parse(selzt);
    var newStatus = newSelzt._status;
    if (newStatus === "Insert") {
      //数据库编码
      var code = "AT17604A341D580008.AT17604A341D580008.PhaseCostFlow";
      let url = "https://www.example.com/" + code;
      let apiResponse = openLinker("POST", url, "AT17604A341D580008", JSON.stringify(value));
      var jsonALL = JSON.parse(apiResponse);
      throw new Error(JSON.stringify(jsonALL));
      if (jsonALL.code === "200") {
        //凭证id
        var voucherid = jsonALL.eventInfo.srcBusiId;
        var BillVersion = jsonALL.eventInfo.srcBillVersion;
        BillVersion = BillVersion + "";
        var object = { id: voucherid, isVoucher: "1", srcBillVersion: BillVersion };
        var res = ObjectStore.updateById("AT17604A341D580008.AT17604A341D580008.PhaseCostFlow", object, "PhaseCostFlow");
      } else {
        throw new Error("  -- 生成凭证失败 -- ");
      }
      value.verisons = "2";
      throw new Error(JSON.stringify(value));
      //处理数据调用一次正向接入生成入库调整
      var arrayList = value.PhaseCostFlow_subList;
      unique(arrayList);
      let apiResponses = openLinker("POST", url, "AT17604A341D580008", JSON.stringify(value));
      var jsonALLs = JSON.parse(apiResponses);
    }
    function unique(arr) {
      // 第一层for循环控制第一个数
      for (let i1 = 0; i1 < arr.length; i1++) {
        // 第二层循环控制第二个数
        for (let j1 = i1 + 1; j1 < arr.length; j1++) {
          // 判断前后是否相等
          if (arr[i1].chengben === "4" && arr[j1].chengben === "4" && arr[i1].picihao === arr[j1].picihao) {
            if (arr[i1].zhuzhileixing === "6" && arr[j1].zhuzhileixing === "7") {
              var daitanzonges = arr[i1].daitanzonge + arr[j1].daitanzonge;
              daitanzonges = Number(daitanzonges.toFixed(2));
              arr[j1].daitanzonge = daitanzonges;
              arr[i1].daitanzonge = 0;
            } else if (arr[i1].zhuzhileixing === "7" && arr[j1].zhuzhileixing === "6") {
              var daitanzonges = arr[i1].daitanzonge + arr[j1].daitanzonge;
              daitanzonge = Number(daitanzonges.toFixed(2));
              arr[i1].daitanzonge = daitanzonges;
              arr[j1].daitanzonge = 0;
            }
          }
        }
      }
    }
    function getProId(prName) {
      var proSql = "select id from pc.product.ProductDetail where shortName = " + prName + "";
      var proRes = ObjectStore.queryByYonQL(proSql, "productcenter");
      if (proRes.length == 0) {
        throw new Error("-- 根据猪只类型物料详情Id查询为空 -- ");
      }
      var pigId = proRes[0].id;
      return pigId;
    }
    function getPigType(PigType) {
      var newPigTpe = "";
      //匹配类型名称
      if (PigType === "1") {
        newPigTpe = "后备公猪";
      } else if (PigType === "2") {
        newPigTpe = "后备母猪";
      } else if (PigType === "3") {
        newPigTpe = "种公猪";
      } else if (PigType === "4") {
        newPigTpe = "待配母猪";
      } else if (PigType === "5") {
        newPigTpe = "怀孕母猪";
      } else if (PigType === "6") {
        newPigTpe = "哺乳母猪";
      } else if (PigType === "7") {
        newPigTpe = "哺乳仔猪";
      } else if (PigType === "8") {
        newPigTpe = "保育猪";
      } else if (PigType === "9") {
        newPigTpe = "育肥猪";
      }
      return newPigTpe;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });