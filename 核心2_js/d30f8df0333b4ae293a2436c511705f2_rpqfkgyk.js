let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let config = {
      appcode: "IMP_PES",
      apiurl: {
        //获取销售出库单列表
        salesoutList: "https://www.example.com/",
        //更新销售出库单
        updateSaleout: "https://www.example.com/",
        //更新销售订单自定义项
        updateSaleOrderCustomerItem: "https://www.example.com/",
        //项目保存
        projectSave: "https://www.example.com/",
        //测试外部接口
        setValueDemo: "https://www.example.com/"
      }
    };
    return { config };
  }
}
exports({ entryPoint: MyTrigger });