let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let Order = request.Order;
    let array = new Array();
    // 获取子表的集合
    let sonList = request.Order.IssueDetailsList;
    // 循环子表集合数据
    for (var i = 0; i < sonList.length; i++) {
      var sonDetails = sonList[i];
      let sonData = {
        // 出库单号
        deliveryOrderNo: sonDetails.deliveryOrderNo,
        // 产品名称
        productName: sonDetails.productName,
        // 产品编码
        productCode: sonDetails.productCode,
        // 规格型号
        specification: sonDetails.specification,
        // 产品注册证号/备案凭证号
        productRegisterNo: sonDetails.productRegisterNo,
        // 生产企业
        productionEnterprise: sonDetails.productionEnterprise,
        // 生产批号/序列号
        batchNumber: sonDetails.batchNumber,
        // 生产日期
        productionDate: sonDetails.productionDate,
        // 有效期
        termOfValidity: sonDetails.termOfValidity,
        // 数量
        quantity: sonDetails.quantity,
        // 单位
        company: sonDetails.company,
        // 储运条件
        storageCondition: sonDetails.storageCondition,
        // 备注
        remarks: sonDetails.remarks,
        // 确认状态
        ConfirmStatus: sonDetails.ConfirmStatus,
        // 库位
        warehouseLocation: sonDetails.warehouseLocation,
        // 注册人/备案人名称
        registrant: sonDetails.registrant,
        ui: sonDetails.ui,
        di: sonDetails.di,
        new20: sonDetails.new20,
        // 校验状态
        checkStatus: sonDetails.checkStatus
      };
      array.push(sonData);
    }
    let requestBody = {
      // 封装主表数据
      // 出库单号
      DeliveryorderNo: Order.DeliveryorderNo,
      // 出库类型
      IssueType: Order.IssueType,
      // 委托方企业编码
      ClientCode: Order.ClientCode,
      // 委托方企业名称
      CilentName: Order.CilentName,
      // 出库日期
      IssueDate: Order.IssueDate,
      // 购货者编码
      BuyerCode: Order.BuyerCode,
      // 购货者名称
      BuyerName: Order.BuyerName,
      // 购货者
      Buyer: Order.Buyer,
      // 收货客户名称
      CustomerName: Order.CustomerName,
      // 收货地址
      ShipToAddress: Order.ShipToAddress,
      // 联系人
      Contacts: Order.Contacts,
      // 联系方式
      ContactInformation: Order.ContactInformation,
      // 制单日期
      PreparationDate: Order.PreparationDate,
      // 制单人
      PreparedBy: Order.PreparedBy,
      // 修改人
      ModifiedBy: Order.ModifiedBy,
      // 修改日期
      ModifiedDate: Order.ModifiedDate,
      // 验收人
      AcceptedBy: Order.AcceptedBy,
      // 验收时间
      AcceptedDate: Order.AcceptedDate,
      // 取消人
      CancelledBy: Order.CancelledBy,
      // 取消时间
      CancelledDate: Order.CancelledDate,
      // 复核状态
      ReviewStatus: Order.ReviewStatus,
      // 备注
      method: Order.method,
      UI: Order.UI,
      DI: Order.DI,
      UDI: Order.UDI,
      // 复核人
      ReviewedBy: Order.ReviewedBy,
      // 状态
      enable: Order.enable,
      // 子表集合
      IssueDetailsList: array
    };
    var res = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", requestBody, "93ffc3ce");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });