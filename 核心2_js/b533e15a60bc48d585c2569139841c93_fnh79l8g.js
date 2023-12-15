let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var obj = JSON.parse(param.requestData);
    var thisId = obj[0].id;
    // 获得当前日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month > 9 ? month : "0" + month;
    day = day < 10 ? "0" + day : day;
    var today = year + "-" + month + "-" + day;
    var costId = ""; // 获取当前租户费用项目的id
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {
      fields: "name,id",
      startTs: "2022-11-01"
    };
    let rawData = openLinker("post", url, "GT45627AT16", JSON.stringify(body));
    var jsonObj = JSON.parse(rawData);
    var wantData = jsonObj.data;
    for (let i in wantData) {
      if (wantData[i].name == "押金") {
        costId = JSON.stringify(wantData[i].id);
      }
    }
    //获取收款单主表
    var voucher = ObjectStore.selectById("GT45627AT16.GT45627AT16.voucher", { id: thisId });
    //获取收款单子表
    var paymentList = ObjectStore.selectByMap("GT45627AT16.GT45627AT16.bill_of_payment", { bill_of_paymentFk: thisId });
    if (voucher.type_of_document === "押金抵扣" || voucher.type_of_document === "押金退款" || voucher.type_of_document === "押金没收") {
      paymentList.forEach((data) => {
        if (data.accounts_receivable_amount_y < 0) {
          //新增应收账单
          var yszd = new Object();
          yszd.property_name = data.name_of_the_property;
          yszd.customer_name = data.customer_name;
          yszd.expense_items = data.cost_of_the_project;
          yszd.business_date = data.year_of_business;
          yszd.receivable_accounting_date = data.accounting_date_receivable;
          yszd.billing_status = "已结清";
          yszd.proof_status = "未生成";
          yszd.amount_receivable_y = data.accounts_receivable_amount_y;
          yszd.amount_received_y = data.accounts_receivable_amount_y;
          yszd.uncollected_amount_y = 0;
          yszd.tax_included = parseInt(data.rate) > 0 ? 1 : 2;
          yszd.amount_receivable_n = data.accounts_receivable_amount_n;
          yszd.amount_received_n = data.paid_in_amount_n;
          yszd.uncollected_amount_n = 0;
          yszd.tax_rate = data.rate;
          yszd.amount_receivable = data.tax_receivable_y;
          yszd.uncollected_amount = 0;
          yszd.amount_received = data.paid_in_taxes;
          yszd.unit_price_y = 0;
          yszd.unit_price_n = 0;
          yszd.park_name = voucher.park;
          yszd.building_name = data.name_of_the_building;
          yszd.expense_items = data.cost_of_the_project;
          yszd.expense_type = data.cost_type;
          yszd.source_document = "押金使用记录";
          yszd.liquidated_damages_receivable = 0;
          yszd.liquidated_damages_received = 0;
          yszd.uncollected_liquidated_damages = 0;
          yszd.receivables_adjustment_y = data.accounts_receivable_amount_y;
          yszd.receivables_adjustment_n = data.accounts_receivable_amount_n;
          yszd.tax_before_adjustment = data.tax_receivable_y;
          yszd.tax_after_adjustment = 0;
          yszd.Invoicing_status = "未开票";
          ObjectStore.insert("GT43955AT9.GT43955AT9.account_receivable", yszd, "4c20c229");
        } else {
          //获取应收表
          var billInfo = ObjectStore.selectById("GT43955AT9.GT43955AT9.account_receivable", { id: data.accounts_receivable_id });
          var yszdhc = new Object();
          yszdhc = billInfo;
          yszdhc.amount_received_y = yszdhc.amount_received_y + data.paid_in_amount_y; //已收金额(含税)
          yszdhc.amount_received_n = yszdhc.amount_received_y - yszdhc.amount_received_y * (parseInt(yszdhc.tax_rate, 10) / 100); //已收金额(不含税)
          yszdhc.uncollected_amount_y = yszdhc.amount_receivable_n - yszdhc.amount_received_y; //未收金额(含税)
          yszdhc.uncollected_amount_n = yszdhc.amount_receivable_n - yszdhc.amount_received_y - (yszdhc.amount_receivable_n - yszdhc.amount_received_y) * (parseInt(yszdhc.tax_rate, 10) / 100); //未收金额(不含税)
          yszdhc.amount_received = yszdhc.amount_received_y * (parseInt(yszdhc.tax_rate, 10) / 100); //已收税金
          yszdhc.uncollected_amount = (yszdhc.amount_receivable_n - yszdhc.amount_received_y) * (parseInt(yszdhc.tax_rate, 10) / 100); //未收税金
          if (yszdhc.uncollected_amount_y == 0 && yszdhc.uncollected_amount_n == 0) {
            yszdhc.billing_status = "已结清";
          } else if (yszdhc.uncollected_amount_y > 0 || yszdhc.uncollected_amount_n > 0) {
            yszdhc.billing_status = "欠缴";
          }
          ObjectStore.updateById("GT43955AT9.GT43955AT9.account_receivable", yszdhc, "4c20c229");
        }
      });
    }
    if (voucher.type_of_document === "普通" && paymentList.length === 1 && JSON.stringify(paymentList[0].cost_of_the_project) === costId) {
      //获取押金台账
      var depositList = ObjectStore.selectByMap("GT48750AT21.GT48750AT21.deposit_parameter4", {
        subordinate_to_the_park: voucher.park,
        customer_name: paymentList[0].customer_name,
        cost_of_the_project: paymentList[0].cost_of_the_project,
        rate: paymentList[0].rate
      });
      if (depositList.length === 1) {
        var yszdhc = new Object();
        yszdhc = depositList[0];
        yszdhc.deposit_balancean = yszdhc.deposit_balancean + paymentList[0].accounts_receivable_amount_y;
        yszdhc.can_refund_the_balance = yszdhc.deposit_balancean - yszdhc.have_used_the_deposit;
        ObjectStore.updateById("GT48750AT21.GT48750AT21.deposit_parameter4", yszdhc, "cde4662c");
      } else {
        //押金台账
        var yjtzhc = new Object();
        yjtzhc.customer_name = paymentList[0].customer_name;
        yjtzhc.subordinate_to_the_park = voucher.park;
        yjtzhc.cost_of_the_project = paymentList[0].cost_of_the_project;
        yjtzhc.rate = paymentList[0].rate;
        yjtzhc.accounting_year = paymentList[0].accounting_date_receivable;
        yjtzhc.deposit_balancean = paymentList[0].accounts_receivable_amount_y;
        yjtzhc.have_used_the_deposit = 0;
        yjtzhc.can_refund_the_balance = paymentList[0].accounts_receivable_amount_y;
        yjtzhc.state = 1;
        yjtzhc.name_of_the_building = paymentList[0].name_of_the_building;
        yjtzhc.name_of_the_property = paymentList[0].name_of_the_property;
        yjtzhc.sales_receipts = voucher.id;
        yjtzhc.data_source = "收款单";
        yjtzhc.source_number = voucher.code;
        yjtzhc.method_of_payment = voucher.method_of_payment;
        ObjectStore.insert("GT48750AT21.GT48750AT21.deposit_parameter4", yjtzhc, "cde4662c");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });