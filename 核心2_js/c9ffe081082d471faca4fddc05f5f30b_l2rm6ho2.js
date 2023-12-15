let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var hmd_req_type = "POST";
    var contenttype = "application/json;charset=UTF-8";
    //请求地址
    var request_url = "https://ip:port/u8cloud/api/uapbd/bdpsn/save";
    //用户
    var usercode = "demo";
    //密码
    var password = MD5Encode("demo");
    //系统参数
    var system = "code";
    var header = {
      "Content-Type": contenttype,
      usercode: usercode,
      password: password,
      system: system
    };
    //处理请求数据
    var selectedRows = request.data;
    //开始数据转换
    var reqData = reqData(selectedRows);
    //开始循环插入
    reqData.forEach((data) => {
      var result = postman(hmd_req_type, request_url, JSON.stringify(header), JSON.stringify(data));
      var resultData = JSON.parse(result);
    });
    //将选中行数据转换为要请求的数据格式---批量处理
    function reqData(selectedRows) {
      var psnData = new Array();
      selectedRows.forEach((data) => {
        psnData.push(convertdata(data));
      });
      return psnData;
    }
    //转换数据
    function convertdata(data) {
      var parentVo = {
        currentcorp: data.currentcorp,
        psnbasvo: {
          psnname: data.psnname,
          addr: data.addr,
          birthdate: data.birthdate,
          email: data.email,
          mobile: data.mobile
        }
      };
      var result = {
        psn: {
          parentvo: parentVo
        }
      };
      return result;
    }
    return { apiResponse: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });