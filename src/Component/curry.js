function add (a,b){
	return a+ b 
}

function curry(func){
    let args = [].slice.call(arguments,1);
    return function(){
        let newArgs = args.concat([].slice.call(arguments));
        return func.apply(this,newArgs);
    }
}
let addCurry = curry(add);
  addCurry(1,2) //3
 
function CurryA(a){
  return function(b){
  	return a + b 
  }
}
CurryA(1)(2)