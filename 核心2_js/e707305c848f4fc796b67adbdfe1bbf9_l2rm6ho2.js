let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //入参记录表id
    //获取待审核的记录表行
    let LogIds = request.codes;
    let yonGetRebateLog = "select * from GT4691AT1.GT4691AT1.MRebateProductsLog where code in(" + LogIds.toString() + ")";
    let RebateLogs = ObjectStore.queryByYonQL(yonGetRebateLog);
    let errMsg = "";
    //遍历记录表,调整对应维度下的返利品
    let uptRes = [];
    let uptLog = [];
    let insRes = [];
    let uptLogRes = [];
    for (var i = 0, len = RebateLogs.length; i < len; i++) {
      let rebateLog = RebateLogs[i];
      //是否生效bEffect 1：是  2：否
      let bEffect = rebateLog.bEffect;
      //过滤已审核的记录
      if (bEffect === "2") {
        //交易来源 1：外部导入；2：手动调整；3：前置订单
        let logSource = rebateLog.logSource;
        //交易类别 1：数量 2：金额
        let logType = rebateLog.logType;
        //要变动的调整数量
        let rpQuantity = parseFloat(rebateLog.rpQuantity);
        //返利品编码加三个维度确定最终要调整的返利品
        let rgInvCode = rebateLog.rpInvCode;
        let rgBUCode = rebateLog.rgBUCode;
        let legalEntity = rebateLog.legalEntity;
        let rgCustomerCode = rebateLog.rgCustomerCode;
        let rgCategoryCode = rebateLog.rgCategoryCode;
        let yonGetRebateLog;
        //综合条件获取汇总表返利品行
        if (parseInt(logType) === 1) {
          yonGetRebateLog =
            "select * from GT4691AT1.GT4691AT1.MRebateGifts where" +
            " rgInvCode='" +
            rgInvCode +
            "' and rgBUCode='" +
            rgBUCode +
            "' and legalEntity='" +
            legalEntity +
            "' and rgCustomerCode='" +
            rgCustomerCode +
            "'" +
            " and logType='" +
            logType +
            "'";
        } else {
          yonGetRebateLog =
            "select * from GT4691AT1.GT4691AT1.MRebateGifts where" +
            " rgCategoryCode='" +
            rgCategoryCode +
            "' and rgBUCode='" +
            rgBUCode +
            "' and legalEntity='" +
            legalEntity +
            "' and rgCustomerCode='" +
            rgCustomerCode +
            "'" +
            " and logType='" +
            logType +
            "'";
        }
        let rebates = ObjectStore.queryByYonQL(yonGetRebateLog);
        let rpAftQuantity = 0;
        if (rebates.length === 0) {
          rpAftQuantity = rpQuantity;
        } else {
          rpAftQuantity = parseFloat(rebateLog.rpPreQuantity) + rpQuantity;
        }
        let date = new Date();
        let logtime = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        uptLog.push({ id: rebateLog.id, bEffect: "1", rpAftQuantity: rpAftQuantity, rpdDate: logtime });
        if (logSource === "1" || logSource === "2") {
          //这两种操作特点是可能需要新增
          if (rebates.length !== 0) {
            //变更
            let rebate = rebates[0];
            //交易来源为前置订单的审核操作
            //调整后的现存量
            let existingQuantity = parseFloat(rebate.existingQuantity) + rpQuantity;
            //调整后的占用量
            let availableQuantity = parseFloat(rebate.availableQuantity) + rpQuantity;
            //待调整行id
            let id = rebate.id;
            let object = { id: id, existingQuantity: existingQuantity, availableQuantity: availableQuantity };
            let res = ObjectStore.updateById("GT4691AT1.GT4691AT1.MRebateGifts", object);
            uptRes.push(res);
          } else {
            //插入
            let insObj = {
              legalEntity: rebateLog.legalEntity,
              rgBUName: rebateLog.rgBUName,
              rgBUCode: rebateLog.rgBUCode,
              rgdDate: rebateLog.rpdDate,
              rgInv: rebateLog.rpInv,
              rgInvCode: rebateLog.rpInvCode,
              rgInvName: rebateLog.rpInvName,
              rgCategory: rebateLog.rgCategory,
              rgCategoryName: rebateLog.rgCategoryName,
              rgCategoryCode: rebateLog.rgCategoryCode,
              existingQuantity: rebateLog.rpQuantity,
              availableQuantity: rebateLog.rpQuantity,
              occupyQuantity: 0,
              logType: rebateLog.logType,
              unitId: rebateLog.unitId,
              unitName: rebateLog.unitName,
              eGiftSource: rebateLog.eGiftSource,
              rgCustomer: rebateLog.rgCustomer,
              rgCustomerName: rebateLog.rgCustomerName,
              rgCustomerCode: rebateLog.rgCustomerCode
            };
            let billNum = rebateLog.code;
            let res = ObjectStore.insert("GT4691AT1.GT4691AT1.MRebateGifts", insObj, billNum);
            insRes.push(res);
          }
        } else {
          let rebate = rebates[0];
          //交易来源为前置订单的审核操作
          //调整后的现存量
          let existingQuantity = parseFloat(rebate.existingQuantity) - rpQuantity;
          //调整后的占用量
          let occupyQuantity = parseFloat(rebate.occupyQuantity) - rpQuantity;
          //待调整行id
          let id = rebate.id;
          let object = { id: id, existingQuantity: existingQuantity, occupyQuantity: occupyQuantity };
          let res = ObjectStore.updateById("GT4691AT1.GT4691AT1.MRebateGifts", object);
          uptRes.push(res);
        }
      }
      let res = ObjectStore.updateById("developplatform.AX000003.PX000008", { id: rebateLog.id, bEffect: "1", rpAftQuantity: rpAftQuantity, rpdDate: logtime });
      uptLogRes.push(res);
    }
    let data = {};
    data.original = LogIds.length;
    if (insRes.length !== 0) {
      if (uptLogRes.length !== 0) {
        //更新记录为生效的条数
        data.uptRebLog = uptLogRes.length;
        //添加返利品的条数
        data.insRes = insRes.length;
      } else {
        errMsg += "修改交易记录行状态失败";
      }
    } else {
      errMsg += "添加返利品失败";
    }
    if (uptRes.length === 0) {
      errMsg += "变更存量失败";
    } else {
      if (uptLogRes.length !== 0) {
        //更新记录为生效的条数
        data.uptRebLog += uptLogRes.length;
        //更新返利汇总表的记录
        data.uptReb = uptRes.length;
      } else {
        errMsg += "修改交易记录行状态失败";
      }
    }
    return { yonGetRebateLog: yonGetRebateLog, errMsg: errMsg, data: data, uptRes: uptRes, uptLog: uptLog, uptLogRes: uptLogRes, insRes: insRes, RebateLogs: RebateLogs, request: request };
  }
}
exports({ entryPoint: MyAPIHandler });