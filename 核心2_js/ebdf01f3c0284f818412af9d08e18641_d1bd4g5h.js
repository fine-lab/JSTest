let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let responseObj = [
      {
        bIPResult: {
          CustomerCode: "A0000065",
          CustomerName: "来斯奥集成家居股份有限公司-材料",
          DataPeriod: "2022-01-01至2022-12-20",
          SPeriodRcdAmount: "0.000000000",
          SPeriodBond: "0.000000000",
          SPeriodRBBalance: "0.000000000",
          RcdAmount: "24997.500000000",
          SalesAmount: "43956.000000000",
          Bond: "0.000000000",
          TemporaryLine: "0.000000000",
          LockRcdAmount: "0.000000000",
          RBBalance: "0.000000000",
          CanTakeAmount: "-18958.500000000"
        },
        Msg: "",
        IsSuccess: true
      },
      {
        bIPResult: {
          CustomerCode: "C0023118",
          CustomerName: "山西三合众鑫商贸有限公司",
          DataPeriod: "2022-01-01至2022-12-20",
          SPeriodRcdAmount: "210.000000000",
          SPeriodBond: "80.000000000",
          SPeriodRBBalance: "0.000000000",
          RcdAmount: "2405.000000000",
          SalesAmount: "0.000000000",
          Bond: "450.000000000",
          TemporaryLine: "500.000000000",
          LockRcdAmount: "26.000000000",
          RBBalance: "0.000000000",
          CanTakeAmount: "3089.000000000"
        },
        Msg: "",
        IsSuccess: true
      }
    ];
    // 信息头
    // 可以是http请求
    // 也可以是https请求
    // 可以直观的看到具体的错误信息
    return {
      responseObj
    };
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });