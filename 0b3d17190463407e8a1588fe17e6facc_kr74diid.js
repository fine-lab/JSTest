let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let getTokenFun = extrequire("GT15AT1.api.getToken");
    //获取当前登录用户对应员工的部门信息
    let token = getTokenFun.execute(request);
    let accessToken = token.access_token;
    debugger;
    let strResponse = postman("post", "https://www.example.com/" + accessToken, null, JSON.stringify(request));
    let jsonRes = JSON.parse(strResponse);
    let object = [];
    if (jsonRes.code === "200") {
      var length = jsonRes.data.length;
      jsonRes.data.forEach((itemData) => {
        var item = {
          printNum: request.printNum,
          courseId: itemData.courseId,
          define16: itemData.attrext96,
          define1: itemData.attrext79,
          content: itemData.content,
          beginDate: itemData.beginDate,
          endDate: itemData.endDate,
          classifiCation: itemData.classifiCation,
          define17: itemData.attrext97,
          dayOrHours: itemData.dayOrHours,
          define3: itemData.attrext81,
          define4: itemData.attrext82,
          define5: itemData.attrext83,
          define6: itemData.attrext84,
          define8: itemData.attrext86,
          define9: itemData.attrext87,
          define10: itemData.attrext88,
          define11: itemData.attrext89,
          define12: itemData.attrext90,
          define13: itemData.attrext91,
          define14: itemData.attrext92,
          traineeCount: itemData.traineeCount,
          passPercent: itemData.passPercent,
          avgScore: itemData.avgScore,
          TraineeScoreList: []
        };
        if (itemData.TraineeScoreList) {
          var traineeCount = 0;
          var passPercent = 0;
          var avgScore = 0;
          var passCount = 0;
          var totalScore = 0;
          var recordNum = 0;
          var count = itemData.TraineeScoreList.length;
          for (var i = 0; i < count; i++) {
            let traineeScoreData = itemData.TraineeScoreList[i];
            traineeCount++;
            //总分数
            if (traineeScoreData.score) {
              totalScore = totalScore * 1.0 + traineeScoreData.score * 1.0;
              if (traineeScoreData.score >= 60) {
                passCount++;
              }
            }
            if (traineeCount % 4 == 1) {
              recordNum++;
              item.TraineeScoreList.push({
                printNum: request.printNum,
                staffName1: null,
                score1: null,
                staffName2: null,
                score2: null,
                staffName3: null,
                score3: null,
                staffName4: null,
                score4: null,
                recordNum: recordNum
              });
              item.TraineeScoreList[item.TraineeScoreList.length - 1].printNum = request.printNum;
              item.TraineeScoreList[item.TraineeScoreList.length - 1].staffName1 = traineeScoreData.staffName;
              item.TraineeScoreList[item.TraineeScoreList.length - 1].score1 = traineeScoreData.score;
            }
            if (traineeCount % 4 == 2) {
              item.TraineeScoreList[item.TraineeScoreList.length - 1].staffName2 = traineeScoreData.staffName;
              item.TraineeScoreList[item.TraineeScoreList.length - 1].score2 = traineeScoreData.score;
            }
            if (traineeCount % 4 == 3) {
              item.TraineeScoreList[item.TraineeScoreList.length - 1].staffName3 = traineeScoreData.staffName;
              item.TraineeScoreList[item.TraineeScoreList.length - 1].score3 = traineeScoreData.score;
            }
            if (traineeCount % 4 == 0) {
              item.TraineeScoreList[item.TraineeScoreList.length - 1].staffName4 = traineeScoreData.staffName;
              item.TraineeScoreList[item.TraineeScoreList.length - 1].score4 = traineeScoreData.score;
            }
          }
          //实际培训人数
          item.traineeCount = traineeCount;
          if (traineeCount > 0) {
            //通过率
            passPercent = passCount / traineeCount;
            //平均成绩
            avgScore = totalScore / traineeCount;
          }
          if (passPercent == 0) {
            item.passPercent = 0;
          } else {
            item.passPercent = passPercent * 100.0;
          }
          if (avgScore == 0) {
            item.avgScore = 0;
          } else {
            item.avgScore = avgScore;
          }
        }
        if (item.define1) {
          item.define1 = item.define1.substr(0, 199);
        }
        if (item.content) {
          item.content = item.content.replace("&nbsp;", "").substr(0, 199);
        }
        object.push(item);
      });
    }
    let tempObject = [];
    if (object && object.length > 0) {
      var index = 0;
      var size = object.length;
      while (index < size) {
        tempObject.push(object[index]);
        if (index % 100 == 0) {
          ObjectStore.insertBatch("GT15AT1.GT15AT1.CourseInfo", tempObject, "34783374");
          tempObject = [];
        }
        index++;
      }
      if (tempObject.length > 0) {
        ObjectStore.insertBatch("GT15AT1.GT15AT1.CourseInfo", tempObject, "34783374");
      }
    }
    return { tempObject };
  }
}
exports({ entryPoint: MyAPIHandler });