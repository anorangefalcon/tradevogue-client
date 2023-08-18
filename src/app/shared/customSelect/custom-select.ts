export class CustomSelect {
    
    constructor(private element: HTMLSelectElement){
        this.custom_Selection();
    }

    custom_Selection(){
        console.log(this.element.length);

        let selectElement: any;
        let  a: any;
        for(let e = 0; e<this.element.length; e++){

            this.element[e].classList.add('custom-select');

            // Original Select
            selectElement = this.element[e].getElementsByTagName('select')[0];

            let option__container:any;

            // Option Section
            option__container = document.createElement('div');
            option__container.setAttribute('class', 'options__container')

            for(let i = 0; i<selectElement.length; i++){

                let option:any;
                option = document.createElement('div');
                option.setAttribute('class', 'option');
                if(i == 0){
                    option.classList.add('selected');
                }
                option.innerHTML = selectElement.options[i].innerHTML;
                option.addEventListener('click', function(ele: any){
                        
                    // ele here refers to object when called upon
                    let select = ele.parentNode.parentNode.parentNode.getElementsByTagName('select')[0]; //Original
                    let sibling = ele.parentNode.nextSibling; 

                    for(let y =0; y<select.length; y++){
                        if(select.options[y].innerHTML == ele.innerHTML){
                            select.selectedIndex = y; // Updating Original Select 
                            sibling.innerHTML = ele.innerHTML; //Updating Entry in Custom Select
                            ele.parentNode.getElementsByClassName('selected')[0].classList.remove("selected");
                            ele.classList.add("selected"); // Updating Selected Element
                            ele.parentNode.classList.remove('active');
                            break;
                        }
                    }
                });
                option__container.append(option);
            }
            this.element[e].append(option__container); 

            // Heading Section
            a = document.createElement('div');
            a.setAttribute('class', 'select-selected');
            a.setAttribute('tabindex','0'); //Add Focus to the custom-select

            let check: boolean = false;
            a.addEventListener('focus', function(this: any){
                console.log(this.previousSibling);
                this.previousSibling.classList.toggle('active');
                // check = true;
            })

            a.addEventListener('blur', function(this: any){
                this.previousSibling.classList.remove('active');
            })

            this.element[e].append(a);
            a.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;
            
            a.addEventListener('focus' && 'click',function(this: any){
                // closeAllSelect(this);
                // (check == true) ? check = false: this.previousSibling.classList.toggle('active');
                // if (check === true){
                //     this.previousSibling.classList.remove('active');
                //     check = false;
                // }
                // else{
                //     this.previousSibling.classList.add('active');
                //     check = true;
                // }
                this.previousSibling.classList.toggle('active');
            });
        }
    }

    
}
