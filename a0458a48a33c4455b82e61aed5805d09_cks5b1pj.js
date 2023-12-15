let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var urlNow = ObjectStore.env().url;
    try {
      var result = ObjectStore.queryByYonQL("select id from AT17AF88F609C00004.AT17AF88F609C00004.org");
      var res = ObjectStore.deleteBatch("AT17AF88F609C00004.AT17AF88F609C00004.org", result, "yb523dd27d");
      //获取组织列表
      var orgSql = "select DISTINCT id, name from org.func.BaseOrg where orgtype = 1 ";
      var orgList = ObjectStore.queryByYonQL(orgSql, "orgcenter");
      var orgResult = [];
      orgList.forEach((item) => {
        let url = urlNow + "/iuap-api-gateway/yonbip/digitalModel/orgunit/detail?id=" + item.id; //传参要写到这里
        let apiResponse = openLinker("GET", url, "AT17AF88F609C00004", JSON.stringify({})); //TODO:注意填写应用编码（请看注意事项）；最后一个参数填写{}即可，不需要改动
        orgResult.push(JSON.parse(apiResponse));
      });
      var object = [];
      orgResult.forEach((row) => {
        var rowData = {};
        if (row.hasOwnProperty("data") && row.data.hasOwnProperty("financeOrg")) {
          var bookSql = "select id, name from epub.accountbook.AccountBook where accentity = '" + row.data.financeOrg.id + "'";
          var bookResult = ObjectStore.queryByYonQL(bookSql, "fiepub");
          rowData["orgId"] = row.data.id;
          rowData["orgName"] = row.data.name.zh_CN;
          var bookList = [];
          bookResult.forEach((book) => {
            var bookitem = {};
            bookitem["accountId"] = book.id;
            bookitem["accountName"] = book.name;
            bookList.push(bookitem);
          });
          rowData["accountList"] = bookList;
          object.push(rowData);
        }
      });
      var res = ObjectStore.insertBatch("AT17AF88F609C00004.AT17AF88F609C00004.org", object, "yb523dd27d");
      return { res };
    } catch (e) {
      throw new Error("执行脚本getBaseOrg报错：" + e);
    }
  }
}
exports({ entryPoint: MyAPIHandler });