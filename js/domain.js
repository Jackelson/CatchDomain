//添加账户
$('#accon-add').click(function() {
	let count = $('#demo-key').val();
	let passw = $('#demo-password').val();
	let countName = $('#accon').val();
	let interval = parseInt($('#interval').val()) * 1000;
	console.log(interval);
	let newarr = JSON.parse(localStorage.getItem('platform')) || [];
	newarr.push({
		name: countName,
		key: count,
		password: passw,
		interval: interval
	})
	localStorage.setItem('platform', JSON.stringify(newarr));
	render();
});
//添加域名
$('#domain-add').click(function() {
	let domain = $('#demo-name').val();
	let platforms = $('#platforms').val();
	let startDate = $('#start-date').val();
	let endDate = $('#end-date').val();
	let domains = JSON.parse(localStorage.getItem('domains')) || [];
	domains.push({
		name: domain,
		platforms: platforms,
		startDate: startDate,
		endDate:endDate
	})
	localStorage.setItem('domains', JSON.stringify(domains));
	renderList();
    window.location.reload();
});

//渲染域名列表
function renderList(){
	let domains = JSON.parse(localStorage.getItem('domains')) || [];
	let doarr = '';
	domains.forEach(function(ele,index){
		doarr+= `
			<tr>
				<td>${index+1}</td>
				<td>${ele.name}</td>
			    <td>${ele.platforms}</td>
				<td>${ele.startDate}</td>
				<td>${ele.endDate}</td>
				<td id = 'edit' class = 'eidt' date-id = '${index+1}'>修改</td>
				<td id = 'del' class = 'del' date-id = '${index+1}'> 删除</td>
			</tr>		
		`
	})
	$('#d-list').html(doarr);

}

//给删除按钮绑定事件  需要用到事件委托
function addEvent(){
	$("#d-list").on('click','tr',function(e){
		const ar  = e.target;
		if(ar.innerText === '修改'){
			editDomain($(ar).attr('date-id'))
		}else if(ar.innerText === '删除'){
			deleteDomain($(ar).attr('date-id'))		
		}else{
			return
		}
	})
}
function editDomain(){
//	把表格变成可输入状态
//  1.此时需要实时跟踪表单内容的改变
	
//  表格失去焦点提交表单
//	获取到localstorage的内容，根据id找到要修改的内容
//  获取到表格的内容,然后提交至localstorage中
//   	
}
function deleteDomain(id){
	let domains = JSON.parse(localStorage.getItem('domains')) || [];
   	domains.splice(id-1,1);
	localStorage.setItem('domains', JSON.stringify(domains));
	renderList();
    window.location.reload();
}

addEvent();
/**
 *  如何能让域名和账户绑在一起调用。
 * 	通过遍历的方式，将域名和信息遍历出来，需要再重新保存一下域名信息，和抢注账户的信息，和请求次数。
 */
//获取列表中域名的信息
function getdomainmes() {
	var querst = new Quest();
}
//拿到的是一个数组，
//需要不断去比较时间，
//定时器关闭时候怎么判断
//通过构造函数来进行定时器的修改

function Quest(){	
	this.countDown();
}
Quest.prototype.timer = null;
//判断有没有到抢注的时间
Quest.prototype.countDown = function(){
	const self = this;
	const dTime =JSON.parse(localStorage.getItem('domains')) || [];	
//	每一毫秒判断一次;
	this.timer1 = setInterval(function(){
	    dTime.forEach(function(ele){
	    	let sdate = new Date(ele.startDate);
	    	let edate = new Date(ele.endDate);
	    	let stimer = sdate.getTime();
	    	let etimer = edate.getTime();
	    	let nowdate = new Date();
	    	let pnowdate = nowdate.getTime();
	    	if(this.timer){
	    	    return
            }
	    	if(pnowdate >= stimer &&  pnowdate <= etimer){
                    this.timer = setInterval(()=>{
                        self.qAjax(ele.name,ele.platforms);
                    },6000)
	    	}
	    	if(pnowdate > etimer){
	    	    clearInterval(this.timer);
	    	}
	    })
	},1)
}
Quest.prototype.qAjax = function(name,count){

//	通过传进来的数据进行抢注平台的信息获取
	let a = JSON.parse(localStorage.getItem('platform')) || [];
  	let c = a.filter(function(ele)  {
		return ele.name === count;
	})[0];
//	使用ajax进行数据请求
	$.ajax({
			url: 'https://json.aftermarket.pl/domain/add',
			type: 'POST',
			data: `name=${name}`,
			dataType: 'json',
			headers: {
				'Authorization': 'Basic ' + btoa(`${c.key}:${c.password}`)
			},
			success: function(result) {
				renderMes(result);
			},
			error: function(result, text) {
				console.log(result.responseText != '' ? result.responseText : 'Error: ' + result.status + ' ' + result.statusText);
			},
			complete: function(result, text) {
				//						$('#demo-output-animation').hide();
			}
	})
}
function render() {
	let arrlist = '';
	let plaarray = JSON.parse(localStorage.getItem('platform')) || [];
	plaarray.forEach(function(ele){
		arrlist+=`<option value="${ele.name}">${ele.name}</option>`
	})
	$('#platforms').html(arrlist);
}
const mesWrap = document.querySelector('.mes');
function renderMes(mes){
	console.log(mes);
	const mesDom = document.createElement('li');
	mesDom.innerHTML = `状态码: ${mes.status}&nbsp&nbsp&nbsp 内容：${mes.error}`;
	mesDom.className = 'list-group-item';
	mesWrap.appendChild(mesDom);
}

getdomainmes();
render();
renderList();
