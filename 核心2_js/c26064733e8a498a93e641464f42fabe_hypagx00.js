let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var yzUrl = "http://localhost:8080/getData";
    //存放多个日结单的数组
    var daycloseBillList = new Array();
    for (var i = 0; i < 50000; i++) {
      var queryResponse = postman("post", yzUrl, null, null);
      var queryResponseJson = JSON.parse(queryResponse);
      var queryCode = queryResponseJson.header.code;
      if (queryCode == "10000") {
        //查询成功，拼接日结单数据
        let body = queryResponseJson.body;
        let cash = "";
        //销售收入明细
        let saleArray = new Array();
        let saleIncome = body.payVOList;
        saleIncome.forEach((saleIncomeDetail, index) => {
          let payTypeCode = "";
          let payTypeName = "";
          let dealmethod = "";
          let saleYS = {};
          saleYS = {
            rownum: index + 1,
            paytypecode: payTypeCode,
            paytypename: payTypeName,
            custcode: payTypeCode,
            custname: payTypeName,
            arapdealmethod: dealmethod,
            realmoney: saleIncomeDetail.payAmount,
            aftermoveaccmoney: saleIncomeDetail.payAmount,
            cash: cash,
            cashAccountName: cashAccountName
          };
          saleArray.push(saleYS);
        });
        //会员收入明细
        let vipArray = new Array();
        let vipIncome = body.storeVOList;
        let vipIncomeCount = 0;
        vipIncome.forEach((vipDetail, index) => {
          vipIncomeCount = vipDetail.payAmount * 1 + vipIncomeCount * 1;
          //做支付编码转换
          let arapdealmethod = "";
          let yzPayID = vipDetail.payId;
          let payTypeCode = "";
          let payTypeName = "";
          //现金025  银行卡026
          let vipYS = {};
          vipYS = {
            rownum: index + 1,
            incomemoney: vipDetail.payAmount,
            amountmoney: vipDetail.payAmount,
            arapdealmethod: arapdealmethod,
            payTypeCode: payTypeCode,
            payTypeName: payTypeName,
            cash: cash,
            cashAccountName: cashAccountName
          };
          vipArray.push(vipYS);
        });
        //优惠明细
        let discountDetail = body.discountDetail;
        //优惠金额
        let discountmoney =
          discountDetail.bussDiscAmount * 1 +
          discountDetail.bussGiveAmount * 1 +
          discountDetail.bussSingAmount * 1 +
          discountDetail.bussMoliAmount * 1 +
          discountDetail.dishGiveAmount * 1 +
          discountDetail.bussNormAmount * 1;
        let discountDetailYS = {
          rownum: 1,
          discount: discountDetail.bussDiscAmount,
          exemption: discountDetail.bussGiveAmount,
          singleDiscount: discountDetail.bussSingAmount,
          wipeOff: discountDetail.bussMoliAmount,
          desert: discountDetail.dishGiveAmount,
          vipDiscount: discountDetail.bussNormAmount
        };
        //日结单号
        //菜品收入明细
        let dishArray = new Array();
        let dishIncome = body.singleAndComboDishesList;
        let dishSaleMoney = 0; //菜品销售额
        let dishActualMoney = 0; //菜品实收金额
        dishIncome.forEach((dishDetail, index) => {
          dishSaleMoney = dishDetail.makeAmount * 1 + dishSaleMoney * 1;
          dishActualMoney = dishDetail.netAmount * 1 + dishActualMoney * 1;
          let dishYS = {
            rownum: index + 1,
            dishesBig: dishDetail.bigCateName,
            dishesSmall: dishDetail.cateName,
            dishesName: dishDetail.dishName,
            unit: dishDetail.dishUnit,
            saleNum: dishDetail.makeNum,
            dishesSaleMoney: dishDetail.makeAmount,
            giveNum: dishDetail.giveNum,
            giveNumber: dishDetail.giveAmount,
            freeNum: dishDetail.freeNum,
            freeMoney: dishDetail.freeAmount,
            discountMoney: dishDetail.prefAmount,
            notAcountMoney: dishDetail.exActAmount,
            dishesSaleNet: dishDetail.netAmount,
            retreatNum: dishDetail.backNum,
            retreatMoney: dishDetail.backAmount
          };
          dishArray.push(dishYS);
        });
        //餐区销售汇总
        let dineArray = new Array();
        let dineIncome = body.saleAreaTableUnitData;
        dineIncome.forEach((dineDetail, index) => {
          //实收占比
          let saleAmountRate = replace(dineDetail.saleAmountRate, "%", "");
          //翻台率
          let turnOverRate = replace(dineDetail.turnOverRate, "%", "");
          let dineYS = {
            rownum: index + 1,
            storeName: dineDetail.storeName,
            dineName: dineDetail.areaName,
            dineTable: dineDetail.tableName,
            billNum: dineDetail.transTime,
            dineNum: dineDetail.transGuests,
            amount: dineDetail.bussSaleTotal,
            vipDiscount: dineDetail.bussNormAmount,
            discount: dineDetail.bussDiscAmount,
            exemption: dineDetail.bussGiveAmount,
            wipeoff: dineDetail.bussMoliAmount,
            handsel: dineDetail.dishGiveAmount,
            free: dineDetail.bussFreeAmount,
            countPaid: dineDetail.bussNoinAmount,
            paid: dineDetail.bussSaleAmount,
            paidPercentage: saleAmountRate,
            perConsumption: dineDetail.avgTransGuests,
            singleConsumption: dineDetail.avgTransTime,
            overTurn: turnOverRate
          };
          dineArray.push(dineYS);
        });
        //时段报表
        let timeArray = new Array();
        let timePeriodIncome = body.periodList;
        timePeriodIncome.forEach((timePeriodDetail, index) => {
          //占比
          let proportion = replace(timePeriodDetail.proportion, "%", "");
          let timeYS = {
            rownum: index + 1,
            timePeriod: timePeriodDetail.bussTime,
            billNum: timePeriodDetail.transTime,
            dineNum: timePeriodDetail.transGuests,
            receiveMoney: timePeriodDetail.bussSaleTotal,
            averageTransactionVolume: timePeriodDetail.avgSaleTotal,
            transactionVolume: timePeriodDetail.bussSaleAmount,
            accountMoney: timePeriodDetail.bussNoinAmount,
            percentage: proportion
          };
          timeArray.push(timeYS);
        });
        //日结单主表信息
        let dayCloseBill = {
          org_id_name: erporgname,
          org_id: orgId,
          storecode: erporgcode,
          store: erporgname,
          erporgcode: erporgcode,
          erporgname: erporgname,
          businessdate: body.bussDate,
          dayclosedate: body.bussDate,
          salemoney: body.bussBillAmount,
          vipincome: vipIncomeCount,
          discountmoney: discountmoney,
          salemoneydetailYSList: saleArray,
          memberincomeYSList: vipArray,
          dayDiscountYSList: discountDetailYS,
          dishmoneyYSList: dishArray,
          serviceMoneyYSList: dineArray,
          accountdetailYSList: timeArray
        };
        //将单个日结单放到集合中
        daycloseBillList.push(dayCloseBill);
      }
      if (daycloseBillList.length == 100) {
        //批量插入日结单,先插入在清空
        try {
          ObjectStore.insertBatch("GT31971AT37.GT31971AT37.dayclosebillYS", daycloseBillList, "4fce3fac");
        } catch (err) {
          console.error(err);
        }
        daycloseBillList.length = 0;
        try {
          throw new Error("跳出循环");
        } catch (err) {
          console.error(err);
        }
      }
    }
    //凌晨1点，获取前一天的日期
    function getDay(num, str) {
      let today = new Date();
      let preDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      var oYear = preDate.getFullYear();
      var oMoth = (preDate.getMonth() + 1).toString();
      if (oMoth.length <= 1) oMoth = "0" + oMoth;
      var oDay = preDate.getDate().toString();
      if (oDay.length <= 1) oDay = "0" + oDay;
      return oYear + str + oMoth + str + oDay;
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });