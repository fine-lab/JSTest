let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let getTokenFun = extrequire("GT15AT1.api.getToken");
    let token = getTokenFun.execute(request);
    let accessToken = token.access_token;
    let strResponse = postman("post", "https://www.example.com/" + accessToken, null, JSON.stringify(request));
    let jsonRes = JSON.parse(strResponse);
    let object = [];
    let CourseInfoList = [];
    if (jsonRes.code === "200") {
      jsonRes.data.forEach((itemData) => {
        if (request.name != null && itemData.name.indexOf(request.name) == -1) {
        } else {
          var item = {
            printNum: request.printNum,
            staff_id: itemData.staff_id,
            staff_code: itemData.staff_code,
            name: itemData.name,
            sex: itemData.sex,
            birthDate: itemData.birthDate,
            educationName: itemData.educationName,
            school: itemData.school,
            major: itemData.major,
            orgrelBeginDate: itemData.orgrelBeginDate,
            jobLevel: itemData.jobLevel,
            position: itemData.position,
            adminOrgVO: itemData.adminOrgVO,
            TrainingBaseInfoList: []
          };
          if (itemData.TrainingBaseInfoList) {
            var count = itemData.TrainingBaseInfoList.length;
            for (var i = 0; i < count; i++) {
              let trainingBaseInfo = itemData.TrainingBaseInfoList[i];
              let courseInfoTemp = trainingBaseInfo.courseInfo;
              //有培训课程
              if (courseInfoTemp && courseInfoTemp.attrext96) {
                let courseInfo;
                if (CourseInfoList.length > 0) {
                  if (courseInfoTemp.attrext96) {
                    courseInfo = CourseInfoList.find((courseInfo) => courseInfo.define16 === courseInfoTemp.attrext96);
                  } else {
                    debugger;
                    continue;
                  }
                }
                //未查询到课程时新增课程
                if (courseInfo) {
                } else {
                  //新增课程
                  courseInfo = {
                    printNum: request.printNum,
                    courseId: courseInfoTemp.courseId,
                    define16: courseInfoTemp.attrext96,
                    define1: courseInfoTemp.attrext79.substr(0, 199),
                    content: courseInfoTemp.content.replace("&nbsp;", "").substr(0, 199),
                    beginDate: courseInfoTemp.beginDate,
                    endDate: courseInfoTemp.endDate,
                    classifiCation: courseInfoTemp.classifiCation,
                    define17: courseInfoTemp.attrext97,
                    dayOrHours: courseInfoTemp.dayOrHours,
                    define3: courseInfoTemp.attrext81,
                    define4: courseInfoTemp.attrext82,
                    define5: courseInfoTemp.attrext83,
                    define6: courseInfoTemp.attrext84,
                    define8: courseInfoTemp.attrext86,
                    define9: courseInfoTemp.attrext87,
                    define10: courseInfoTemp.attrext88,
                    define11: courseInfoTemp.attrext89,
                    define12: courseInfoTemp.attrext90,
                    define13: courseInfoTemp.attrext91,
                    define14: courseInfoTemp.attrext92,
                    traineeCount: courseInfoTemp.traineeCount,
                    passPercent: courseInfoTemp.passPercent,
                    avgScore: courseInfoTemp.avgScore
                  };
                  CourseInfoList.push(courseInfo);
                }
                if (item.TrainingBaseInfoList.find((TrainingBaseInfo) => TrainingBaseInfo.courseInfo.define16 === courseInfoTemp.attrext96.replace("&nbsp;", ""))) {
                } else {
                  item.TrainingBaseInfoList.push({
                    protocolNo: trainingBaseInfo.protocolNo,
                    earnHours: trainingBaseInfo.earnHours,
                    earnCredit: trainingBaseInfo.earnCredit,
                    define7: trainingBaseInfo.attrext85,
                    define15: trainingBaseInfo.attrext75,
                    score: trainingBaseInfo.score,
                    fee: trainingBaseInfo.fee == 0 ? null : trainingBaseInfo.fee,
                    hours: trainingBaseInfo.hours,
                    trainingStatus: trainingBaseInfo.trainingStatus,
                    courseInfo: courseInfo
                  });
                }
              }
            }
          }
          object.push(item);
        }
      });
    }
    if (CourseInfoList && CourseInfoList.length > 0) {
      var index = 0;
      var size = CourseInfoList.length;
      let tempCourseInfoList = [];
      while (index < size) {
        tempCourseInfoList.push(CourseInfoList[index]);
        if (index % 100 == 0) {
          var resCourseInfoList = ObjectStore.insertBatch("GT15AT1.GT15AT1.CourseInfo", tempCourseInfoList, "34783374");
          var CourseCount = resCourseInfoList.length;
          for (var i = 0; i < CourseCount; i++) {
            let courseInfo = CourseInfoList.find((courseInfo) => courseInfo.define16 === resCourseInfoList[i].define16);
            courseInfo.id = resCourseInfoList[i].id;
          }
          tempCourseInfoList = [];
        }
        index++;
      }
      if (tempCourseInfoList.length > 0) {
        var resCourseInfoList = ObjectStore.insertBatch("GT15AT1.GT15AT1.CourseInfo", tempCourseInfoList, "34783374");
        var CourseCount = resCourseInfoList.length;
        for (var i = 0; i < CourseCount; i++) {
          let courseInfo = CourseInfoList.find((courseInfo) => courseInfo.define16 === resCourseInfoList[i].define16);
          courseInfo.id = resCourseInfoList[i].id;
        }
      }
    }
    let tempObject = [];
    if (object && object.length > 0) {
      var index = 0;
      var size = object.length;
      while (index < size) {
        tempObject.push(object[index]);
        if (index % 100 == 0) {
          ObjectStore.insertBatch("GT15AT1.GT15AT1.TraineeInfo", tempObject, "1edd0436List");
          tempObject = [];
        }
        index++;
      }
      if (tempObject.length > 0) {
        ObjectStore.insertBatch("GT15AT1.GT15AT1.TraineeInfo", tempObject, "1edd0436List");
      }
    }
    return { tempObject };
  }
}
exports({ entryPoint: MyAPIHandler });