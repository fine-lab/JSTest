let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let parent_code = "dw0101"; //上级部门编码
    let deptCode = "dw010103";
    let deptName = "测试部门010103";
    //保存部门
    let deptSaveParam = {
      data: {
        parent_code: parent_code,
        code: deptCode,
        name: {
          zh_CN: deptName
        },
        _status: "Insert"
      }
    };
    let saveUrl = "https://www.example.com/";
    let saveRes = openLinker("POST", saveUrl, "AT162DF46809880005", JSON.stringify(deptSaveParam));
    let saveMes = JSON.parse(saveRes);
    if (saveMes.code != "200") {
      throw new Error("部门：" + deptCode + "保存失败!");
    }
    //部门启用
    let startBody = {
      data: {
        id: saveMes.data.id
      }
    };
    let startUrl = "https://www.example.com/";
    let startResponse = openLinker("POST", startUrl, "AT162DF46809880005", JSON.stringify(startBody));
    let startMes = JSON.parse(startResponse);
    if (startMes.code != "200") {
      throw new Error("部门编号：" + saveMes.data.code + "启用失败!");
    }
    return { startMes };
  }
}
exports({ entryPoint: MyAPIHandler });