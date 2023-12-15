let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var name = request.name;
    var object = { partnerName: name }; //verifystate:2
    var projects = ObjectStore.selectByMap("GT30659AT3.GT30659AT3.ssp_partner_project", object);
    var ProStatus = new Map();
    ProStatus.set("015001", "实施中");
    ProStatus.set("015002", "已验收");
    ProStatus.set("015003", "已终止");
    var ProjectDocVOList = [];
    for (var num = 0; num < projects.length; num++) {
      var project = projects[num];
      var re = {
        customerName: project.customerName,
        industry: project.industryName,
        projectName: project.projectName,
        startDate: project.startDate,
        endDate: project.endDate,
        projectStatus: ProStatus.get(project.projectStatus),
        province: project.areaName,
        projectMoney: project.projectMoney,
        projectManager: project.projectManager,
        introduce: project.introduce,
        solution: project.solution,
        resource: project.resource
      };
      ProjectDocVOList.push(re);
    }
    return { ProjectDocVOList };
  }
}
exports({ entryPoint: MyAPIHandler });