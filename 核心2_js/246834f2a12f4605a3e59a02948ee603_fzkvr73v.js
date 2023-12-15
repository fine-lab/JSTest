let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取收款调整单主表
    var testMassage = request.entity;
    //获取收款调整单子表
    var listFk = { payment_adjustment_listFk: testMassage.id };
    var res = ObjectStore.selectByMap("GT45627AT16.GT45627AT16.payment_adjustment_list", listFk);
    //获取收款单主表
    var voucher = ObjectStore.selectById("GT45627AT16.GT45627AT16.voucher", { id: testMassage.voucher_id });
    //获取收款单子表
    var bill_of_paymentFk = { bill_of_paymentFk: testMassage.voucher_id };
    var paymentList = ObjectStore.selectByMap("GT45627AT16.GT45627AT16.bill_of_payment", bill_of_paymentFk);
    //获取应收表
    var billInfo = ObjectStore.selectById("GT43955AT9.GT43955AT9.account_receivable", { id: voucher.accounts_receivable_id });
    testMassage.documents_state = "已审核";
    ObjectStore.updateById("GT45627AT16.GT45627AT16.receipt_adjustment_order", testMassage);
    voucher.billing_status = "生效";
    ObjectStore.updateById("GT45627AT16.GT45627AT16.voucher", voucher);
    //收款单主单
    // ，paid_in_taxes（实收税金）)
    var skdhc = new Object();
    skdhc = voucher;
    skdhc.total_payment = -voucher.total_payment;
    skdhc.paid_in_amount_y = -voucher.paid_in_amount_y;
    skdhc.paid_in_amount_n = -voucher.paid_in_amount_n;
    skdhc.type_of_document = "调整单-红冲";
    skdhc.liquidated_damages_paid = -voucher.liquidated_damages_paid;
    skdhc.paid_in_taxes = -voucher.paid_in_taxes;
    skdhc.verifystate = 2; //单据状态 -已审批 (//todo 直接修改审批状态，可能存在无审批人异常（系统原因，暂未生效）)
    var skdhcNew = ObjectStore.insert("GT45627AT16.GT45627AT16.voucher", skdhc, "44cfebd6");
    //收款单子单
    //（变更：paid_in_amount_y (实收金额含税)，paid_in_amount_n (实收金额不含税)，paid_in_taxes (实收税金)，
    //调整后实收（含税）=实收金额（含税）
    var skdzdhc = new Object();
    skdzdhc = paymentList[0];
    skdzdhc.bill_of_paymentFk = skdhcNew.id;
    skdzdhc.paid_in_amount_y = skdhc.paid_in_amount_y;
    skdzdhc.paid_in_amount_n = skdhc.paid_in_amount_n;
    skdzdhc.paid_in_taxes = skdhc.paid_in_taxes;
    skdzdhc.liquidated_damages_paid = skdhc.liquidated_damages_paid;
    ObjectStore.insert("GT45627AT16.GT45627AT16.bill_of_payment", skdzdhc, "5796895b");
    // 收款单主单
    var skd = new Object();
    skd = voucher;
    skd.total_payment = res[0].paid_in_after_adjustment_y; //收款总额-收款调整单子表：调整后实收含税
    skd.paid_in_amount_y = res[0].paid_in_after_adjustment_y; //实收金额含税  -- 调整后实收含税
    skd.paid_in_amount_n = res[0].paid_in_after_adjustment_n; //实收金额不含税  -- 调整后实收不含税
    skd.liquidated_damages_paid = res[0].liquidated_damages_will_be_paid_after_adjustment; //实收违约金  -- 调整后实收违约金
    skd.paid_in_taxes = res[0].after_paid_in_taxes; // 实收税金
    skd.type_of_document = "调整单-收款";
    skd.verifystate = 2; //单据状态 -已审批  (//todo 直接修改审批状态，可能存在无审批人异常（系统原因，暂未生效）)
    var newSkd = ObjectStore.insert("GT45627AT16.GT45627AT16.bill_of_payment", skd, "44cfebd6");
    //收款单子单
    var skdzd = new Object();
    skdzd = paymentList[0];
    skdzd.bill_of_paymentFk = newSkd.id;
    skdzd.paid_in_amount_y = res[0].paid_in_after_adjustment_y; //实收金额含税  -- 调整后实收含税
    skdzd.paid_in_amount_n = res[0].paid_in_after_adjustment_n; //实收金额不含税  -- 调整后实收不含税
    skdzd.paid_in_taxes = res[0].after_paid_in_taxes; // 实收税金
    skdzd.liquidated_damages_paid = res[0].liquidated_damages_will_be_paid_after_adjustment; //实收违约金  -- 调整后实收违约金
    ObjectStore.insert("GT45627AT16.GT45627AT16.bill_of_payment", skdzd, "5796895b");
    var yszd = new Object();
    yszd = billInfo;
    yszd.amount_received_y = res[0].paid_in_after_adjustment_y; //已收金额(含税)
    yszd.amount_received_n = res[0].paid_in_after_adjustment_n; //已收金额(不含税)
    yszd.uncollected_amount_y = yszd.amount_receivable_y - yszd.amount_received_y; //未收金额(含税)
    yszd.uncollected_amount_n = yszd.amount_receivable_n - yszd.amount_received_n; //未收金额(不含税)
    yszd.amount_received = res[0].paid_in_taxes; //已收税金
    yszd.uncollected_amount = yszd.amount_receivable - yszd.amount_received; //未收税金
    yszd.liquidated_damages_received = res[0].liquidated_damages_will_be_paid_after_adjustment; //已收违约金
    yszd.uncollected_liquidated_damages = yszd.liquidated_damages_receivable - yszd.liquidated_damages_received; //未收违约金
    if (yszd.uncollected_amount_y == 0 && yszd.uncollected_amount_n == 0) {
      yszd.billing_status = "结清";
    } else if (yszd.uncollected_amount_y > 0 || yszd.uncollected_amount_n > 0) {
      yszd.billing_status = "欠缴";
    }
    ObjectStore.updateById("GT43955AT9.GT43955AT9.account_receivable", yszd, "4c20c229");
    return { testMassage: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });