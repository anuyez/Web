let info = document.querySelector('#info');
let btn = document.querySelector('#btn');
		
btn.onclick = function(){
	let value = info.value;
    if(value!=''){
        console.log(value);
	    info.value = '';//清空info的原本内容
    }
}
		
info.onkeyup = function(e){
    //console.log(e.keyCode);//建盘的按健对对应的ascII码
    // 添加过滤，只有回车抬起才讲内容存到div中
    let value = info.value;
    if(e.keyCode == 13 && value!=''){
	    console.log(value);
	    info.value = '';//清空info的原本内容
    }
}
		