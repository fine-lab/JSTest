let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ASN = request.Asn;
    // 获取ASN子表集合
    let sonList = request.Asn.product_lisList;
    let array = new Array();
    // 循环子表数据
    for (var i = 0; i < sonList.length; i++) {
      var sonDetails = sonList[i];
      let sonData = {
        // 产品名称
        product_name: sonDetails.product_name,
        // 注册人/备案人名称
        registrant: sonDetails.registrant,
        // 生产企业
        Enterprise: sonDetails.Enterprise,
        // 注册证号/备案凭证号
        registration_number: sonDetails.registration_number,
        // 生产批号
        batch_number: sonDetails.batch_number,
        // 生产日期
        date_manufacture: sonDetails.date_manufacture,
        // 有效期
        term_validity: sonDetails.term_validity,
        // 数量
        quantity: sonDetails.quantity,
        // 单位
        Company: sonDetails.Company,
        // 合格数
        Qualified_quantity: sonDetails.Qualified_quantity,
        // 不合格数
        NoQualified_quantity: sonDetails.NoQualified_quantity,
        // 隔离数
        Isolation_number: sonDetails.Isolation_number,
        // 储运条件
        conditions: sonDetails.conditions,
        // 入库存储区货位号
        Location_No: sonDetails.Location_No,
        // 确认状态
        Confirm_status: sonDetails.Confirm_status,
        // 入库状态
        storageState: sonDetails.storageState,
        // 入库单号
        warehouse_entry_number: sonDetails.warehouse_entry_number,
        // 预到货通知单号(ASN)
        AdvanceArrivalNoticeNo: sonDetails.AdvanceArrivalNoticeNo,
        // 备注
        state: sonDetails.state,
        // 产品编码
        product_code: sonDetails.product_code,
        // 规格型号
        model: sonDetails.model,
        ui: sonDetails.ui,
        di: sonDetails.di,
        udi: sonDetails.udi
      };
      array.push(sonData);
    }
    // 封装主表数据
    let requestBody = {
      // 预到货通知单号(ASN)
      AdvanceArrivalNoticeNo: ASN.AdvanceArrivalNoticeNo,
      // 入库类型
      Storagetype: ASN.Storagetype,
      // 入库日期
      Inbounddate: ASN.Inbounddate,
      // 客户编码(委托方企业)
      the_client_code: ASN.the_client_code,
      // 接收日期
      Receivingdate: ASN.Receivingdate,
      // 制单日期
      Makethedate: ASN.Makethedate,
      // 制单人
      Makingpeople: ASN.Makingpeople,
      // 修改人
      Themodifier: ASN.Themodifier,
      // 修改日期
      Modificationdate: ASN.Modificationdate,
      // 验收人
      Acceptanceofthepeople: ASN.Acceptanceofthepeople,
      // 取消人
      Cancelone: ASN.Cancelone,
      // 取消时间
      Cancelthetime: ASN.Cancelthetime,
      // 确认状态
      Confirmthestatus: ASN.Confirmthestatus,
      // 入库状态
      storageState: ASN.storageState,
      // 验收时间
      Acceptancetime: ASN.Acceptancetime,
      ASN_date_created: ASN.ASN_date_created,
      // 入库单号
      warehouse_entry_number: ASN.warehouse_entry_number,
      ASN: ASN.ASN,
      // 客户名称(委托方企业名称)
      the_client_name: ASN.the_client_name,
      // 确认复核人
      notarize_Reviewing: ASN.notarize_Reviewing,
      // 确认复核时间
      notarize_Reviewing_Date: ASN.notarize_Reviewing_Date,
      enable: ASN.enable,
      // 子表集合
      product_lisList: array
    };
    var res = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.WarehousingAcceptanceSheet", requestBody, "e84ee900");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });