//Date:2018年8月16日 21:31:02
//author:小鑫
//name:jxuery
(function(){
    var jxuery = function(req){
        //a获取元素
        req = req.split(":");
        try{
            if(req.length>2)console.error("Maximum two parameters")
        }catch{}
        return new fn(req);
    }
    var fn = function(req){
        this.el = document.querySelectorAll(req[0]);
        this.el.forEach(function(item,index){
            item.index = index;
        })
        this.el = this.select(req);   //处理req
        if(this.el.length<=0)return this;
    }
     fn.prototype = {
        css(ev){
            //arguments
            if(arguments.length==0){    //最少一个参数
                console.error("At least one parameter")
            }
            if(arguments.length>2){  // 传递过来的参数 大于2
                console.error("Maximum two parameters");
                return false;
            }
            if(typeof ev != "object"){// 传递过来的参数 不是对象
                if(arguments.length == 1){  //读取属性的话
                    let style = [];
                    for(var i = 0;this.el[i]!=undefined;i++){   //循环读取属性
                        style.push(getComputedStyle(this.el[i],null)[arguments[0]].replace("px",""));
                    }
                    return style;
                }
                for(var i = 0;this.el[i]!=undefined;i++){   //写入数据
                    this.el[i].style[arguments[0]] = arguments[1];
                }
            } else{ //如果是对象传入的话
                let data = arguments[0]
                this.el.forEach((item,index)=>{
                    for(item in data){
                        this.el[index].style[item] = data[item];
                    }
                })
            }
            return this;
        },
        animate(...req){   //动画子能封装为对象
            let data = req[0];
            this.el.forEach((item,index)=>{
                setTimeout(()=>{
                    for(item in data){
                        this.el[index].style[item] = data[item];
                    }
                },10)
                this.el[index].style["transition"] = `all ${req[1]/2000}s ease ${req[1]/2000}s`
            })
            return this;
        },
        attr(get,set){
            if(set == undefined){   //读取属性
                let data = [];
                this.el.forEach((item,index)=>{
                    data.push(item.getAttribute(get));
                })
                return data;
            }   //写入属性
            this.el.forEach((item,index)=>{
                item.setAttribute(get,set);
            })
            return this;
        },
        remove(req){
            if(req == undefined){
                this.el.forEach((item,index)=>{ //删除自己包括所有子孙
                    item.remove();
                })
                return this;
            }
            this.el.forEach((item,index)=>{
                let ev = item.querySelectorAll("p");
                ev.forEach(function(item,index){
                    item.remove();
                })
            })
            return this;
        },
        insert(req,index){
            let title = req.substr(req.search("<")+1,req.search(">")-1);  //获取首元素
            console.log(title);
            //取出其他属性
            ago = title.split(" ");
            
            //去除所有空格
            ago[0] = ago[0].replace(" ","");
            
            //去除首个元素
            let val = req.substr(0+title.length + 2,req.length);
            val = val.substr(0,val.length - ago[0].length - 3);
            //重新创建首元素
            let create = document.createElement(ago[0]);
            //去除标签
            ago.splice(0,1);
            //拆开字符串
            for(item in ago){
                ago[item] = ago[item].split("=");
            }
            //将元素添加到新创建的元素
            create.innerHTML = val;
            //添加所有属性
            for(var i = 0;ago[i]!=undefined;i++){
                ago[i][0] = ago[i][0].replace(/\'/g,"");
                ago[i][1] = ago[i][1].replace(/\'/g,"");
                create.setAttribute(ago[i][0],ago[i][1])
            }
            //插入
            this.el.forEach((item)=>{
                item.insertBefore(create,item.childNodes[index]);
            })
            return this;
        },
        wrap(){

        },
        html(req){
            if(req == undefined){
                let data = [];
                this.el.forEach((item,index)=>{
                    data.push(item.innerHTML);
                })
                return data;
            }
            this.el.forEach((item,index)=>{
                item.innerHTML = req;
            })
            return this;
        }, 
        val(req){
            if(req == undefined){
                let data = [];
                this.el.forEach((item,index)=>{
                    data.push(item.value);
                })
                return data;
            }
            this.el.forEach((item,index)=>{
                item.value = req;
            })
            return this;
        },
        text(req){
            if(req == undefined){
                let data = [];
                this.el.forEach((item,index)=>{
                    data.push(item.innerText);
                })
                return data;
            }
            this.el.forEach((item,index)=>{
                item.innerText = req;
            })
            return this;
        },
        slideDown(height,timer){
            if(typeof height == "string")height = parseInt(height.replace("px",""));
            walk = height / (timer / 50);
            this.el.forEach((item,index)=>{
                var time = setInterval(()=>{
                    let Current = parseInt(getComputedStyle(item,null)["height"].replace("px",""));
                    Current += walk;
                    item.style["height"] = Current + "px";
                    if(Current >= height)clearInterval(time)
                },12)
            })
            return this;
        },
        slideUp(timer){
            this.el.forEach((item,index)=>{
                let height = parseInt(getComputedStyle(item,null)["height"].replace("px",""));
                walk = height / (timer / 50);
                var time = setInterval(()=>{
                    height -= walk;
                    item.style["height"] = height + "px";
                    if(height <= 0)clearInterval(time)
                },12)
            })
            return this;
        },
        slideTaggle(height,timer){
            this.el.forEach((item,index)=>{
                let Current = parseInt(getComputedStyle(item,null)["height"].replace("px",""));
                if(Current>0){
                    this.slideUp(timer)
                    return this;
                }
                this.slideDown(height,timer)
                return this;
            })
        },
        show(timer){
            if(timer == undefined){
                this.el.forEach((item,index)=>{
                    item.style["visibility"] = "visibility";
                })
                return this;
            }
        },
        hide(timer){
            if(timer == undefined){
                this.el.forEach((item,index)=>{
                    item.style["visibility"] = "hidden";
                })
                return this;
            }
        },
        bind(req,fun,bool){
            if(bool==0){
                this.el.forEach((item,index)=>{
                    item[req] = fun.bind(this);
                })
                return this
            }
            this.el.forEach((item,index)=>{
                item.addEventListener(req,fun.bind(item));
            })
            return this
        },
        unbind(req,fun){
            this.el.forEach((item,index)=>{
                item.removeEventListener(req,fun);
            })
        },
        index(){
            return this;
        },
        click(req){
            this.bind("onclick",req,0);
        },
        mousedown(req){
            this.bind("onmousedown",req,0);
        },
        mouseup(req){
            this.bind("onmouseup",req,0);
        },
        mouseout(req){
            this.bind("onmouseout",req,0);
        },
        mousemove(req){
            this.bind("onmousemove",req,0);
        },
        mouseover(req){
            this.bind("onmouseover",req,0);
        },
        keydown(req){
            this.bind("onkeydown",req,0);
        },
        keyup(req){
            this.bind("onkeyup",req,0);
        },
        blur(req){
            this.bind("onblur",req,0);
        },
        focus(req){
            this.bind("onfocus",req,0);
        },
        change(req){
            this.bind("onchange",req,0);
        },
        dblclick(req){
            this.bind("ondblclick",req,0);
        },
        select(req){
            if(req.length<=1)return this.el;
            let str = req[1].split("(");
            str[1] = str[1].replace(")","");
            switch(str[0]){
                case "even":
                    return this.even();
                case "odd":
                    return this.odd();
                    break;
                case "eq":
                    return this.eq(str[1]);
                    break;
                case "lt":
                    return this.lt(str[1]);
                    break;
                case "gt":
                    return this.gt(str[1]);
                    break;
                case "contains":
                    return this.contains(str[1]);
                    break;
            }
        },
        even(req){
            let data = [];
            this.el.forEach(function(item,index){
                if(index%2==0){
                    data.push(item);
                }
            })
            return data;
        },
        odd(req){
            let data = [];
            this.el.forEach(function(item,index){
                if(index%2==1){
                    data.push(item);
                }
            })
            return data;
        },
        contains(req){
            let data = [];
            this.el.forEach(function(item,index){
                if(item.innerHTML.indexOf(req)!=-1){
                    data.push(item);
                }
            })
            return data;
        },
        eq(req){
            let data = [];
            this.el.forEach(function(item,index){
                if(req == index){
                    data.push(item);
                }
            })
            return data;
        },
        lt(req){
            let data = [];
            this.el.forEach(function(item,index){
                if(req < index){
                    data.push(item);
                }
            })
            return data;
        },
        gt(req){
            let data = [];
            this.el.forEach(function(item,index){
                if(req > index){
                    data.push(item);
                }
            })
            return data;
        }
    }
    window.$ = jxuery;
}())