(function(){
  function apply(_)
  {
    if(!_.eachDeep){
      _.eachDeep = function(obj,callback){
        iterate(obj,"",0,null,"","",callback);
      };
    }
    function iterate(obj,path,depth,parent,parentKey,parentPath,callback)
    {
      path = _.trim(path,'.');
      parentPath = _.trim(parentPath,'.');
      _.forOwn(obj,function(value,key){
        var okey = key;
        if(_.isArray(obj))
          key='['+key+']';
        else
        {
          if(_.isString(key)&&key.match(/^[a-zA-Z_$]+([\w_$]*)$/))
            key='.'+key;
          else
            key='["'+key+'"]';
        }
        var res = callback(value,okey,_.trim(path+key,'.'),depth,obj,parentKey,_.trim(path,'.'));
        if(res!==false && _.isObject(value))
        {
          iterate(value,path+key,depth+1,obj,okey,path,callback);
        }
      });
    }
    return _;
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
      module.exports = apply;
  else if(_)
    apply(_);
  else
    throw new Error("No lodash to patch");
})();