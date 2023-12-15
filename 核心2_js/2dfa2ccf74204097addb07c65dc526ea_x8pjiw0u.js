let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.id == "" || request.id == null || request.id == undefined) {
      throw new Error("没有找到对应生产订单的id");
    }
    var sql = "select * from st.materialout.MaterialOut where srcBill = '" + request.id + "'";
    var res = ObjectStore.queryByYonQL(sql, "ustock");
    console.log("材料出库对应所有单据的数据：" + JSON.stringify(res));
    if (res.length < 1) {
      throw new Error("---查询材料出库单的id集合为空！！！---" + sql);
    }
    for (var a = 0; a < res.length; a++) {
      let clckIdZhu = res[a].id;
      let bodySelect = {};
      let urlSelect = "https://www.example.com/" + clckIdZhu;
      var apiResponseSelect = openLinker("GET", urlSelect, "PO", JSON.stringify(bodySelect));
      apiResponseSelect = JSON.parse(apiResponseSelect);
      if (apiResponseSelect.code != "200") {
        throw new Error("=============查询材料出库详情报错==========" + apiResponseSelect.message + "===========入参：" + urlSelect);
      }
      let materOuts = "";
      for (var b = 0; b < apiResponseSelect.data.materOuts.length; b++) {
        //材料出库单的成本金额有值则进行跳过
        let clckNatMoney = apiResponseSelect.data.materOuts[b].natMoney; //获取材料出库单的成本金额
        let clckNatMoneyFu = ""; //获取材料出库单的成本金额（辅计量）
        let natMoney = 0; //产品入库的成本金额
        let codeCprk = "";
        if (clckNatMoney == null || clckNatMoney == "" || clckNatMoney == undefined || clckNatMoney == 0) {
          //情况1：材料出库单成本金额为空
          //先查询存货明细账数据，如果有值就采用存货明细账的金额，如果没值就去查询产品入库单对应的金额
          let natMoneyResult = getChmxzAmount(apiResponseSelect.data, apiResponseSelect.data.materOuts[b]);
          if (natMoneyResult.amountSum != null && natMoneyResult.amountSum != "" && natMoneyResult.amountSum != undefined && natMoneyResult.amountSum > 0) {
            natMoney = natMoneyResult.amountSum;
          } else {
            var cprkApiResult = getCprkData(
              apiResponseSelect.data.materOuts[b].product,
              apiResponseSelect.data.warehouse,
              apiResponseSelect.data.materOuts[b].goodsposition,
              getDateBeforeMonthOne() + " 23:59:59"
            );
            cprkApiResult = JSON.parse(cprkApiResult);
            if (cprkApiResult.length < 1) {
              cprkApiResult = "";
              cprkApiResult = getCprkData(apiResponseSelect.data.materOuts[b].product, apiResponseSelect.data.warehouse, apiResponseSelect.data.materOuts[b].goodsposition, "");
              cprkApiResult = JSON.parse(cprkApiResult);
            }
            console.log(
              "存货明细账没有找到对应的价格，产品入库查询结果：" +
                JSON.stringify(cprkApiResult) +
                "，入参如下：物料：" +
                apiResponseSelect.data.materOuts[b].product +
                "，仓库：" +
                apiResponseSelect.data.warehouse +
                "，货位：" +
                apiResponseSelect.data.materOuts[b].goodsposition +
                ""
            );
            if (cprkApiResult.length < 1) {
              continue;
            } else {
              let qtyClck = apiResponseSelect.data.materOuts[b].qty;
              natMoney = cprkApiResult[0].natUnitPrice * 1 * qtyClck;
              codeCprk = cprkApiResult[0].code;
            }
          }
        } else if (clckNatMoneyFu == null || clckNatMoneyFu == "" || clckNatMoneyFu == undefined || clckNatMoneyFu == 0) {
          //情况2：材料出库单成本金额辅计量为空
          natMoney = clckNatMoney;
        }
        let number = apiResponseSelect.data.materOuts[b].qty;
        let numberPrice = apiResponseSelect.data.materOuts[b].subQty;
        let defineId = "";
        if (apiResponseSelect.data.materOuts[b]["defines!id"] != "" && apiResponseSelect.data.materOuts[b]["defines!id"] != null && apiResponseSelect.data.materOuts[b]["defines!id"] != undefined) {
          defineId = apiResponseSelect.data.materOuts[b]["defines!id"];
        }
        let materOut = {
          id: apiResponseSelect.data.materOuts[b].id, //必填：是，子表id 新增时无需填写，修改时必填
          product: apiResponseSelect.data.materOuts[b].product, //必填：是，物料id，或物料code
          productsku: apiResponseSelect.data.materOuts[b].productsku, //必填：否，商品SKUid，或物料SKUcode（未启用特征必输）
          productskuCp: apiResponseSelect.data.materOuts[b].productskuCp, //必填：否，成品SKUid
          batchno: apiResponseSelect.data.materOuts[b].batchno, //必填：否，批次号,批次管理商品时必填
          producedate: apiResponseSelect.data.materOuts[b].producedate, //必填：否，生产日期
          invaliddate: apiResponseSelect.data.materOuts[b].invaliddate, //必填：否，有效期至
          qty: apiResponseSelect.data.materOuts[b].qty, //必填：否，数量（数量、应发数量不能同时为空）
          unit: apiResponseSelect.data.materOuts[b].unit, //必填：是，主计量ID，或主计量code
          stockUnitId: apiResponseSelect.data.materOuts[b].stockUnitId, //必填：是，库存单位id，或库存单位code
          invExchRate: apiResponseSelect.data.materOuts[b].invExchRate, //必填：是，换算率
          subQty: apiResponseSelect.data.materOuts[b].subQty, //必填：否，件数
          goodsposition: apiResponseSelect.data.materOuts[b].goodsposition, //必填：否，货位id,货位管理时必填
          natUnitPrice: Math.round((natMoney / number) * 1000000) / 1000000, //必填：否，成本单价
          natMoney: Math.round(natMoney * 100) / 100, //必填：否，成本金额
          contactsQuantity: apiResponseSelect.data.materOuts[b].contactsQuantity, //必填：否，应发数量（数量、应发数量不能同时为空）
          pubts: apiResponseSelect.data.materOuts[b].pubts, //必填：否，时间戳，更新时必填    示例：2023-02-02 18:07:51
          materialOutsDefineCharacter: {
            //必填：否，
            id: apiResponseSelect.data.materOuts[b].id,
            attrext32: Math.round((natMoney / numberPrice) * 1000000) / 1000000,
            attrext33: Math.round(natMoney * 100) / 100,
            attrext39: codeCprk
          },
          _status: "Update"
        };
        materOuts = materOuts + JSON.stringify(materOut) + ",";
      }
      let clckSaveBody = {
        data: {
          org: apiResponseSelect.data.org, //必填：是	库存组织id，或库存组织code
          id: apiResponseSelect.data.id, //必填：否	主表id 新增时无需填写，修改时必填
          vouchdate: apiResponseSelect.data.vouchdate, //必填：是	单据日期    示例：2022-09-05 00:00:00
          factoryOrg: apiResponseSelect.data.factoryOrg, //必填：是	领用组织id或领用组织code    示例：00000
          warehouse: apiResponseSelect.data.warehouse, //必填：是	仓库id，或仓库code     示例：1513053017970049032
          bustype: apiResponseSelect.data.bustype, //必填：是	交易类型id，或交易类型code    示例：1508510411464376357
          department: apiResponseSelect.data.department, //必填：否	部门id，或部门code（会计主体启用成本中心后，部门不能为空）    示例：1509141617039638535
          pubts: apiResponseSelect.data.pubts, //必填：否	时间戳，更新时必填    示例：2023-02-02 18:07:51
          materOuts: JSON.parse("[" + materOuts.substring(0, materOuts.length - 1) + "]"),
          _status: "Update"
        }
      };
      let urlUpdate = "https://www.example.com/";
      var apiResponseUpdate = openLinker("POST", urlUpdate, "PO", JSON.stringify(clckSaveBody));
      apiResponseUpdate = JSON.parse(apiResponseUpdate);
      if (apiResponseUpdate.code != "200") {
        throw new Error("=============保存材料出库详情报错==========" + apiResponseUpdate.message + "===========入参：" + JSON.stringify(clckSaveBody));
      }
      console.log(JSON.stringify(clckSaveBody) + "返回结果如下：" + JSON.stringify(apiResponseUpdate));
    }
    return { res };
    //获取当前时间年月日
    function getNowDate() {
      let time = new Date(new Date().getTime() + 28800000);
      let nian = time.getFullYear();
      let yue = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1;
      let ri = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
      let shi = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
      let fen = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
      let miao = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
      let dateView = nian + "-" + yue + "-" + ri + " " + shi + ":" + fen + ":" + miao;
      return dateView;
    }
    //获取上个月最后一天日期
    function getDateBeforeMonthOne() {
      let date = new Date();
      console.log(date);
      date.setDate(0);
      console.log(date);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      month = month > 9 ? month : "0" + month;
      var day = date.getDate();
      day = day > 9 ? day : "0" + day;
      return year + "-" + month + "-" + day;
    }
    //获取产品入库对应的金额信息(根据物料，仓库，货位为维度)
    function getCprkData(productId, warehouse, goodsposition, createDate) {
      var sqlCprk =
        "select id,natUnitPrice,natMoney,storeProRecordsDefineCharacter.attrext32 as define1,storeProRecordsDefineCharacter.attrext33 as define2,zhu.code as code,subQty from st.storeprorecord.StoreProRecords left join st.storeprorecord.StoreProRecord zhu on mainid = zhu.id ";
      if (createDate != null && createDate != undefined && createDate != "") {
        sqlCprk =
          sqlCprk + "where product = '" + productId + "' and zhu.warehouse = '" + warehouse + "' and goodsposition = '" + goodsposition + "' and pubts <= '" + createDate + "' order by pubts DESC";
      } else {
        sqlCprk = sqlCprk + "where product = '" + productId + "' and zhu.warehouse = '" + warehouse + "' and goodsposition = '" + goodsposition + "' order by pubts DESC";
      }
      var resCprk = ObjectStore.queryByYonQL(sqlCprk, "ustock");
      return JSON.stringify(resCprk);
    }
    //查询存货明细账，根据先进先出的原则进行计算成本金额，成本单价
    function getChmxzAmount(clckBiaotouData, clckBiaotiData) {
      let chengbenyuResult = getCbyDate(clckBiaotouData.org, clckBiaotouData.warehouse);
      let chengbenyuId = "";
      for (var chengbenyuDate in chengbenyuResult) {
        //获取成本域Id
        chengbenyuId = chengbenyuResult[chengbenyuDate].costdomain;
      }
      let resultData = getChmxzData(chengbenyuId, clckBiaotiData.product, clckBiaotiData.batchno, clckBiaotouData.code, clckBiaotouData.warehouse);
      let inSum = 0; //收入的总数量
      let outSum = 0; //发出的总数量
      for (var a in resultData) {
        //主要获取收入和发出的总数量
        if (resultData[a].inorout == "IN") {
          if (resultData[a].num == undefined || resultData[a].num == null) {
            continue;
          }
          inSum = inSum + resultData[a].num;
        } else if (resultData[a].inorout == "OUT") {
          outSum = outSum + resultData[a].num;
        }
      }
      let outResidue = outSum; //每次循环完成后还剩多少发出的总量
      let inResidue = inSum; //每次循环完成后还剩多少收入的总量
      let amountSum = 0; //获取总金额
      let shuliangResidue = clckBiaotiData.qty;
      let caigouCode = "";
      for (var b in resultData) {
        //主要获取收入和发出的总数量
        let inCountArray = resultData[b].num;
        if (inSum == outSum) {
        }
        if (resultData[b].inorout == "IN" && outResidue >= resultData[b].num) {
          outResidue = outResidue - resultData[b].num;
          inResidue = inResidue - resultData[b].num;
        } else if (resultData[b].inorout == "IN" && resultData[b].num > outResidue) {
          inCountArray = inCountArray - outResidue;
          outResidue = 0;
          if (inCountArray >= shuliangResidue && resultData[b].price != null && resultData[b].price != undefined) {
            amountSum = amountSum + shuliangResidue * resultData[b].price;
            shuliangResidue = 0;
            caigouCode = resultData[b].billno;
            break;
          } else if (inCountArray < shuliangResidue && resultData[b].price != null && resultData[b].price != undefined) {
            amountSum = amountSum + resultData[b].num * resultData[b].price;
            shuliangResidue = shuliangResidue - inCountArray;
            inResidue = inResidue - inCountArray;
            if (inResidue < shuliangResidue) {
              break;
            }
          }
        }
      }
      if (shuliangResidue > 0) {
        amountSum = 0;
      }
      console.log("存货明细账获取的金额为：()" + amountSum + ",shuliang:" + clckBiaotiData.qty);
      return { amountSum: amountSum };
    }
    //获取成本域的id
    function getCbyDate(dczzId, dcckId) {
      var sql = "select * from ia.costdomain.CostBody where invorg = '" + dczzId + "' and warehouse = '" + dcckId + "'";
      var res = ObjectStore.queryByYonQL(sql, "yonyoufi");
      return res;
    }
    // 根据成本域id，物料id，批次号，查询对应的存货明细账所有数据
    function getChmxzData(chengbenyuId, wuliaoId, picihao, billNo, warehouse) {
      //入库还是出库：inorout，成本域：costreg，批次号：batchcode，物料ID：material，数量：num，单价：price，金额：money，
      var sql = "";
      if (picihao == null || picihao.length == 0) {
        sql =
          "select * from ia.account.IADetailLedgerVO where costreg = '" +
          chengbenyuId +
          "' and material = '" +
          wuliaoId +
          "' and warehouse = '" +
          warehouse +
          "' and billno != '" +
          billNo +
          "' order by createTime";
      } else {
        sql =
          "select * from ia.account.IADetailLedgerVO where costreg = '" +
          chengbenyuId +
          "' and material = '" +
          wuliaoId +
          "' and warehouse = '" +
          warehouse +
          "' and batchcode = '" +
          picihao +
          "' and billno != '" +
          billNo +
          "' order by createTime";
      }
      var res = ObjectStore.queryByYonQL(sql, "yonyoufi");
      return res;
    }
  }
}
exports({ entryPoint: MyAPIHandler });