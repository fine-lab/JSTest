let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //构建请求apiData入参
    var main = new Object();
    //设置入参字段_status为更新
    main._status = "Update";
    main.billnum = "voucher_orderlist";
    var datas_array = new Array();
    let datas = {
      id: "youridHere",
      code: "XSDD-271",
      definesInfo: {
        define13: "333",
        isHead: true,
        isFree: false
      }
    };
    datas_array.push(datas);
    main.datas = datas_array;
    var apiData = { data: main };
    //使用openLinker调用开放接口
    var strResponse = openLinker("POST", "https://www.example.com/", "IMP_PES", JSON.stringify(apiData));
    return { strResponse };
  }
}
exports({ entryPoint: MyAPIHandler });