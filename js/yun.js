
	var app=angular.module("reminder",[]);
	app.directive("myUl",[function(){
		return{
			restrict:'A',
			replace:true,
			template:'<ul class="list-group"><div ng-transclude></div></ul>',
			transclude:true,
			link:function($scope,el){
				$(document).on("keyup",":input",false)
				
				$(el).on('click','li',function(){
					$(el).find('li').removeClass('active');
					$(this).addClass('active');
					var self=this;
					$scope.$apply(function(){
						$scope.cu=$(self).index();
					})
				});
				
				$(el).on("keyup","input",false);
				$(document).on('keyup',function(e){
					if(e.keyCode===8||e.keyCode===46){
						var index=$('.active').index();
						
						$scope.$apply(function(){
							if(index==-1){
								return;
							}else{
								if($scope.cu==0)
								{
									return;
								}else{
									$scope.lists.splice(index,1);								
									$scope.cu=$scope.cu-1;
								}
								$scope.save2local();
							}
						});
					}
				})
				
			}
		}
	}])
	//$scope.$watch()监听		$scope.$digest()消化
	//controller内部的函数操作或者赋值操作时候没次都隐式调用
	//$scope.$digest()查看watch的值与现在的值比较，不同，就重绘
	app.directive("block",[function(){
		return{
			restrict:"AE",
			template:'<div class="add"><input type="text" placeholder="新项目"  disabled/></div>',
			replace:true,
			transclude:true,
			link:function($scope,el){
				var obj=$(".right-finish .import");
				$(el).on("click",function(){
					obj.toggleClass("active")
					$(".right-finish .import input").focus()
					return false;
				})
				obj.on("click",false)
				$(document).on("click",function(){
					obj.removeClass("active");
				})
				
			}
			
		}
	}])
	app.controller("mainCtrl",["$scope",function($scope){
		$scope.colors=["purple","green","blue","yellow","brown","pink","orange"];
		
		$scope.cu=0;
		
		if(localStorage.reminder){
			$scope.lists=JSON.parse(localStorage.reminder);
		}else{
			$scope.lists=[];
		}
		//
		$scope.save2local=function(){
			localStorage.reminder=JSON.stringify($scope.lists);
		}
		
//		$scope.lists=[{id:100,name:'默认',theme:'purple',todos:[{name:'已完成',state:1},{name:'未完成',state:0}]}];

		
		$(".choose .color").on("click","li",function(){
			var index=$(this).index();
			$(".choose .color").find("li").removeClass("active");
			$(".choose .color").find("li").eq(index).addClass("active");
		})
		
		function maxId(){
			var max=-Infinity;
			for(var i=0;i<$scope.lists.length;i++){
				var v=$scope.lists[i];
				if(v.id>max){
					max=v.id;
				}
			}
			return (max===-Infinity) ? 100:max;
		}
		//添加
		$scope.addList=function(){
			var len=$scope.lists.length;
			var index=len%7;
			var v={
				id:maxId()+1,
				name:"新列表"+(len+1),
				theme:$scope.colors[index],
				todos:[]
			};
			$scope.lists.push(v);
		}
		//删除
		$scope.delList=function(){
			if($scope.cu==-1){
				return;
			}else{
				if($scope.cu==0)
				{
					return;
				}else{
					$scope.lists.splice($scope.cu,1);
					
					$scope.cu=$scope.cu-1;
				}
				$scope.save2local();
			}
//				$scope.lists.splice($scope.cu,1);
		}
		//count
		$scope.count0=function(){
			var r=0;
			$scope.lists[$scope.cu].todos.forEach(function(v,i){
				if(v.state===0){
					r++;
				}
			});
			return r;
		}
		$scope.count1=function(){
			var r=0;
			$scope.lists[$scope.cu].todos.forEach(function(v,i){
				if(v.state===1){
					r++;
				}
			});
			return r;
		}
		$scope.clear=function(){
			var newarr=[];
			$scope.lists[$scope.cu].todos.forEach(function(v,i){
				if(v.state===0){
					newarr.push(v);
				}
			});
			$scope.lists[$scope.cu].todos=newarr;
//			console.log(newarr)
		}
		//颜色选择模块出现
		$scope.color=function(e){
			e.preventDefault()
           		e.stopPropagation()
			$(".choose").toggle();
			return false;
		}
		$(".choose").on("click",false);
		
		$(document).on("click",function(){
			$(".choose").hide();
		})
	
		
	}])
