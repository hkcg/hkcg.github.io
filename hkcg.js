window.addEventListener('load', () => {
    populateOptions(); 
});

var selectedDistricts=[];  //['油尖旺','九龍城','深水埗'];
var minCount=2;
var n1=[];
var e1=[];

function populateOptions() {
    var s=document.getElementById('selects');
    for(i=0;i<d.length;i++) {
        var newOption = document.createElement("option");
        newOption.value=d[i].district;
        newOption.textContent=d[i].district;
        newOption.classList.add(d[i].scheme);
        s.appendChild(newOption);
    }
    selectDistricts(false);	//selectDistricts(false);
}

function selectDistricts(allDistricts){
    var s=document.getElementById('selects');

    if (allDistricts) { // refresh the selected districts
        selectedDistricts=[];
        for (var i = 0; i<s.options.length; i++) { 
                        if (s.options[i].value!="") {
                s.options[i].selected = true; 
                selectedDistricts.push(s.options[i].value);
            } else {
                s.options[i].selected = false; 
            }
        }
    } else {
        let selected=0;
        for (var j=0; j<selectedDistricts.length; j++) {
            for (var i=0; i<s.options.length; i++) {
                if (s.options[i].value==selectedDistricts[j]) {
                    if (s.options[i].value!="") {
                        s.options[i].selected=true;
                        selected+=1;
                    }
                }
            }
        }
        if (selected==0) {
            s.options[0].selected=true;
        }
    }
    find(selectedDistricts);

}

function checkAll() {
    var s=document.getElementById('selects');
    var c=document.getElementById('chk');

    if (c.checked==true) {
      selectDistricts(true);
    } else {
      selectedDistricts=[];
      s.options[0].selected=true;
      for (var i=1; i<s.options.length; i++) {
          s.options[i].selected=false;
	  }
      selectDistricts(false);
	}
}

function changeDistrict() {
    var s=document.getElementById('selects');
    var c=document.getElementById('chk');

    selectedDistricts=[];
    for (var i=0; i<s.options.length; i++) { 
         if (s.options[i].selected) {
            if (s.options[i].value!="") {
                selectedDistricts.push(s.options[i].value);
            } else {
                s.options[i].selected=false;
            }
         }
    }
    if (selectedDistricts.length==0) {
        s.options[0].selected=true;
        c.checked=false;
    } else {
        if ((s.options.length>0) && (!s.options[0].selected) && (selectedDistricts.length==s.options.length-1)) {
            c.checked=true;
        } else {
            c.checked=false;  
		}
    }
    find(selectedDistricts);
}

function find(sDistricts) {
    var foundNodes=[];
    var foundEdges=[];

    // update building nodes 
    for (var i=0; i<sDistricts.length; i++) {
        let found=n.filter(found=>found.district===sDistricts[i] && found.value>=minCount);
        foundNodes.push(...found);
    }
    
    // update edges
    for (var i=0; i<foundNodes.length; i++) {
        let found=e.filter(found=>found.to===foundNodes[i].id);
        foundEdges.push(...found);
    }

    // update patient nodes
    for (var i=0; i<foundEdges.length; i++) {
        var patients=[];
        let exists=foundNodes.find(exists=>exists.id===foundEdges[i].from);
        if(exists == null){
            let node=n.filter(node=>node.id===foundEdges[i].from);
            patients.push(...node);
        }
        foundNodes.push(...patients);
    }

    // refresh data
    n1=foundNodes;
    e1=foundEdges;
    draw();
}



