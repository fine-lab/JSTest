let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var code = "" + request.information.出库单号;
    var IssueDetailsList = request.IssueDetailsList;
    var clientCodeSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo where DeliveryorderNo='" + code + "'";
    var clientCodeRes = ObjectStore.queryByYonQL(clientCodeSql, "developplatform");
    if (clientCodeRes.length == 0) {
      var information = request.information;
      var DeliveryorderNo = "" + information.出库单号;
      if (information.购货者编码 != "/") {
        var BuyerCode = "" + information.购货者编码;
        var BuyerObject = { BuyersCode: BuyerCode };
        var BuyerCodeList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", BuyerObject);
        if (BuyerCodeList.length != 0) {
          BuyerCode = BuyerCodeList[0].id;
        } else {
          return { err: "购货者信息不存在，请建立购货者信息再进行导入" };
        }
      } else {
        var BuyerCode = "" + information.购货者编码;
      }
      var BuyerName = "" + information.购货者名称;
      var ClientCode = "" + information.委托方企业编码;
      var the_client_name = "";
      var clientObject = { clientCode: ClientCode };
      var clientList = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.ClientInformation", clientObject);
      if (clientList.length != 0) {
        ClientCode = clientList[0].id;
        the_client_name = clientList[0].clientName;
        var timezone = 8; //目标时区时间，东八区
        // 本地时间和格林威治的时间差，单位为分钟
        var offset_GMT = new Date().getTimezoneOffset();
        // 本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
        var nowDate = new Date().getTime();
        var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
        // 当前日期时间戳
        var endDate = new Date(date).getTime();
        // 开始委托时间
        let fromDate = clientList[0].fromDate;
        let fromDate_date = new Date(fromDate);
        let fromDate_time = fromDate_date.getTime();
        // 停止委托时间
        let toDate = clientList[0].toDate;
        let toDate_date = new Date(toDate);
        let toDate_time = toDate_date.getTime();
        // 备案凭证有效期
        let expiryDate = clientList[0].expiryDate;
        let expiryDate_date = new Date(expiryDate);
        let expiryDate_time = expiryDate_date.getTime();
        if (endDate > fromDate_time && endDate < toDate_time && endDate < expiryDate_time) {
        } else {
          return { err: "委托方合同不在有效期内不可新增！" };
        }
      } else {
        return { err: "出库单" + ClientCode + "委托方企业信息不存在，请建立委托方企业信息再进行导入" };
      }
      var CustomerName = "" + information.收货客户名称;
      var ShipToAddress = "" + information.收货地址;
      var Contacts = "" + information.联系人;
      var ContactInformation = "" + information.联系方式;
      var object = { BuyersCode: BuyerCode };
      var buyersRes = ObjectStore.selectByMap("AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers", object);
      if (buyersRes.length != 0) {
        BuyerCode = buyersRes[0].id;
        BuyerName = buyersRes[0].BuyersName;
      }
      //获取当前时间
      let yy = new Date().getFullYear() + "-";
      let mm = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) + "-" : new Date().getMonth() + 1 + "-";
      let dd = new Date().getDate() + " ";
      let hh = new Date().getHours() + 8 + ":";
      let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() + ":" : new Date().getMinutes() + ":";
      let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
      var currentDate = yy + mm + dd;
      var mainTable = {
        DeliveryorderNo: DeliveryorderNo,
        BuyerCode: BuyerCode,
        BuyerName: BuyerName,
        ClientCode: ClientCode,
        CilentName: the_client_name,
        CustomerName: CustomerName,
        ShipToAddress: ShipToAddress,
        PreparationDate: currentDate,
        Contacts: Contacts,
        ContactInformation: ContactInformation,
        ReviewStatus: 0,
        enable: 0,
        IssueType: 1,
        IssueDate: currentDate,
        IssueDetailsList: IssueDetailsList
      };
      //插入实体
      var mainTableRes = ObjectStore.insert("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", mainTable, "93ffc3ce");
      return { mainTableRes };
    } else {
      var id = clientCodeRes[0].id;
      var mainTable = {
        id: id
      };
      //更新实体
      var res = ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.IssueDocInfo", mainTable, "93ffc3ce");
      return { err: "出库单" + code + "已存在，需要删除才能上传" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });