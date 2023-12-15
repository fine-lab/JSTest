let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    var listFk = { deposit_usage_record_id: businessId };
    var res = ObjectStore.selectById("GT48750AT21.GT48750AT21.deposit_usage_record", { id: businessId });
    //收款单主单
    var skdhc = new Object();
    skdhc.customer_name = res.customer_name;
    skdhc.park = res.subordinate_to_the_park;
    skdhc.total_payment = 0;
    skdhc.paid_in_amount_y = 0;
    skdhc.paid_in_amount_n = 0;
    var type_of_document = "";
    if (res.bill_type === "1") {
      type_of_document = "押金抵扣";
    } else if (res.bill_type === "2") {
      type_of_document = "押金没收";
    } else if (res.bill_type === "3") {
      type_of_document = "押金退款";
    }
    skdhc.type_of_document = type_of_document;
    skdhc.billing_status = "生效";
    skdhc.liquidated_damages_paid = 0;
    skdhc.liquidated_damages_receivable = 0;
    skdhc.paid_in_taxes = 0;
    skdhc.verifystate = res.verifystate;
    skdhc.document_date = res.date_of_receipt;
    skdhc.making_people = res.create_by;
    skdhc.method_of_payment = res.method_of_payment;
    var obj = ObjectStore.insert("GT45627AT16.GT45627AT16.voucher", skdhc, "44cfebd6");
    var resList = ObjectStore.selectByMap("GT48750AT21.GT48750AT21.details_of_deduction_expenses", { deposit_usage_record_id: res.id });
    var total = 0;
    resList.forEach((data) => {
      //收款单子单
      var skdzdhc = new Object();
      skdzdhc.bill_of_paymentFk = obj.id;
      skdzdhc.customer_name = res.customer_name;
      skdzdhc.customer_name_name = res.customer_name_name;
      skdzdhc.accounts_receivable_amount_y = data.outstanding_amount_y;
      skdzdhc.rate = data.tax_rate;
      total = total + data.paid_in_amount_y;
      skdzdhc.accounts_receivable_amount_n = data.outstanding_amount_y - data.outstanding_amount_y * (parseInt(data.tax_rate, 10) / 100);
      skdzdhc.paid_in_amount_y = data.paid_in_amount_n + data.paid_in_taxes;
      skdzdhc.paid_in_amount_n = data.paid_in_amount_n;
      skdzdhc.tax_receivable_y = data.outstanding_amount_y * (parseInt(data.tax_rate, 10) / 100);
      skdzdhc.paid_in_taxes = data.paid_in_taxes;
      skdzdhc.cost_of_the_project = data.cost_of_the_project;
      skdzdhc.cost_of_the_project_name = data.cost_of_the_project_name;
      skdzdhc.method_of_payment = res.cust_settle_type;
      skdzdhc.year_of_business = data.business_date;
      skdzdhc.accounting_date_receivable = res.accounting_year;
      skdzdhc.start_date = data.charge_begin;
      skdzdhc.deadline = data.charge_end;
      skdzdhc.date_of_payment = data.receivable_date;
      skdzdhc.name_of_the_property = data.property_name;
      skdzdhc.name_of_the_property_name = data.property_name_name;
      skdzdhc.name_of_the_building = data.building_name;
      skdzdhc.name_of_the_building_name = data.building_name_name;
      skdzdhc.liquidated_damages_receivable = data.liquidated_damages_receivable;
      skdzdhc.liquidated_damages_paid = data.liquidated_damages_received;
      skdzdhc.accounts_receivable_id = data.receivable_number;
      ObjectStore.insert("GT45627AT16.GT45627AT16.bill_of_payment", skdzdhc, "5796895b");
    });
    //收款单子单
    var skdzd = new Object();
    skdzd.bill_of_paymentFk = obj.id;
    skdzd.customer_name = res.customer_name;
    skdzd.customer_name_name = res.customer_name_name;
    skdzd.cost_of_the_project = res.cost_of_the_project;
    skdzd.cost_of_the_project_name = res.cost_of_the_project_name;
    skdzd.accounts_receivable_amount_y = -total;
    skdzd.rate = res.rate;
    skdzd.accounts_receivable_amount_n = -(total - total * (parseInt(res.rate, 10) / 100));
    skdzd.paid_in_amount_y = -total;
    skdzd.paid_in_amount_n = -(total - total * (parseInt(res.rate, 10) / 100));
    skdzd.tax_receivable_y = -(total * (parseInt(res.rate, 10) / 100));
    skdzd.paid_in_taxes = -(total * (parseInt(res.rate, 10) / 100));
    skdzd.method_of_payment = res.cust_settle_type;
    skdzd.year_of_business = res.accounting_year;
    skdzd.accounting_date_receivable = res.accounting_year;
    skdzd.liquidated_damages_receivable = 0;
    skdzd.liquidated_damages_paid = 0;
    ObjectStore.insert("GT45627AT16.GT45627AT16.bill_of_payment", skdzd, "5796895b");
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });