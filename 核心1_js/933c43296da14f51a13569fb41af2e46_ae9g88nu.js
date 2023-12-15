cb.defineInner([], function () {
  var MyExternal = {
    //判断当前开关
    getSwitchBoolean(switchValue) {
      if (extendGspType === true || extendGspType == "true" || extendGspType == "1") {
        return true;
      } else {
        return false;
      }
    }
  };
  return MyExternal;
});