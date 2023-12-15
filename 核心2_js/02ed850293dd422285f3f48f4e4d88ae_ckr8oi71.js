let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //目录
    var folders_sql = "select id from CSV.CSV.csv_folders where project ='" + request.id + "'";
    var folders_res = ObjectStore.queryByYonQL(folders_sql);
    //项目
    var projects_sql = "select id from CSV.CSV.csv_projects where id ='" + request.id + "'";
    var projects_res = ObjectStore.queryByYonQL(projects_sql);
    //每创建一个项目 默认增加目录
    if (folders_res.length == 0 && projects_res.length > 0) {
      var object = [
        { folderCode: "SAT", folderName: "SAT", folderStatus: "0", project: request.id, modifier: request.creator, modifyTime: request.createTime },
        { folderCode: "PQ", folderName: "PQ", folderStatus: "0", project: request.id, modifier: request.creator, modifyTime: request.createTime },
        { folderCode: "OQ", folderName: "OQ", folderStatus: "0", project: request.id, modifier: request.creator, modifyTime: request.createTime },
        { folderCode: "IQ", folderName: "IQ", folderStatus: "0", project: request.id, modifier: request.creator, modifyTime: request.createTime },
        { folderCode: "DQ", folderName: "DQ", folderStatus: "0", project: request.id, modifier: request.creator, modifyTime: request.createTime },
        { folderCode: "计划", folderName: "计划", folderStatus: "0", project: request.id, modifier: request.creator, modifyTime: request.createTime },
        { folderCode: "其他", folderName: "其他", folderStatus: "0", project: request.id, modifier: request.creator, modifyTime: request.createTime }
      ];
      ObjectStore.insertBatch("CSV.CSV.csv_folders", object, "csv_folders");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });