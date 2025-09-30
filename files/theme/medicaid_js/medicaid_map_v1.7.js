let width = 800,
    height = 600,
    active = d3.select(null),
	active_click = d3.select(null)
	;

// Initialize Trend Analyzer
const trendAnalyzer = new TrendAnalyzer();

// Rural/Urban Analyzer (will be initialized after data loads)
let ruralUrbanAnalyzer = null;

let projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2]);

let path = d3.geoPath()
    .projection(projection);

window.mobileAndTabletCheck = function() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };
var ua = window.navigator.userAgent;
const isiOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i)
const isMobile = window.mobileAndTabletCheck() || isiOS==true;

/*
SVG Graph for MAP
*/
const svg = d3.select("#cavnas").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

const g1 = svg.append("g")
    .style("stroke-width", "1.5px");

const g2 = svg.append("g")
        .style("stroke-width", "1.5px");
const g3 = svg.append("g")
        .style("stroke-width", "1.5px");
/*
SVG for Legend
*/
const lwidth=800, lheight=112;
const legend = d3.select("#legend").append("svg")
    .attr("width", lwidth)
    .attr("height", lheight)
    .style("user-select", "none");

legend.append("rect")
    .attr("class", "background")
    .attr("width", lwidth)
    .attr("height", lheight)
    .style("user-select", "none");

/*
SVG for Slider Graph
*/
const swidth=515, sheight=300;
const slider_svg=d3.select("#slider_graph").append("svg")
      .attr("width",swidth)
      .attr("height",sheight)
      .style("user-select", "none");

/*Specialty related Variables*/
const specs=['OBGYN', 'Family Medicine', 'Internal Medicine',
             'Pediatrics', 'APRN', 'Physician Assistant'];
const ordered_specs=['Family Medicine', 'Internal Medicine',
             'Pediatrics', 'OBGYN', 'APRN',  'Physician Assistant'
              ]
let s_specs=['OBGYN', 'Family Medicine', 'Internal Medicine',
             'Pediatrics', 'APRN', 'Physician Assistant'];
const volume=['Volume1','Volume2','Volume3','Volume4','Volume5']
let s_volume=['Volume3','Volume4','Volume5']
const nvolume=['nVolume1','nVolume2','nVolume3','nVolume4','nVolume5']
let s_nvolume=['nVolume2','nVolume3','nVolume4','nVolume5']
/*Single Show Warning Flags*/
let init_warning=1;
let init_warning2=1;

/*Maps*/
let maps_states=0;
let maps_counties=0;
let measure='p2pratio';

/*National and State Quintile for Legend*/
let natl_quintiles={'states':{'q0':null,'q1':null,'q2':null,'q3':null,'q4':null,'q5':null}, 'counties':{'q0':null,'q1':null,'q2':null,'q3':null,'q4':null,'q5':null}};
let natl_pct_quintiles={'states':{'q0':null,'q1':null,'q2':null,'q3':null,'q4':null,'q5':null}, 'counties':{'q0':null,'q1':null,'q2':null,'q3':null,'q4':null,'q5':null}};
let state_quintiles={};
let state_pct_quintiles={};
let dis_rank={1:5, 2:4, 3:3, 4:2, 5:1, 0:6}
let max_supply=100;
let max_supply_st={};
let min_supply_st={};
let max_supply_stlv=100;
let natl_supply=0;

//Selected State Variable for Legend Purposes
let selected_state='0';
let selected_statenm='';
let zoomed_in_state='0';

//Selected County Variable for Reset Maps;
let selected_county='0';
let selected_countynm='';


//Region versus States;
let flag_region=false;
let hhs_region=[];
let county_data=0;
let state_data=0;
let national_data=0;
let dq_data=0;
let dq_data1=0;
let dq_data2=0;

//state;
const st_dict={'Alabama':'AL', 'Alaska':'AK', 'Arizona':'AZ', 'Arkansas':'AR', 'California':'CA', 'Colorado':'CO', 
              'Connecticut':'CT', 'Delaware':'DE', 'District of Columbia':'DC', 'Florida':'FL', 'Georgia':'GA', 
              'Hawaii':'HI', 'Idaho':'ID', 'Illinois':'IL', 'Indiana':'IN', 'Iowa':'IA', 'Kansas':'KS', 'Kentucky':'KY', 
              'Louisiana':'LA', 'Maine':'ME', 'Maryland':'MD', 'Massachusetts':'MA', 'Michigan':'MI', 'Minnesota':'MN', 
              'Mississippi':'MS', 'Missouri':'MO', 'Montana':'MT', 'Nebraska':'NE', 'Nevada':'NV', 'New Hampshire':'NH',
               'New Jersey':'NJ', 'New Mexico':'NM', 'New York':'NY', 'North Carolina':'NC', 'North Dakota':'ND', 'Ohio':'OH',
                'Oklahoma':'OK', 'Oregon':'OR', 'Pennsylvania':'PA', 'Rhode Island':'RI', 'South Carolina':'SC', 'South Dakota':'SD', 
                'Tennessee':'TN', 'Texas':'TX', 'Utah':'UT', 'Vermont':'VT', 'Virginia':'VA', 'Washington':'WA', 'West Virginia':'WV', 
                'Wisconsin':'WI', 'Wyoming':'WY'}
const fips_dict = {  '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA', '08': 'CO', '09': 'CT', '10': 'DE', 
                    '11': 'DC', '12': 'FL', '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN', '19': 'IA', 
                    '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME', '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', 
                    '28': 'MS', '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH', '34': 'NJ', '35': 'NM', 
                    '36': 'NY', '37': 'NC', '38': 'ND', '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI', 
                    '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT', '50': 'VT', '51': 'VA', '53': 'WA', 
                    '54': 'WV', '55': 'WI', '56': 'WY', '72': 'PR'
                  };


//Rural/Urban Classification Data
let rucc_data = {};

//Load Up The JSON Files
Promise.all(
  [d3.json("./files/theme/medicaid_src/tl_2018_us_simplified.json"),
   d3.csv("./files/theme/medicaid_src/state-table.txt"),
   d3.csv("./files/theme/medicaid_src/county-table.txt"),
   d3.json("./files/theme/medicaid_src/specialty.json"),
   d3.csv("./files/theme/medicaid_src/state_dq.csv"),
   d3.csv("./files/theme/medicaid_src/national-table.txt"),
   d3.json("./Data Preprocessing/county_rucc_2023.json")
  ]
).then( function(files) {
  let us=files[0]
   state_data=files[1]
   county_data=files[2]
  let spec_xwalk=files[3]
  dq_data=files[4]
  national_data=files[5]
  rucc_data=files[6]
  reshape_dq(dq_data);


   county_data.forEach(
	element=>{element['specialty']=spec_xwalk[element['specialty']];}
   )
   state_data.forEach(
	element=>{element['specialty']=spec_xwalk[element['specialty']];}
   )
   national_data.forEach(
    element=>{element['specialty']=spec_xwalk[element['specialty']];}
     )
   state_data=reshape_state(state_data, hhs_region)
   county_data=reshape_county(county_data, hhs_region)
   national_data=reshape_natl(national_data)

   // Initialize Rural/Urban Analyzer after data loads
   ruralUrbanAnalyzer = new RuralUrbanAnalyzer(rucc_data);
   //console.log(county_data)
  /*Link State Data to State Features*/
  topojson.feature(us, us.objects.states).features.forEach(
     element => {element['properties']['Data']=state_data[element['properties']['STUSPS']];
                 let res=calc_ratio(element);
                 element['properties']['supply']=res[1];
                 element['properties']['supply_raw']=res[0];
                 element['properties']['pct_participating']=res[2];
                 element['properties']['supply_cat']=res[3];
                 element['properties']['tot_supply']=res[4];
               }
  );

 /*Link County Data to County Features*/
  topojson.feature(us, us.objects.counties).features.forEach(
     element => {element['properties']['Data']=county_data[element['properties']['GEOID']];
               let res=calc_ratio(element);
               element['properties']['supply']=res[1];
               element['properties']['supply_raw']=res[0];
               element['properties']['pct_participating']=res[2];
               element['properties']['supply_cat']=res[3];
               element['properties']['tot_supply']=res[4];
             }
  );

//Call The Function To Set Baseline Rank
calc_quintiles('states');
calc_quintiles('counties');

// create a tooltip
let Tooltip = d3.select("body")
  .append("div")
  .style("visibility", 'hidden')
  .attr("class", "tooltip")
  .attr("id",'m_tooltip')
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "3px")
  .style("z-index", "1070")
  .style("position", "absolute");

//Tooltip Mousefunctions
//Mouseover
var mouseover = function(event, d, s) {
  let name="";
  let ftype="";
  let rank=0;
  let s_year=document.getElementById('ddYear').value;
  if (d.properties.hasOwnProperty('COUNTYFP')){
    name=d.properties['NAMELSAD'];
    ftype='County';
    if (d3.select('input[name="pRank"]:checked').node().value=='national'){
      if (measure=='p2pratio'){
        rank=d.properties.supply_rank;
      } else{
        rank=d.properties.pct_rank;
      };
    }else{
      if (measure=='p2pratio'){
        rank=d.properties.st_supply_rank;
      } else{
        rank=d.properties.st_pct_rank;
      };
    };
  }else{
    name=d.properties['NAME'];
    ftype='State';
    if (measure=='p2pratio'){
      rank=d.properties.supply_rank;
    } else{
      rank=d.properties.pct_rank;
    };
  };

  /*Format HTML Table*/
  if (d.properties.Data[s_year]['dq_issue']!='1'){
  str='<table> <tr> <td> <b>'+name+"</b> </td> <td>Rank: "+dis_rank[rank].toString(10)+
      "<tr><td>Medicaid Provider to Population Ratio: </td><td>"+(Math.round(d.properties.supply*10)/10).toLocaleString("en-US")+"</td></tr>"+
      "<tr><td>"+ftype+" Medicaid Provider: </td><td>"+d.properties.supply_raw.toLocaleString("en-US")+"</td></tr>"+
      "<tr><td>% Provider Participating in Medicaid: </td><td>"+(Math.round(d.properties.pct_participating*10)/10).toString(10)+"%</td></tr>"+
      "<tr><td>"+ftype+" Medicaid Pop (est.): </td><td>"+d.properties.Data[s_year]['pop'].toLocaleString("en-US")+"</td></tr>"+
      "<tr><td><b>Provider Type</b></td><td><b>Count</b></td></tr>"
  }else{
    str='<table> <tr> <td> <b>'+name+"</b> </td> <td></td> </tr>"+
        "<tr style='font-size:10px'><td colspan='2'>*State has data quality issues in T-MSIS and is not included in rankings.</td></tr>" +
        "<tr><td>Medicaid Provider to Population Ratio: </td><td>"+(Math.round(d.properties.supply*10)/10).toLocaleString("en-US")+"</td></tr>"+
        "<tr><td>"+ftype+" Medicaid Provider: </td><td>"+d.properties.supply_raw.toLocaleString("en-US")+"</td></tr>"+
        "<tr><td>% Provider Participating: </td><td>"+(Math.round(d.properties.pct_participating*10)/10).toString(10)+"%</td></tr>"+
        "<tr><td>"+ftype+" Medicaid Pop (est.): </td><td>"+d.properties.Data[s_year]['pop'].toLocaleString("en-US")+"</td></tr>"+
        "<tr><td><b>Provider Type</b></td><td><b>Count</b></td></tr>"
  }
  let ordered_s_specs=ordered_specs.filter(value=>s_specs.includes(value))
  ordered_s_specs.forEach((item, i) => {
   str=str+"<tr><td>"+item+"</td><td>"+d.properties.supply_cat[item].toLocaleString("en-US")+"</td></tr>"
  });
  str=str+="</table>"
  let rect_viwer=document.getElementById('cavnas').getBoundingClientRect()
  let xpos=0
  if (event.pageX>(rect_viwer.left+rect_viwer.right)/2) {
    xpos=event.pageX-20-document.getElementById('m_tooltip').clientWidth
  }else{
    xpos=event.pageX+20
  }
  Tooltip
  .style("visibility", "visible")
  .html(str)
  .style("left", (xpos) + "px")
  .style("top", (event.pageY-20) + "px");
  active.classed("active", false);
  active = d3.select(this).classed("active", true);
}
//Mousemove
var mousemove = function(event, d, s) {
  active.classed("active", false);
  active = d3.select(this).classed("active", true);
  let name="";
  let ftype="";
  let rank=0;
  let s_year=document.getElementById('ddYear').value;

  if (d.properties.hasOwnProperty('COUNTYFP')){
    name=d.properties['NAMELSAD'];
    ftype='County';
    if (d3.select('input[name="pRank"]:checked').node().value=='national'){
      if (measure=='p2pratio'){
        rank=d.properties.supply_rank;
      } else{
        rank=d.properties.pct_rank;
      };
    }else{
      if (measure=='p2pratio'){
        rank=d.properties.st_supply_rank;
      } else{
        rank=d.properties.st_pct_rank;
      };
    };
  }else{
    name=d.properties['NAME'];
    ftype='State';
    if (measure=='p2pratio'){
      rank=d.properties.supply_rank;
    } else{
      rank=d.properties.pct_rank;
    };
  };
  /*Format HTML Table*/
  if (d.properties.Data[s_year]['dq_issue']!='1'){
  str='<table> <tr> <td> <b>'+name+"</b> </td> <td>Rank: "+dis_rank[rank].toString(10)+
      "<tr><td>Medicaid Provider to Population Ratio: </td><td>"+(Math.round(d.properties.supply*10)/10).toLocaleString("en-US")+"</td></tr>"+
      "<tr><td>"+ftype+" Medicaid Provider: </td><td>"+d.properties.supply_raw.toLocaleString("en-US")+"</td></tr>"+
      "<tr><td>% Provider Participating in Medicaid: </td><td>"+(Math.round(d.properties.pct_participating*10)/10).toString(10)+"%</td></tr>"+
      "<tr><td>"+ftype+" Medicaid Pop (est.): </td><td>"+d.properties.Data[s_year]['pop'].toLocaleString("en-US")+"</td></tr>"+
      "<tr><td><b>Provider Type</b></td><td><b>Count</b></td></tr>"
  }else{
    str='<table> <tr> <td> <b>'+name+"</b> </td> <td></td> </tr>"+
        "<tr style='font-size:10px'><td colspan='2'>*State has data quality issues in T-MSIS and is not included in rankings.</td></tr>" +
        "<tr><td>Medicaid Provider to Population Ratio: </td><td>"+(Math.round(d.properties.supply*10)/10).toLocaleString("en-US")+"</td></tr>"+
        "<tr><td>"+ftype+" Medicaid Provider: </td><td>"+d.properties.supply_raw.toLocaleString("en-US")+"</td></tr>"+
        "<tr><td>% Provider Participating: </td><td>"+(Math.round(d.properties.pct_participating*10)/10).toString(10)+"%</td></tr>"+
        "<tr><td>"+ftype+" Medicaid Pop (est.): </td><td>"+d.properties.Data[s_year]['pop'].toLocaleString("en-US")+"</td></tr>"+
        "<tr><td><b>Provider Type</b></td><td><b>Count</b></td></tr>"
  }
 let ordered_s_specs=ordered_specs.filter(value=>s_specs.includes(value))
 ordered_s_specs.forEach((item, i) => {
   str=str+"<tr><td>"+item+"</td><td>"+d.properties.supply_cat[item].toLocaleString("en-US")+"</td></tr>"
 });
 str=str+="</table>"
  let rect_viwer=document.getElementById('cavnas').getBoundingClientRect()
  let xpos=0
  if (event.pageX>(rect_viwer.left+rect_viwer.right)/2) {
   xpos=event.pageX-20-document.getElementById('m_tooltip').clientWidth
  }else{
   xpos=event.pageX+20
  }

  Tooltip
    .style("visibility", "visible")
    .html(str)
    .style("left", (xpos) + "px")
    .style("top", (event.pageY-20) + "px")
}
//MouseLeave
var mouseleave = function(event, d){
Tooltip
  .style("visibility", "hidden")
  active.classed("active", false);
}

  /*Add State Map*/
  maps_states=g1.selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .style('visibility','hidden')
      .style('fill', function(d){ return set_color(d ,'states')})
      .on("click", clicked)
      .on("mouseover ",mouseover)
      .on("mousemove touchmove",mousemove)
      .on("mouseleave ",mouseleave)
      ;
  /*Add ID for all state features*/
  g1.selectAll('path').nodes().forEach((item, i)=>{
        item.id='st_'+item.__data__.properties.STUSPS
      });

  /*Add County Map*/
  maps_counties=g2.selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
      .on('click ' ,clicked_county)
      .style('visibility','hidden')
      .style('fill', function(d){ return set_color(d ,'counties')})
	  .style('stroke-width', 0.2)
	  .style("opacity",0)
      .on("mouseover ",mouseover)
      .on("mousemove touchmove",mousemove)
      .on("mouseleave ",mouseleave)
      ;
  /*Add State Boarder for County Map*/
  const maps_state_boarder=g3.selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "feature")
	  .style("opacity",0)
      .style('visibility','hidden')
      .style('fill','none')
      .style('stroke-width',0.6)
      .style('stroke','black');

  /*Make state map show*/
  maps_states.style('visibility','visible');
  draw_legend();
  

//Set up Listeners to Update Map

//*Lisnters to Payment Map
  d3.selectAll("#ddYear").on('change', function(event){update_map();});
  d3.selectAll("#ddMeasure").on('change', function(event){toggle_display();update_map();});
  d3.selectAll("input[name=pView]").on('change', function(event){change_map();});
  d3.selectAll("input[name=pRank]").on('change', function(event){update_map(false);});
  d3.selectAll("input[name=ruralUrban]").on('change', function(event){update_map();});
//*Set Up Specialty Selectors
  specs.forEach((item, i) => {
    d3.selectAll('input[name="'+item+'"]').on('change', function(event){
      let value = d3.selectAll('input[name="'+item+'"]').property('checked')
      if (value==true){
          s_specs.push(item);
      }else{
          removeItemAll(s_specs,item);
      };
      update_map();
    });
  });
//*Set up for volumes
  volume.forEach((item, i) => {
    d3.selectAll('input[name="'+item+'"]').on('change', function(event){
      let value = d3.selectAll('input[name="'+item+'"]').property('checked')
      if (value==true){
          s_volume.push(item);
      }else{
          removeItemAll(s_volume,item);
      };
      check_volume_types(event);
      update_map();
    });
  });
  nvolume.forEach((item, i) => {
    d3.selectAll('input[name="'+item+'"]').on('change', function(event){
      let value = d3.selectAll('input[name="'+item+'"]').property('checked')
      if (value==true){
          s_nvolume.push(item);
      }else{
          removeItemAll(s_nvolume,item);
      };
      check_volume_types(event);
      update_map();
    });
  });

  /*Change to County View*/
  d3.select("#pViewCounty").property('checked', true);
  d3.select("#pViewCounty").dispatch('change');

/*With-in functions*/

/*Get selected rural/urban filters*/
function getRuralUrbanFilters() {
  let selected = [];
  d3.selectAll('input[name="ruralUrban"]:checked').each(function() {
    selected.push(d3.select(this).property('value'));
  });
  return selected;
}

/*Check if county passes rural/urban filter*/
function passesRuralUrbanFilter(fips) {
  let filters = getRuralUrbanFilters();
  if (filters.length === 0) return true; // No filters selected, show all

  if (!rucc_data.county_classifications || !rucc_data.county_classifications[fips]) {
    return true; // If no RUCC data, don't filter out
  }

  let county_category = rucc_data.county_classifications[fips].category;
  return filters.includes(county_category);
}

/*Define Function for Update Values*/
  function calc_ratio(d){
    let s_year=document.getElementById('ddYear').value;

    //console.log(d['properties'])
    //console.log(d['properties']['Data'])
    if (typeof d['properties']['Data'] === 'undefined'){
      return [null,null];
    }

    // Check rural/urban filter for counties
    if (d['properties'].hasOwnProperty('GEOID') && d['properties']['GEOID'].length === 5) {
      if (!passesRuralUrbanFilter(d['properties']['GEOID'])) {
        return [null, null];
      }
    }
    console.log(d['properties'])
    let pop_value=+d['properties']['Data'][s_year]['pop'];
    //console.log(pop_value);
    let supply=0;
    let tot_supply=0;

    let supply_cat={};
    specs.forEach((item, i) => {
      supply_cat[item]=0
    });
    let checked=false;
    d['properties']['Data'][s_year]['Data'].forEach(
      e=> {
        let delta=calc_supply(e);
        /*
        if (isNaN(delta) && checked==false){
          console.log(d)
          console.log(e)
          console.log(delta)
          checked=true
        }
        */
        let delta2=calc_tot_supply(e);
        supply=supply+delta;
        tot_supply=tot_supply+delta2;
        supply_cat[e.Specialty]=supply_cat[e.Specialty]+delta;
      }
      )

    if (tot_supply==0){
      pct=0
    }else{
       pct=supply/tot_supply*100
    }

    return [supply, supply/pop_value*100000, pct, supply_cat, tot_supply];
    //return supply/pop_value*100000;
    //Supply Calcuation Function
    function calc_supply(e){
     let incl=1;
     if (!s_specs.includes(e.Specialty)){
       return 0;
     };
     if (!s_volume.includes('Volume'+e.Volume)){
       return 0;
     };
     return e['providers'];
     };
     //Total Supply Calcuation Function
     function calc_tot_supply(e){
      let incl=1;
      if (!s_specs.includes(e.Specialty)){
        return 0;
      };
      if (!s_nvolume.includes('nVolume'+e.Volume)){
        return 0;
      };
      return e['providers'];
      };
};
//function to get quintiles
function calc_quintiles(obj){
  let supply=[];
  let state_supply={};
  let stfips=[];
  let pct=[];
  let state_pct={};
  let s_year=document.getElementById('ddYear').value;
  let state_min={}
  topojson.feature(us, us.objects[obj]).features.forEach((item, i) => {
  if (obj=='states'){
    if (!(item.properties.supply===null || item.properties.supply==0) && item.properties.Data[s_year]['dq_issue']!='1') {
      supply.push(item.properties.supply);
      pct.push(item.properties.pct_participating);
    }
  }
	if (obj=='counties'){
		if (!state_supply.hasOwnProperty(item.properties.STATEFP)){
			state_supply[item.properties.STATEFP]=[];
      state_pct[item.properties.STATEFP]=[];
			state_quintiles[item.properties.STATEFP]={'q1':null, 'q2':null, 'q3':null, 'q4':null}
      state_pct_quintiles[item.properties.STATEFP]={'q1':null, 'q2':null, 'q3':null, 'q4':null}
			stfips.push(item.properties.STATEFP)
		};
		if (!(item.properties.supply===null || item.properties.supply==0)){
        if (item.properties.Data[s_year]['dq_issue']!='1'){
  				supply.push(item.properties.supply);
          pct.push(item.properties.pct_participating);
        };
				state_supply[item.properties.STATEFP].push(item.properties.supply);
        state_pct[item.properties.STATEFP].push(item.properties.pct_participating);
		}else if (item.properties.supply==0){
      state_min[item.properties.STATEFP]=0
    };
	}
  });

  //National Quintiles
  for (let i=0;i<6;i++){
    natl_quintiles[obj]['q'+i.toString(10)]=d3.quantile(supply,0.2*i);
    natl_pct_quintiles[obj]['q'+i.toString(10)]=d3.quantile(pct,0.2*i);
  };
  //State Specific Quintiles
  stfips.forEach(
  	st=>{
        state_quintiles[st]['q0']=d3.quantile(state_supply[st],0);
  		  state_quintiles[st]['q1']=d3.quantile(state_supply[st],0.2);
  		  state_quintiles[st]['q2']=d3.quantile(state_supply[st],0.4);
  		  state_quintiles[st]['q3']=d3.quantile(state_supply[st],0.6);
  		  state_quintiles[st]['q4']=d3.quantile(state_supply[st],0.8);
        state_quintiles[st]['q5']=d3.quantile(state_supply[st],1);
        state_pct_quintiles[st]['q0']=d3.quantile(state_pct[st],0);
  		  state_pct_quintiles[st]['q1']=d3.quantile(state_pct[st],0.2);
  		  state_pct_quintiles[st]['q2']=d3.quantile(state_pct[st],0.4);
  		  state_pct_quintiles[st]['q3']=d3.quantile(state_pct[st],0.6);
  		  state_pct_quintiles[st]['q4']=d3.quantile(state_pct[st],0.8);
        state_pct_quintiles[st]['q5']=d3.quantile(state_pct[st],1);
  	}
    );

  if (obj=='states'){
    topojson.feature(us, us.objects[obj]).features.forEach((item, i) => {
      if (item.properties.supply==0){
        item.properties.supply_rank=0
      } else if (item.properties.supply<natl_quintiles[obj]['q1']) {
        item.properties.supply_rank=1
      } else if (item.properties.supply>=natl_quintiles[obj]['q1'] && item.properties.supply<natl_quintiles[obj]['q2']) {
        item.properties.supply_rank=2
      } else if (item.properties.supply>=natl_quintiles[obj]['q2'] && item.properties.supply<natl_quintiles[obj]['q3']) {
        item.properties.supply_rank=3
      } else if (item.properties.supply>=natl_quintiles[obj]['q3'] && item.properties.supply<natl_quintiles[obj]['q4']) {
        item.properties.supply_rank=4
      } else if (item.properties.supply>=natl_quintiles[obj]['q4']) {
        item.properties.supply_rank=5
      } else if (item.properties.supply===null){
        item.properties.supply_rank=null
      } ;
    });
  }else{
  	topojson.feature(us, us.objects[obj]).features.forEach((item, i) => {
      if (item.properties.supply==0){
        item.properties.supply_rank=0
      } else if (item.properties.supply<natl_quintiles[obj]['q1']) {
        item.properties.supply_rank=1
      } else if (item.properties.supply>=natl_quintiles[obj]['q1'] && item.properties.supply<natl_quintiles[obj]['q2']) {
        item.properties.supply_rank=2
      } else if (item.properties.supply>=natl_quintiles[obj]['q2'] && item.properties.supply<natl_quintiles[obj]['q3']) {
        item.properties.supply_rank=3
      } else if (item.properties.supply>=natl_quintiles[obj]['q3'] && item.properties.supply<natl_quintiles[obj]['q4']) {
        item.properties.supply_rank=4
      } else if (item.properties.supply>=natl_quintiles[obj]['q4']) {
        item.properties.supply_rank=5
      } else if (item.properties.supply===null){
        item.properties.supply_rank=null
      } ;
      if (isNaN(item.properties.supply)){
        console.log(item);
        console.log(item.properties.supply==0);
      }
  	  if (item.properties.supply==0){
        item.properties.st_supply_rank=0
      } else if (item.properties.supply<state_quintiles[item.properties.STATEFP]['q1']) {
        item.properties.st_supply_rank=1
      } else if (item.properties.supply>=state_quintiles[item.properties.STATEFP]['q1'] && item.properties.supply<state_quintiles[item.properties.STATEFP]['q2']) {
        item.properties.st_supply_rank=2
      } else if (item.properties.supply>=state_quintiles[item.properties.STATEFP]['q2'] && item.properties.supply<state_quintiles[item.properties.STATEFP]['q3']) {
        item.properties.st_supply_rank=3
      } else if (item.properties.supply>=state_quintiles[item.properties.STATEFP]['q3'] && item.properties.supply<state_quintiles[item.properties.STATEFP]['q4']) {
        item.properties.st_supply_rank=4
      } else if (item.properties.supply>=state_quintiles[item.properties.STATEFP]['q4']) {
        item.properties.st_supply_rank=5
      } if (item.properties.supply===null){
          item.properties.st_supply_rank=null
        };
    });
  };

  if (obj=='states'){
    topojson.feature(us, us.objects[obj]).features.forEach((item, i) => {
      if (item.properties.pct_participating===null){
        item.properties.pct_rank=null
      } else if (item.properties.pct_participating==0){
        item.properties.pct_rank=0
      } else if (item.properties.pct_participating<natl_pct_quintiles[obj]['q1']) {
        item.properties.pct_rank=1
      } else if (item.properties.pct_participating>=natl_pct_quintiles[obj]['q1'] && item.properties.pct_participating<natl_pct_quintiles[obj]['q2']) {
        item.properties.pct_rank=2
      } else if (item.properties.pct_participating>=natl_pct_quintiles[obj]['q2'] && item.properties.pct_participating<natl_pct_quintiles[obj]['q3']) {
        item.properties.pct_rank=3
      } else if (item.properties.pct_participating>=natl_pct_quintiles[obj]['q3'] && item.properties.pct_participating<natl_pct_quintiles[obj]['q4']) {
        item.properties.pct_rank=4
      } else if (item.properties.pct_participating>=natl_pct_quintiles[obj]['q4']) {
        item.properties.pct_rank=5
      };
    });
  }else{
  	topojson.feature(us, us.objects[obj]).features.forEach((item, i) => {
    if (item.properties.pct_participating===null){
        item.properties.pct_rank=null
      } else if (item.properties.pct_participating==0){
        item.properties.pct_rank=0
      } else if (item.properties.pct_participating<natl_pct_quintiles[obj]['q1']) {
        item.properties.pct_rank=1
      } else if (item.properties.pct_participating>=natl_pct_quintiles[obj]['q1'] && item.properties.pct_participating<natl_pct_quintiles[obj]['q2']) {
        item.properties.pct_rank=2
      } else if (item.properties.pct_participating>=natl_pct_quintiles[obj]['q2'] && item.properties.pct_participating<natl_pct_quintiles[obj]['q3']) {
        item.properties.pct_rank=3
      } else if (item.properties.pct_participating>=natl_pct_quintiles[obj]['q3'] && item.properties.pct_participating<natl_pct_quintiles[obj]['q4']) {
        item.properties.pct_rank=4
      } else if (item.properties.pct_participating>=natl_pct_quintiles[obj]['q4']) {
        item.properties.pct_rank=5
      };
  	if (item.properties.pct_participating===null){
        item.properties.st_pct_rank=null
      } else if (item.properties.pct_participating==0){
        item.properties.st_pct_rank=0
      } else if (item.properties.pct_participating<state_pct_quintiles[item.properties.STATEFP]['q1']) {
        item.properties.st_pct_rank=1
      } else if (item.properties.pct_participating>=state_pct_quintiles[item.properties.STATEFP]['q1'] && item.properties.pct_participating<state_pct_quintiles[item.properties.STATEFP]['q2']) {
        item.properties.st_pct_rank=2
      } else if (item.properties.pct_participating>=state_pct_quintiles[item.properties.STATEFP]['q2'] && item.properties.pct_participating<state_pct_quintiles[item.properties.STATEFP]['q3']) {
        item.properties.st_pct_rank=3
      } else if (item.properties.pct_participating>=state_pct_quintiles[item.properties.STATEFP]['q3'] && item.properties.pct_participating<state_pct_quintiles[item.properties.STATEFP]['q4']) {
        item.properties.st_pct_rank=4
      } else if (item.properties.pct_participating>=state_pct_quintiles[item.properties.STATEFP]['q4']) {
        item.properties.st_pct_rank=5
      };
    });
  };

  if (obj=='states'){
    natl_quintiles[obj]['q5']=d3.quantile(supply,1);
    max_supply=natl_quintiles[obj]['q5'];
  }else{
    natl_quintiles[obj]['q5']=d3.quantile(supply,0.998);
    max_supply=natl_quintiles[obj]['q5'];
  }

  stfips.forEach(
  	st=>{
        state_quintiles[st]['q5']=Math.min(d3.quantile(state_supply[st],1),d3.quantile(supply,0.998));
        max_supply_st[st]=state_quintiles[st]['q5'];
        if (st in state_min){
          min_supply_st[st]=state_min[st];
        }else{
          min_supply_st[st]=state_quintiles[st]['q0']
        }
  	}
    );
};
//Update State Color;
function update_map(refresh=true){
  if (refresh==true){
  topojson.feature(us, us.objects.states).features.forEach(
     element => {
       let res=calc_ratio(element);
       element['properties']['supply']=res[1];
       element['properties']['supply_raw']=res[0];
       element['properties']['pct_participating']=res[2];
       element['properties']['supply_cat']=res[3];
       element['properties']['tot_supply']=res[4];
     }

  );
  topojson.feature(us, us.objects.counties).features.forEach(
     element => {
       let res=calc_ratio(element);
       element['properties']['supply']=res[1];
       element['properties']['supply_raw']=res[0];
       element['properties']['pct_participating']=res[2];
       element['properties']['supply_cat']=res[3];
       element['properties']['tot_supply']=res[4];
     }
  );
  calc_quintiles('states');
  calc_quintiles('counties');
  }
  //Remove Previous Legend
  remove_legend();
  //console.log("Legend Removed.")
  //Draw New Legend
  draw_legend();
  //console.log("Legend Drawn.")
  //Draw New Slider
  draw_slider();

  maps_states.transition().duration(200).style('fill', function(d){ return set_color(d, entity='states')});
  maps_counties.transition().duration(200).style('fill', function(d){ return set_color(d, entity='counties')});
  //console.log(topojson.feature(us, us.objects.counties).features[0])
}
//County Click
function clicked_county(event, d) {
  active.classed("active", false);
  active = d3.select(this).classed("active", true);
  active_click.classed("active2", false);
  active_click = d3.select(this).classed("active2", true);
  //if (selected_county!=d.properties.GEOID  && isMobile==true){
  if (selected_county!=d.properties.GEOID ){
    if (selected_state!=d.properties.STATEFP){
      d3.select('#st_'+fips_dict[d.properties.STATEFP]).dispatch('click');
      d3.select('#st_'+fips_dict[d.properties.STATEFP]).dispatch('click');
      active.classed("active", false);
      active = d3.select(this).classed("active", true);
      active_click.classed("active2", false);
      active_click = d3.select(this).classed("active2", true);
    }
    selected_county=d.properties.GEOID
    selected_countynm=d.properties['NAMELSAD']
    draw_slider(d);
  }else{
    reset();
  }
};
/*Click State*/
function clicked(event, d) {
  //console.log(this);
  //console.log(d);
   active.classed("active", false);
   active = d3.select(this).classed("active", true);
   active_click.classed("active2", false);
   active_click = d3.select(this).classed("active2", true);
   if ($('#ddRegion').val()=='0' && flag_region==true){
     d3.select('#ddRegion').property('value',d.properties.Data.region);
     region_zoom();
     return 0;
   }
//if (selected_state!=d.properties.STATEFP && isMobile==true){
if (selected_state!=d.properties.STATEFP){
    selected_state=d.properties.STATEFP;
    selected_statenm=d.properties.NAME;
    draw_slider(d);
    return;
}else{
   selected_state=d.properties.STATEFP;
   selected_statenm=d.properties.NAME;
   zoomed_in_state=d.properties.STATEFP;
   draw_slider();
}
Tooltip.style('visibility','hidden');
if (flag_region==false){
  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9/ Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];
  g1.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
      .style("opacity",250/(750+100))
	  .transition()
      .duration(250)
	  .style("opacity",0)
	  ;
  /*
  g2.selectAll('path')
      .style('visibility','visible')
	  .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
      .transition()
      .delay(600)
      .duration(150)
      .attr('opacity', 1)
      ;
  */

  maps_counties.transition()
  .duration(650)
  .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
  .style('visibility','visible')
    .style('opacity',0)
    .transition()
    .duration(100)
    .style('opacity', function(d){if (selected_state==d.properties.STATEFP) {return 1;} else {return 0.35;}} )
    ;

  g3.selectAll('path')
      .style('visibility','visible')
      .transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
      .style('opacity',1)
      ;
  }
  else{
    g1.selectAll('path')
    .transition()
    .duration(300)
    .style('visibility','hidden')
    maps_counties.transition()
    .duration(300)
    .style('visibility','visible')
    .style('opacity', function(d){if ($('#ddRegion').val()==d.properties.Data.region) {return 1; } else {return 0.35;}});

    g3.selectAll('path')
    .transition()
    .duration(300)
    .style("stroke-width", 1.5 / scale + "px")
    .style('visibility','visible')
    .style('opacity',1)
  }
  remove_legend();
  draw_legend();
};
/*
Listener for Region Dropdown Selector
*/
function region_zoom(){
  let region_bounds=0
  hhs_region.forEach((item, i) => {
     //console.log('St: ', item.Abbr, 'Region: ', item.Region);
      if (document.getElementById('ddRegion').value==item.Region){
        tmp=path.bounds(d3.select('#st_'+item.Abbr)._groups[0][0].__data__);
        //console.log(item.Abbr)
        //console.log(tmp)
        if (region_bounds==0){
          region_bounds=tmp
        }else{
          region_bounds[1][0]=Math.max(tmp[1][0],region_bounds[1][0])
          region_bounds[0][0]=Math.min(tmp[0][0],region_bounds[0][0])
          region_bounds[1][1]=Math.max(tmp[1][1],region_bounds[1][1])
          region_bounds[0][1]=Math.min(tmp[0][1],region_bounds[0][1])
        }
      }
  });
  //console.log(region_bounds);
  let dx = region_bounds[1][0] - region_bounds[0][0],
  dy = region_bounds[1][1] - region_bounds[0][1],
  x = (region_bounds[0][0] + region_bounds[1][0]) / 2,
  y = (region_bounds[0][1] + region_bounds[1][1]) / 2,
  scale = .9/ Math.max(dx / width, dy / height),
  translate = [width / 2 - scale * x, height / 2 - scale * y];
  maps_states.transition()
      .duration(750)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
      .style('opacity', function(d){if ($('#ddRegion').val()==d.properties.Data.region) {return 1; } else {return 0.35;}})
      ;
  maps_counties
      .transition()
      .duration(750)
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
      .style('opacity', function(d){if ($('#ddRegion').val()==d.properties.Data.region) {return 1; } else {return 0.35;}})
      ;

  g3.selectAll('path')
        .transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")")
        .style('opacity',1)
        ;
}

function toggle_display(){
  measure = document.getElementById("ddMeasure").value;
  var element1 = document.getElementById("numerators_flag");
  var element2 = document.getElementById("volume_denominator_selector");
  if (measure === "p2pratio") {
    element1.style.display = "none";
    element2.style.display = "none";
  } else {
    element1.style.display = "table-row";
    element2.style.display = "block";
  }
};

function change_map(event, d) {
  let view=d3.select('input[name="pView"]:checked').node().value
  if (view=='county'){
    g1.transition()
        .duration(750)
        .style('opacity',0)
        .style('visibility','hidden')
        ;
    if (selected_state=='0'){
    g2.selectAll('path')
        .style('visibility','visible')
        .transition()
        .duration(750)
        .style('opacity',1)
        ;
    }
    g3.selectAll('path')
        .style('visibility','visible')
        .transition()
        .duration(750)
        .style('opacity',1)
        ;
    remove_legend();
    draw_legend();
    draw_slider();
  } else{
    reset();
  }
  ;
}
})
.catch(function(err) {
  console.log(err)
});

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    };
  };
  return arr;
};


function reset(no_pView=false) {
  if (no_pView==false){
   document.getElementById("pViewState").checked=true;
  }
  active.classed("active", false);
  active_click.classed("active2", false);
  active = d3.select(null);
  active_click = d3.select(null);
  selected_state='0';
  zoomed_in_state='0';
  selected_statenm='';
  selected_county="0";
  selected_countynm="";
  let tooltip=d3.selectAll('.tooltip');
  tooltip.style('visibility','hidden');

  g1.style('visibility','visible')
	  .style("opacity",0.1)
      .transition()
      .duration(750)
      .style("stroke-width", "1.5px")
      .attr("transform", "")
	  .style("opacity",1);

  g2.selectAll('path').transition()
	  .attr("transform", "")
	  .style("opacity",0)
	  .style('visibility','hidden');

  g3.selectAll('path').transition()
      .attr("transform", "")
	  .style("opacity",0)
	  .style('visibility','hidden');

  maps_states.transition()
    .duration(750)
    .style('visibility','visible')
    .attr("transform", "")
    .style("opacity",1);
  maps_counties.transition()
    .duration(750)
    .style('visibility','hidden')
    .attr("transform", "")
    .style("opacity",0);

  remove_legend();
  draw_legend();
  draw_slider();
  document.getElementById('ddState').value='';

};

//Function to reshape county data
function reshape_county(d){
  let res={};
  d.forEach((item, i) => {
    let st_fips=item.fips.substring(0,2);
    if (!res.hasOwnProperty(item.fips)){
      res[item.fips]={};
    };
    if (!res[item.fips].hasOwnProperty(item.year)){
      res[item.fips][item.year]={'pop':+item.pop,'tot_pop':+item.tot_pop,
        'dq_issue': dq_data2[st_fips][item.year]['dq'],
          'ot_dq': dq_data2[st_fips][item.year]['ot_dq'],
          'rx_dq': dq_data2[st_fips][item.year]['rx_dq'], 'Data':[]}
    };
    if (specs.includes(item.specialty)==true){
      res[item.fips][item.year]['Data'].push(
        {
          'Specialty':item.specialty,
          'Volume': item.volume,
          'providers':+item.providers,
        })
    };
  });
  return res;
};

//Function to reshape state data
function reshape_state(d){
  let res={};
  let sample=false;
  d.forEach((item, i) => {
    if (!res.hasOwnProperty(item.state)){
      res[item.state]={}
    };
    
    if (!res[item.state].hasOwnProperty(item.year)){
      res[item.state][item.year]={'pop':+item.pop, 'tot_pop':+item.tot_pop, 'expansion':item.MedicaidExpansion,
        'FeeRatio':item.FeeRatio, 'FR_yr': item.fee_ratio_yr, 'MedicaidACO':item.ACO, 'APRNSOP':item.APRNSOP,
        'dq_issue': dq_data1[item.state][item.year]['dq'],
          'ot_dq': dq_data1[item.state][item.year]['ot_dq'],
          'rx_dq': dq_data1[item.state][item.year]['rx_dq'],
           'Data':[]};
    };
    if (specs.includes(item.specialty)==true){
      res[item.state][item.year]['Data'].push(
        {
          'Specialty':item.specialty,
          'Volume': item.volume,
          'providers':+item.providers,
        })
    };
  });
  return res;
};

//Reshape National Data 
function reshape_natl(d){
  let res={};
  d.forEach((item, i) => {
    if (!res.hasOwnProperty(item.year)){
      res[item.year]={'pop':+item.pop,'tot_pop':+item.tot_pop,'Data':[
      ]}
      
    };
    
    if (specs.includes(item.specialty)==true){
      res[item.year]['Data'].push(
        {
          'Specialty':item.specialty,
          'Volume': item.volume,
          'providers':+item.providers,
          })
    };
  });
  return res;
};


//Function to reshape dq data
function reshape_dq(d){
  dq_data1={};
  dq_data2={};
  d.forEach((item, i)=>{
    if (!dq_data1.hasOwnProperty(item.state_cd)){
      dq_data1[item.state_cd]={}
      dq_data2[item.state_fips]={}
    }
    if (!dq_data1[item.state_cd].hasOwnProperty(item.year)){
        dq_data1[item.state_cd][item.year]={'dq':item.dq_issue, 'ot_dq': item.ot_dq, 'rx_dq':item.rx_dq}
        dq_data2[item.state_fips][item.year]={'dq':item.dq_issue, 'ot_dq': item.ot_dq, 'rx_dq':item.rx_dq}
    }
  });
};

//Set Color by Rank
function set_color(d, entity, legend=false){
  let rank=null;
  let type=d3.select('input[name="pRank"]:checked').node().value
  let measure = document.getElementById('ddMeasure');
  let s_year=document.getElementById('ddYear').value;
  if ((entity=='states' || (entity=='counties' & type=='national')) & measure.value == 'p2pratio'){
  	rank='supply_rank'
  } else if (entity=='counties' & type=='state'  & measure.value == 'p2pratio'){
  	rank='st_supply_rank'
  } else if ((entity=='states' || (entity=='counties' & type=='national')) & measure.value == 'percent'){
  	rank='pct_rank'
  } else if (entity=='counties' & type=='state'  & measure.value == 'percent'){
  	rank='st_pct_rank'
  }

  if (legend==false) {
    if (d.properties.Data[s_year]['dq_issue']!='1'){
      rankval=d.properties[rank]
    }
    else{
      rankval=6
    }
  }else{
    rankval=d
  }
  switch (rankval){
    case 0:
      return "#FFFFFF";
    case 1:
      return '#B9D9E9';
    case 2:
      return '#A1BFDB';
    case 3:
      return '#74A6CC';
    case 4:
      return '#2884B2';
    case 5:
      return '#034B77';
    case 6:
      return '#E5E4E2';
    default:
      return "black";
  }
}

/*Draw Legend*/
function draw_legend(){
  let view=d3.select('input[name="pView"]:checked').node().value
  let rank=d3.select('input[name="pRank"]:checked').node().value
  let measure=d3.select('#ddMeasure').node().value
  if (view=='county' && rank=='state' && selected_state=='0'){
    legend
      .append("text")
        .attr("x", 50)
        .attr('y', 50)
        .text('Legend are suppressed for national county view with state-specific rankings.')
        .style("fill", 'navy')
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
    return;
  }

  let keys=[];
  if ((rank=='national' && selected_state=='0' && view!='county') || (rank=='state' && selected_state=="0")){
    legend
      .append("text")
        .attr("x", 10)
        .attr('y', 13)
        .text('Legend (National - State Rankings)')
        .style("fill", 'navy')
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
        if (measure=='p2pratio'){
          keys=    [{name:'Rank 1', value:5, range:": "+(Math.round(natl_quintiles['states']['q4']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['states']['q5']*10)/10).toString(10)+""},
                    {name:'Rank 2', value:4, range:": "+(Math.round(natl_quintiles['states']['q3']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['states']['q4']*10)/10).toString(10)+""},
                    {name:'Rank 3', value:3, range:": "+(Math.round(natl_quintiles['states']['q2']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['states']['q3']*10)/10).toString(10)+""},
                    {name:'Rank 4', value:2, range:": "+(Math.round(natl_quintiles['states']['q1']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['states']['q2']*10)/10).toString(10)+""},
                    {name:'Rank 5', value:1, range:": "+(Math.round(natl_quintiles['states']['q0']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['states']['q1']*10)/10).toString(10)+""},
                    {name:'Rank 6', value:0, range:": 0"},
                    {name:'Rank 7', value:6, range:": Data Quality Issues"}
                    ]
       }else{
         keys=    [{name:'Rank 1', value:5, range:": "+(Math.round(natl_pct_quintiles['states']['q4']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['states']['q5']*10)/10).toString(10)+""},
                   {name:'Rank 2', value:4, range:": "+(Math.round(natl_pct_quintiles['states']['q3']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['states']['q4']*10)/10).toString(10)+""},
                   {name:'Rank 3', value:3, range:": "+(Math.round(natl_pct_quintiles['states']['q2']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['states']['q3']*10)/10).toString(10)+""},
                   {name:'Rank 4', value:2, range:": "+(Math.round(natl_pct_quintiles['states']['q1']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['states']['q2']*10)/10).toString(10)+""},
                   {name:'Rank 5', value:1, range:": "+(Math.round(natl_pct_quintiles['states']['q0']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['states']['q1']*10)/10).toString(10)+""},
                   {name:'Rank 6', value:0, range:": 0"},
                   {name:'Rank 7', value:6, range:": Data Quality Issues"}
                   ]
       }
  } else if (rank=='national' && (selected_state!='0' | view=='county')){
    legend
      .append("text")
        .attr("x", 10)
        .attr('y', 13)
        .text('Legend (National - County Rankings)')
        .style("fill", 'navy')
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
        if (measure=='p2pratio'){
          keys=    [{name:'Rank 1', value:5, range:": "+(Math.round(natl_quintiles['counties']['q4']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['counties']['q5']*10)/10).toString(10)+"*"},
                    {name:'Rank 2', value:4, range:": "+(Math.round(natl_quintiles['counties']['q3']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['counties']['q4']*10)/10).toString(10)+""},
                    {name:'Rank 3', value:3, range:": "+(Math.round(natl_quintiles['counties']['q2']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['counties']['q3']*10)/10).toString(10)+""},
                    {name:'Rank 4', value:2, range:": "+(Math.round(natl_quintiles['counties']['q1']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['counties']['q2']*10)/10).toString(10)+""},
                    {name:'Rank 5', value:1, range:": "+(Math.round(natl_quintiles['counties']['q0']*10)/10).toString(10)+" to "+(Math.round(natl_quintiles['counties']['q1']*10)/10).toString(10)+""},
                    {name:'Rank 6', value:0, range:": 0"},
                    {name:'Rank 7', value:6, range:": Data Quality Issues"}
                    ]
       }else{
         keys=    [{name:'Rank 1', value:5, range:": "+(Math.round(natl_pct_quintiles['counties']['q4']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['counties']['q5']*10)/10).toString(10)+""},
                   {name:'Rank 2', value:4, range:": "+(Math.round(natl_pct_quintiles['counties']['q3']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['counties']['q4']*10)/10).toString(10)+""},
                   {name:'Rank 3', value:3, range:": "+(Math.round(natl_pct_quintiles['counties']['q2']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['counties']['q3']*10)/10).toString(10)+""},
                   {name:'Rank 4', value:2, range:": "+(Math.round(natl_pct_quintiles['counties']['q1']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['counties']['q2']*10)/10).toString(10)+""},
                   {name:'Rank 5', value:1, range:": "+(Math.round(natl_pct_quintiles['counties']['q0']*10)/10).toString(10)+" to "+(Math.round(natl_pct_quintiles['counties']['q1']*10)/10).toString(10)+""},
                   {name:'Rank 6', value:0, range:": 0"},
                   {name:'Rank 7', value:6, range:": Data Quality Issues"}
                   ]
       }
  } else if (rank=='state'){
    legend
      .append("text")
        .attr("x", 10)
        .attr('y', 13)
        .text('Legend ('+selected_statenm+ ' - County Rankings)')
        .style("fill", 'navy')
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
        if (measure=='p2pratio'){
          keys=    [{name:'Rank 1', value:5, range:": "+(Math.round(state_quintiles[selected_state]['q4']*10)/10).toString(10)+" to "+(Math.round(state_quintiles[selected_state]['q5']*10)/10).toString(10)+"*"},
                    {name:'Rank 2', value:4, range:": "+(Math.round(state_quintiles[selected_state]['q3']*10)/10).toString(10)+" to "+(Math.round(state_quintiles[selected_state]['q4']*10)/10).toString(10)+""},
                    {name:'Rank 3', value:3, range:": "+(Math.round(state_quintiles[selected_state]['q2']*10)/10).toString(10)+" to "+(Math.round(state_quintiles[selected_state]['q3']*10)/10).toString(10)+""},
                    {name:'Rank 4', value:2, range:": "+(Math.round(state_quintiles[selected_state]['q1']*10)/10).toString(10)+" to "+(Math.round(state_quintiles[selected_state]['q2']*10)/10).toString(10)+""},
                    {name:'Rank 5', value:1, range:": "+(Math.round(state_quintiles[selected_state]['q0']*10)/10).toString(10)+" to "+(Math.round(state_quintiles[selected_state]['q1']*10)/10).toString(10)+""},
                    {name:'Rank 6', value:0, range:": 0"},
                    {name:'Rank 7', value:6, range:": Data Quality Issues"}
                    ]
        } else{
          keys=    [{name:'Rank 1', value:5, range:": "+(Math.round(state_pct_quintiles[selected_state]['q4']*10)/10).toString(10)+" to "+(Math.round(state_pct_quintiles[selected_state]['q5']*10)/10).toString(10)+""},
                    {name:'Rank 2', value:4, range:": "+(Math.round(state_pct_quintiles[selected_state]['q3']*10)/10).toString(10)+" to "+(Math.round(state_pct_quintiles[selected_state]['q4']*10)/10).toString(10)+""},
                    {name:'Rank 3', value:3, range:": "+(Math.round(state_pct_quintiles[selected_state]['q2']*10)/10).toString(10)+" to "+(Math.round(state_pct_quintiles[selected_state]['q3']*10)/10).toString(10)+""},
                    {name:'Rank 4', value:2, range:": "+(Math.round(state_pct_quintiles[selected_state]['q1']*10)/10).toString(10)+" to "+(Math.round(state_pct_quintiles[selected_state]['q2']*10)/10).toString(10)+""},
                    {name:'Rank 5', value:1, range:": "+(Math.round(state_pct_quintiles[selected_state]['q0']*10)/10).toString(10)+" to "+(Math.round(state_pct_quintiles[selected_state]['q1']*10)/10).toString(10)+""},
                    {name:'Rank 6', value:0, range:": 0"},
                    {name:'Rank 7', value:6, range:": Data Quality Issues"}
                    ]
        }
  }
  var size = 20

  legend.selectAll("mydots")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", function(d,i){return 50+250*(i%3)})
    .attr("y", function(d,i){ return 30 + Math.floor(i/3)*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size*2)
    .attr("height", size)
    .style("fill", function(d){ return set_color(d.value, 'state', true)})
    .attr('stroke-width',0.2)
    .attr('stroke','gray');

  // Add one dot in the legend for each name.
  legend.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
      .attr("x", function(d,i){return 50+250*(i%3)+size*2.2})
      .attr("y", function(d,i){ return 30 + Math.floor(i/3)*(size+8) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", 'navy')
      .text(function(d){ return d.name+d.range})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  //Add a Note 
  if (selected_state!='0' | view=='county'){
  legend
    .append("text")
    .attr("x", 790)
    .attr("y", 105)
    .style("fill", 'navy')
    .text("* Top 0.2% of outlier counties are suppressed in legend and slider chart.")
    .attr("text-anchor", "end")
    .style("font-size",'10px')
    .style("alignment-baseline", "middle")
  }
};
function remove_legend(){
  legend.selectAll("*").remove();
};

/*
Calculate National Supply
*/

function calc_natl_ratio(){
  let s_year=document.getElementById('ddYear').value;
  //console.log(d['properties'])
  //console.log(d['properties']['Data'])
  let pop_value=+national_data[s_year]['pop'];
  //console.log(pop_value);
  let supply=0;
  let tot_supply=0;

  let supply_cat={};
  specs.forEach((item, i) => {
    supply_cat[item]=0
  });
  national_data[s_year]['Data'].forEach(
    e=> {
      let delta=calc_supply(e);
      let delta2=calc_tot_supply(e);
      supply=supply+delta;
      tot_supply=tot_supply+delta2;
      supply_cat[e.Specialty]=supply_cat[e.Specialty]+delta;
    }
  )

  if (tot_supply==0){
    pct=0
  }else{
     pct=supply/tot_supply*100
  };
  
  return [supply/pop_value*100000, pct, supply];
  
  //return supply/pop_value*100000;
  //Supply Calcuation Function
  function calc_supply(e){
   let incl=1;
   if (!s_specs.includes(e.Specialty)){
     return 0;
   };
   if (!s_volume.includes('Volume'+e.Volume)){
     return 0;
   };
   return e['providers'];
   };
   //Total Supply Calcuation Function
   function calc_tot_supply(e){
    let incl=1;
    if (!s_specs.includes(e.Specialty)){
      return 0;
    };
    if (!s_nvolume.includes('nVolume'+e.Volume)){
      return 0;
    };
    return e['providers'];
    };
};

/*
Slider Toggle 
*/
var toggleButton = document.getElementById("togBtn");

toggleButton.addEventListener("change", function() {
    draw_slider();
});
/*
Draw Slider
*/
function draw_slider(d=null){
  if (document.getElementById("togBtn").checked){
    draw_slider2(d);
  }else{
    draw_slider1(d);
  };
}
/*
Slider Graph 
*/
function draw_slider1(d=null){
  remove_slider();
  let rank=d3.select('input[name="pRank"]:checked').node().value
  let measure=d3.select('#ddMeasure').node().value
  let view=d3.select('input[name="pView"]:checked').node().value
  //let n_square=10
  //let numWidth=400/n_square;
  let max_num=100;
  let min_num=0;
  let us_avg=calc_natl_ratio();
  if (measure=='p2pratio'){
    us_avg=us_avg[0]
  }else{
    us_avg=us_avg[1]
  }
  let target=null;
  let affix='';
  if (s_specs.length === 0 || s_volume.length===0){
    return;
  }
  if (!(rank=='state' && zoomed_in_state!="0") && (zoomed_in_state!="0" || view=='county')){
    if (measure=='p2pratio'){
      max_num=max_supply;
    }
    affix='Counties'
  } 
  else if ((zoomed_in_state=="0" || view=='state')){
    if (measure=='p2pratio'){
      max_num=natl_quintiles['states']['q5']
      min_num=natl_quintiles['states']['q0']
    }
    affix='States'
  }
  else if (rank=='state' && zoomed_in_state!="0" ){
    if (measure=='p2pratio'){
      max_num=max_supply_st[zoomed_in_state]
      min_num=min_supply_st[zoomed_in_state]
    }
    affix='Counties'
  }
  /*
  Find d when not feeded
  */
  if (d===null && selected_county!='0'){
    maps_counties._groups[0].forEach(e => {
      if (e.__data__.properties.GEOID==selected_county){
        d=e.__data__
      }}
    )
  }else if (d===null && selected_state!='0'){
    maps_states._groups[0].forEach(e => {
      if (e.__data__.properties.GEOID==selected_state){
        d=e.__data__
      }}
    )
  };
  
  /*
  Find Data for d
  */
  if (d!=null && d.properties.hasOwnProperty('STUSPS')){
    if (measure=='p2pratio'){
      target=d.properties.supply
    }else{
      target=d.properties.pct_participating 
    }
    affix=d.properties.NAME
  }else if ((d!=null && !d.properties.hasOwnProperty('STUSPS'))){
    if (measure=='p2pratio'){
      target=d.properties.supply
    }else{
      target=d.properties.pct_participating
    }
    affix=d.properties.NAMELSAD+", "+fips_dict[d.properties.STATEFP]
  };

  /*
  Calculate Position for Triangle
  */
  let pos=(us_avg-min_num)/(max_num-min_num)*400+55;
  
  /*
  //Rectangles
  let numbers=d3.range(0,10,1)
  let colorScale = d3.scaleSequential()
      .domain([d3.min(numbers), d3.max(numbers)])
      .interpolator(d3.interpolateRgb("white", "#034B77"));
  
  slider_svg.selectAll("rect")
      .data(numbers)
      .enter()
      .append("rect")
      .attr("x", function(d, i) { return (i+1) * numWidth; })
      .attr("y", 50)
      .attr("width", numWidth)
      .attr("height", numWidth)
      .attr("fill", function(d) { return colorScale(d); })
      .attr("stroke", "#D3D3D3")  // Stroke color
      .attr("stroke-width", "0.2");  // Stroke width
  */
  let triangle = d3.symbol()
      .type(d3.symbolTriangle)
      .size(80); // Adjust the size as needed
  let gradient = slider_svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .attr("spreadMethod", "pad");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "white")
    .attr("stop-opacity", 1);

  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#034B77")
    .attr("stop-opacity", 1);
  
  //Add Ramp
  slider_svg.append("rect")
    .attr("width", 400)
    .attr("height", 30)
    .attr("x",55)
    .attr("y",95+20)
    .attr("stroke", "#D3D3D3")  // Stroke color
    .attr("stroke-width", "0.2")  // Stroke width
    .style("fill", "url(#gradient)")
    ;
  //Add Triangle for US Average
  slider_svg.append("path")
    .attr("d", triangle)
    .attr("transform", "translate("+ pos +", 154)") // Position the triangle
    .attr("fill", "black");
  //Add Number and Text for US Average
  slider_svg.append("text")
    .attr("x", pos) 
    .attr("y", 150+20) // Adjust this value as needed.
    .style('font-weight','bold')
    .style("font-size",'12px')
    .attr("text-anchor", "middle")
    .text(us_avg.toFixed(1));
  slider_svg.append("text")
    .attr("x", pos) 
    .attr("y", 163+20) // Adjust this value as needed.
    .style("font-size",'12px')
    .attr("text-anchor", "middle")
    .text("National Average");
  //Add Vertical Line, Text and Number for Target 
  if (target != null){
    //Calculate Postion
    let target_pos=(target-min_num)/(max_num-min_num)*400+55;
    if (target_pos>455){
      target_pos=457
    }
    //Vertical Line 
    slider_svg.append("rect")
    .attr("width", 4)
    .attr("height", 35)
    .attr("x",target_pos-2)
    .attr("y",95-2.5+20)
    .style("fill", "orange")
    ;
    //Number 
    slider_svg.append("text")
    .attr("x", target_pos) 
    .attr("y", 95+13) // Adjust this value as needed.
    .style('font-weight','bold')
    .style("font-size",'18px')
    .attr("text-anchor", "middle")
    .text(target.toFixed(1));
  }
  //Add Title 
  if (measure=="p2pratio"){
    dis_measure="Medicaid Provider to Population Ratio - "+affix
  }else{
    dis_measure="% Provider Participating in Medicaid - "+affix
  }
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 18) // Adjust this value as needed.
    .style("font-weight",'bold')
    .text(dis_measure);
  //Add Provider Types and volumes
  let slider_specs=[];
  if (s_specs.includes('Family Medicine')){
    slider_specs.push('FM')
  };
  if (s_specs.includes('Internal Medicine')){
    slider_specs.push('IM')
  };
  if (s_specs.includes('Pediatrics')){
    slider_specs.push('Peds')
  };
  if (s_specs.includes('OBGYN')){
    slider_specs.push('Ob/Gyn')
  };
  if (s_specs.includes('APRN')){
    slider_specs.push('APRN')
  };
  if (s_specs.includes('Physician Assistant')){
    slider_specs.push('PA')
  };
  let slider_volume=[];
  if (s_volume.includes('Volume1')){
    slider_volume.push('0 (Inactive)')
  };
  if (s_volume.includes('Volume2')){
    slider_volume.push('0 (Active)')
  };
  if (s_volume.includes('Volume3')){
    slider_volume.push('1-10')
  };
  if (s_volume.includes('Volume4')){
    slider_volume.push('11-149')
  };
  if (s_volume.includes('Volume5')){
    slider_volume.push('150+')
  };
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 38) // Adjust this value as needed.
    .style("font-size",'15px')
    .text("Provider Type(s):"+slider_specs.join(', '));
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 55) // Adjust this value as needed.
    .style("font-size",'15px')
    .text('Provider Beneficiary Volume:'+slider_volume.join(', '));
    
  // Add the minimum number to the left.
  slider_svg.append("text")
    .attr("x", 45) 
    .attr("y", 113+20) // Adjust this value as needed.
    .attr("text-anchor", "end")
    .text(min_num.toFixed(1));
  // Add the maximum number to the right.
  slider_svg.append("text")
    .attr("x", 465) 
    .attr("y", 113+20) // Adjust this value as needed.
    .text(max_num.toFixed(1));
  // Add note 
  let line1=slider_svg.append("text")
  .attr("x", 0) 
  .attr("y", 175+50)
  .style('font-size','14px')

  line1.append('tspan')
    .text("Note: ")
    .style('font-weight','bold')
  slider_svg.append('text')
    .attr("x", 0) 
    .attr("y", 190+50)
    .style('font-size','14px')
    .text("1) While national averages provide a benchmark, exceeding");
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 205+50)
    .style('font-size','14px')
    .text("the national average does not ensure a sufficient workforce.");
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 220+50)
    .style('font-size','14px')
    .text("2) National averages are calculated based states with ");
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 235+50)
    .style('font-size','14px')
    .text("acceptable data quality in TMSIS.");
  write_parapraph(d);
};

/*
Line Graph 
*/
function roundToHighestPowerOf10(number) {
  const power = Math.ceil(Math.log10(number));
  const roundedNumber = Math.ceil(number / Math.pow(10, power - 1)) * Math.pow(10, power - 1);
  return roundedNumber;
}

function draw_slider2(d=null){
  remove_slider();
  let measure=d3.select('#ddMeasure').node().value
  let view=d3.select('input[name="pView"]:checked').node().value
  //*Set up the basic data 
  let plot_data=[]
  //Affix
  let affix='';
  if (s_specs.length === 0 || s_volume.length===0){
    return;
  }
  affix='United States'

  /*
  Find d when not feeded
  */
  if (d===null && selected_county!='0'){
    maps_counties._groups[0].forEach(e => {
      if (e.__data__.properties.GEOID==selected_county){
        d=e.__data__
      }}
    )
  }else if (d===null && selected_state!='0'){
    maps_states._groups[0].forEach(e => {
      if (e.__data__.properties.GEOID==selected_state){
        d=e.__data__
      }}
    )
  };
  let natl_flag=false;
  if (d == null){
    natl_flag=true;
    d={'properties':{'Data':national_data}};
  };

  /*
  Find Data for d
  */
  if (measure=='p2pratio'){
    for (let key in d.properties.Data){
      let sup=0
      let pop=d.properties.Data[key].pop
      d.properties.Data[key]['Data'].forEach(e => {
        sup+=calc_supply(e);
      }
      );
      plot_data.push({x:+key, y: sup/pop*100000})
    }
  }else{
    for (let key in d.properties.Data){
      let sup=0
      let tot_sup=0
      d.properties.Data[key]['Data'].forEach(e => {
        sup+=calc_supply(e);
        tot_sup+=calc_tot_supply(e);
      }
      );
      plot_data.push({x:+key, y: sup/tot_sup*100})
    }
  }
  /*
  Change Affixes 
  */
  if (natl_flag==false && d!=null && d.properties.hasOwnProperty('STUSPS')){
    affix=d.properties.NAME
  }else if (natl_flag==false &&  d!=null && !d.properties.hasOwnProperty('STUSPS')){
    affix=d.properties.NAMELSAD+", "+fips_dict[d.properties.STATEFP]
  };

  //Add Group 
  const g = slider_svg.append("g");

  // Define scales for x and y axes
  const xScale = d3.scaleLinear()
  .domain([d3.min(plot_data, d => d.x), d3.max(plot_data, d => d.x)])
  .range([0, swidth-60]);

  let init_ticks=4
  let tick_values=[Math.floor(d3.min(plot_data, d => d.y)/10-1)*10,Math.floor(d3.min(plot_data, d => d.y)/10+1)*10]
  let ys=[Math.floor(d3.min(plot_data, d => d.y)/10-1)*10,Math.floor(d3.min(plot_data, d => d.y)/10+1)*10]
  if (d3.min(plot_data, d => d.y)<d3.max(plot_data, d => d.y)){
    tick_values=d3.ticks(d3.min(plot_data, d => d.y),  d3.max(plot_data, d => d.y), init_ticks)
    let interval=tick_values[1]-tick_values[0]
    tick_values=d3.ticks(Math.floor(d3.min(plot_data, d => d.y)/interval)*interval,  Math.ceil(d3.max(plot_data, d => d.y)/interval)*interval, init_ticks)

    while (tick_values[-1]<d3.max(plot_data, d => d.y) || tick_values[0]>d3.min(plot_data, d => d.y)){
      init_ticks+=1
      tick_values=d3.ticks(Math.floor(d3.min(plot_data, d => d.y)/interval)*interval,  Math.ceil(d3.max(plot_data, d => d.y)/interval)*interval, init_ticks)
      interval=tick_values[1]-tick_values[0]
    }
    tick_values=d3.ticks(Math.floor(d3.min(plot_data, d => d.y)/interval)*interval,  Math.ceil(d3.max(plot_data, d => d.y)/interval)*interval, init_ticks)

    ys=[Math.floor(d3.min(plot_data, d => d.y)/interval)*interval,Math.ceil(d3.max(plot_data, d => d.y)/interval)*interval]
  }
  ;

  //ys=[d3.min(plot_data, d => d.y), d3.max(plot_data, d => d.y)]
  const yScale = d3.scaleLinear()
  .domain(ys)
  .range([sheight-65-70, 0]);

  //Add Axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale);
  yAxis.tickValues(tick_values);
  xAxis.ticks(4);
  //
  g.append("g")
    .attr("transform", `translate(0, 165)`)  
    .call(xAxis);

  g.append("g")

    .call(yAxis);

  // Calculate trend analysis
  const trendData = trendAnalyzer.formatForVisualization(plot_data, {
    includeTrendLine: true,
    includeConfidenceInterval: false,
    includeMovingAverage: false
  });

  // Draw original data line
  g.append("path")
    .datum(plot_data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2.5)
    .attr("d", d3.line()
      .x(function(d) { return xScale(d.x) })
      .y(function(d) { return yScale(d.y) })
      )

  // Draw trend line if available
  if (trendData.trendLine) {
    g.append("path")
      .datum(trendData.trendLine)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,5")
      .attr("d", d3.line()
        .x(function(d) { return xScale(d.x) })
        .y(function(d) { return yScale(d.y) })
      )
      .attr("opacity", 0.7);

    // Add R² annotation
    if (trendData.rSquared !== undefined) {
      g.append("text")
        .attr("x", swidth - 120)
        .attr("y", 20)
        .attr("font-size", "11px")
        .attr("fill", "red")
        .text(`R² = ${trendData.rSquared.toFixed(3)}`);
    }
  }
  let tooltip_div = d3.select('body')
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "slider_tooltip")
      .style("padding", "5px")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("opacity", 0)
      .style("z-index", "3000")
      .style("position", "absolute")
      ;
  g.selectAll("circle")
    .data(plot_data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 4)
    .on("mouseover", function(event,d) {
      tooltip_div.transition()
        .duration(50)
        .style("opacity", .9);
        tooltip_div.html(d.x+ "<br/>" + Number(d.y.toFixed(1)).toLocaleString("en-US"))
        .style("left", (event.pageX-20) + "px")
        .style("top", (event.pageY+20) + "px")})
    .on('mousemove touchmove', function(event,d) {
      tooltip_div.transition()
        .duration(50)
        .style("opacity", .9);
        tooltip_div.html(d.x+ "<br/>" + Number(d.y.toFixed(1)).toLocaleString("en-US"))
        .style("left", (event.pageX-20) + "px")
        .style("top", (event.pageY+20) + "px")})
    .on("mouseout", function(d) {
      tooltip_div.transition()
        .duration(200)
        .style("opacity", 0);
      });;
    
  g.attr('transform','translate(40,70)');

  //Add Title 
  if (measure=="p2pratio"){
    dis_measure="Medicaid Provider to Population Ratio - "+affix
  }else{
    dis_measure="% Provider Participating in Medicaid - "+affix
  }
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 18) // Adjust this value as needed.
    .style("font-weight",'bold')
    .text(dis_measure);
  //Add Provider Types and volumes
  let slider_specs=[];
  if (s_specs.includes('Family Medicine')){
    slider_specs.push('FM')
  };
  if (s_specs.includes('Internal Medicine')){
    slider_specs.push('IM')
  };
  if (s_specs.includes('Pediatrics')){
    slider_specs.push('Peds')
  };
  if (s_specs.includes('OBGYN')){
    slider_specs.push('Ob/Gyn')
  };
  if (s_specs.includes('APRN')){
    slider_specs.push('APRN')
  };
  if (s_specs.includes('Physician Assistant')){
    slider_specs.push('PA')
  };
  let slider_volume=[];
  if (s_volume.includes('Volume1')){
    slider_volume.push('0 (Inactive)')
  };
  if (s_volume.includes('Volume2')){
    slider_volume.push('0 (Active)')
  };
  if (s_volume.includes('Volume3')){
    slider_volume.push('1-10')
  };
  if (s_volume.includes('Volume4')){
    slider_volume.push('11-149')
  };
  if (s_volume.includes('Volume5')){
    slider_volume.push('150+')
  };
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 38) // Adjust this value as needed.
    .style("font-size",'15px')
    .text("Provider Type(s):"+slider_specs.join(', '));
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 55) // Adjust this value as needed.
    .style("font-size",'15px')
    .text('Provider Beneficiary Volume:'+slider_volume.join(', '));

if (natl_flag==true){
    // Add note 
    // Add note 
  let line1=slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 280)
    .style('font-size','14px')
  line1.append('tspan')
      .text("Note: ")
      .style('font-weight','bold')
  line1.append("tspan")
    .style('font-size','14px')
    .style('font-style','italic')
    .style('font-weight','normal')
    .text("National data are calculated based states with "); 
  slider_svg.append("text")
    .attr("x", 0) 
    .attr("y", 295)
    .style('font-size','14px')
    .style('font-style','italic')
    .text("acceptable data quality in TMSIS.");  
    write_parapraph();
  }  else{
    write_parapraph(d);
  }
};

/*
Remove Content from Slider Graph 
*/
function remove_slider(d){
  slider_svg.selectAll("*").remove();
};


/*
Function to Caluclate Supply
*/
function calc_supply(e){
  let incl=1;
  if (!s_specs.includes(e.Specialty)){
    return 0;
  };
  if (!s_volume.includes('Volume'+e.Volume)){
    return 0;
  };
  return e['providers'];
  };
/*
Total Supply Calcuation Function
*/
function calc_tot_supply(e){
  let incl=1;
  if (!s_specs.includes(e.Specialty)){
    return 0;
  };
  if (!s_nvolume.includes('nVolume'+e.Volume)){
    return 0;
  };
  return e['providers'];
};

/*
Write Paragraph 
*/
function write_parapraph(d=null){
  let card=document.getElementById('report_card');
  let s_year=document.getElementById('ddYear').value;
  while (card.firstChild) {
    card.removeChild(card.firstChild);
  }
  let title = document.createElement('p');
  title.style.fontWeight='bold'
  title.style.textAlign='left'
  title.style.margin='0'
  title.style.marginLeft='4px'
  title.style.padding='1px'
  let note = document.createElement('p');
  note.style.fontSize='14px'
  note.style.textAlign='left'
  note.style.margin='0'
  note.style.padding='1px'
  note.style.marginLeft='4px'
  note.style.marginTop='auto'
  let content1=document.createElement('p');
  content1.style.textAlign='left'
  content1.style.fontSize='15px'
  content1.style.margin='0'
  content1.style.marginTop='8px'
  content1.style.marginLeft='4px'
  content1.style.padding='1px'
  let title2 = document.createElement('p');
  title2.style.fontWeight='bold'
  title2.style.textAlign='left'
  title2.style.margin='0'
  title2.style.marginTop='10px'
  title2.style.marginLeft='4px'
  title2.style.padding='1px'
  title2.innerHTML='State Characteristics'
  let content2=document.createElement('p');
  content2.style.textAlign='left'
  content2.style.fontSize='15px'
  content2.style.margin='0'
  content2.style.marginTop='8px'
  content2.style.marginLeft='4px'
  content2.style.padding='1px'
  //Fix d after selection
  if (d==null && selected_state!='0'){
    maps_states._groups[0].forEach(e => {
      if (e.__data__.properties.GEOID==selected_state){
        d=e.__data__
      }}
    )
  }

  if (d == null){
    title.textContent="Key Characteristics - United States"
    card.appendChild(title);
    content1.innerHTML='Medicaid + CHIP Population: '+national_data[s_year]['pop'].toLocaleString("en-US")+'<br>Total Population: '+national_data[s_year]['tot_pop'].toLocaleString("en-US")+'<br>% Population w/ Medicaid or CHIP: '+(national_data[s_year]['pop']/national_data[s_year]['tot_pop']*100).toFixed(0)+'%'+'<br>'
    card.appendChild(content1);
    note.innerHTML="<b>Note: </b>National numbers below are based on states with acceptable data quality in TMSIS. The number of states included varies by year."
    card.appendChild(note);
  }else if (d.properties.hasOwnProperty('STUSPS')){
    title.textContent="Key State Characteristics - "+d.properties.NAME
    card.appendChild(title);
    content1.innerHTML='Medicaid + CHIP Population: '+d.properties.Data[s_year]['pop'].toLocaleString("en-US")+'<br>Total Population: '+d.properties.Data[s_year]['tot_pop'].toLocaleString("en-US")+'<br>% Population w/ Medicaid or CHIP: '+(d.properties.Data[s_year]['pop']/d.properties.Data[s_year]['tot_pop']*100).toFixed(1)+'%'
    card.appendChild(content1);
    card.appendChild(title2);
    content2.innerHTML='Medicaid Expansion: '+d.properties.Data[s_year]['expansion']+'<br>Medicaid-to-Medicare Payment Ratio ('+d.properties.Data[s_year]['FR_yr']+') :'+d.properties.Data[s_year]['FeeRatio']+'<br>Medicaid ACO:'+d.properties.Data[s_year]['MedicaidACO']+'<br>APRN Scope of Practice:'+d.properties.Data[s_year]['APRNSOP']+'<br>'
    card.appendChild(content2);
    note.innerHTML="<b>Note: </b>Medicaid Expansion, Medicaid-to-Medicare Payment Ratio, Medicaid ACO are from KFF. APRN Scope of Practice is from the American Association of Nurse Practitioners."
    card.appendChild(note);
  } else if (!d.properties.hasOwnProperty('STUSPS')){
    title.textContent="Key County Characteristics - "+d.properties.NAMELSAD+", "+fips_dict[d.properties.STATEFP]
    card.appendChild(title);
    content1.innerHTML='Medicaid + CHIP Population: '+d.properties.Data[s_year]['pop'].toLocaleString("en-US")+'<br>Total Population: '+d.properties.Data[s_year]['tot_pop'].toLocaleString("en-US")+'<br>% Population w/ Medicaid or CHIP: '+(d.properties.Data[s_year]['pop']/d.properties.Data[s_year]['tot_pop']*100).toFixed(1)+'%'
    card.appendChild(content1);
    card.appendChild(title2);
    content2.innerHTML='Medicaid Expansion: '+state_data[fips_dict[d.properties.STATEFP]][s_year]['expansion']+'<br>Medicaid-to-Medicare Payment Ratio ('+state_data[fips_dict[d.properties.STATEFP]][s_year]['FR_yr']+'): '+state_data[fips_dict[d.properties.STATEFP]][s_year]['FeeRatio']+'<br>Medicaid ACO:'+state_data[fips_dict[d.properties.STATEFP]][s_year]['MedicaidACO']+'<br>APRN Scope of Practice:'+state_data[fips_dict[d.properties.STATEFP]][s_year]['APRNSOP']+'<br>'
    card.appendChild(content2);
    note.innerHTML="<b>Note: </b>Medicaid Expansion, Medicaid-to-Medicare Payment Ratio, Medicaid ACO are from KFF. APRN Scope of Practice is from the American Association of Nurse Practitioners"
    card.appendChild(note);
  } ;
  
}


/*
Screenshot
*/

document.getElementById('screenshot_btn').addEventListener('click', function(){

  //let compare_holder = document.getElementById("comparison_holder");
  let compare_view = document.getElementById("comparison_view");
  let ssn_btn= document.getElementById("ss_btn");
  compare_view.innerHTML = ''; // Clear the container before appending the new screenshot
  ssn_btn.style.display = "none";
  html2canvas(document.getElementById("current_view"))
    .then(
        function(canvas) {
                theCanvas = canvas;
                canvas.toBlob(function(blob) {
                    saveAs(blob, "Dashboard.png");
                });
        }
    );
  ssn_btn.style.display = "block";
});

/*
Close Compare
*/
document.getElementById('close_compare_btn').addEventListener('click', function(){
   let compare_view = document.getElementById("comparison_holder");
   //let page_body=document.getElementById("583702767202115385");
   //page_body.style.width='100%';
   //page_body.style.margin='0px 0px 0px 0px'
   compare_view.style.display = "none";
});

/*
Make Compare
*/

document.getElementById('compare_btn').addEventListener('click', function(){
   let compare_holder = document.getElementById("comparison_holder");
   let compare_view = document.getElementById("comparison_view");
   let ssn_btn= document.getElementById("ss_btn");
   //let page_body=document.getElementById("583702767202115385");
   compare_view.innerHTML = ''; // Clear the container before appending the new screenshot
   ssn_btn.style.display = "none";
   html2canvas(document.getElementById("current_view")).then(function(canvas) {
    compare_holder.style.display = "block";
    //Set up Page Body's Width;
    //page_body.style.width='2200px';
    //page_body.style.margin='0px 0px 0px calc(50% - 1100px)'
    compare_view.appendChild(canvas);
  });
  ssn_btn.style.display = "block";
})

/*
Make sure volume checks always make sense.
*/
function check_volume_types(event){
  let s_Volume1=d3.select("input[name=Volume1]").property('checked');
  let s_nVolume1=d3.select("input[name=nVolume1]").property('checked');
  let s_Volume2=d3.select("input[name=Volume2]").property('checked');
  let s_nVolume2=d3.select("input[name=nVolume2]").property('checked');
  let s_Volume3=d3.select("input[name=Volume3]").property('checked');
  let s_nVolume3=d3.select("input[name=nVolume3]").property('checked');
  let s_Volume4=d3.select("input[name=Volume4]").property('checked');
  let s_nVolume4=d3.select("input[name=nVolume4]").property('checked');
  let s_Volume5=d3.select("input[name=Volume5]").property('checked');
  let s_nVolume5=d3.select("input[name=nVolume5]").property('checked');
  if (typeof(event)!='string'){
  if        (event.srcElement.name=='Volume1' && s_Volume1==true && s_nVolume1==false){
    d3.select("input[name=nVolume1]").property('checked', true);
    d3.select("input[name=nVolume1]").dispatch('change');
  } else if (event.srcElement.name=='nVolume1' && s_Volume1==true && s_nVolume1==false) {
    d3.select("input[name=Volume1]").property('checked', false);
    d3.select("input[name=Volume1]").dispatch('change');
  } else if  (event.srcElement.name=='Volume2' && s_Volume2==true && s_nVolume2==false){
    d3.select("input[name=nVolume2]").property('checked', true);
  } else if (event.srcElement.name=='nVolume2' && s_Volume2==true && s_nVolume2==false) {
    d3.select("input[name=Volume2]").property('checked', false);
    d3.select("input[name=Volume2]").dispatch('change');
  } else if  (event.srcElement.name=='Volume3' && s_Volume3==true && s_nVolume3==false){
    d3.select("input[name=nVolume3]").property('checked', true);
    d3.select("input[name=nVolume3]").dispatch('change');
  } else if (event.srcElement.name=='nVolume3' && s_Volume3==true && s_nVolume3==false) {
    d3.select("input[name=Volume3]").property('checked', false);
    d3.select("input[name=Volume3]").dispatch('change');
  } else if  (event.srcElement.name=='Volume4' && s_Volume4==true && s_nVolume4==false){
    d3.select("input[name=nVolume4]").property('checked', true);
    d3.select("input[name=nVolume4]").dispatch('change');
  } else if (event.srcElement.name=='nVolume4' && s_Volume4==true && s_nVolume4==false) {
    d3.select("input[name=Volume4]").property('checked', false);
    d3.select("input[name=Volume4]").dispatch('change');
  } else if  (event.srcElement.name=='Volume5' && s_Volume5==true && s_nVolume5==false){
    d3.select("input[name=nVolume5]").property('checked', true);
    d3.select("input[name=nVolume5]").dispatch('change');
  } else if (event.srcElement.name=='nVolume5' && s_Volume5==true && s_nVolume5==false) {
    d3.select("input[name=Volume5]").property('checked', false);
    d3.select("input[name=Volume5]").dispatch('change');
  }}
}


/*
Resize Check
*/

function outputsize() {
 let w = sidepanel.clientWidth
 let h = sidepanel.clientWidth
 if (w<265){
     document.getElementById('CountyRank').style.width='calc(100% - 2px)'
     document.getElementById('CountyView').style.width='calc(100% - 2px)'
     $('#ys_tr1').hide();
     $('#ys_tr2').hide();
   } else{
     document.getElementById('CountyRank').style.width='calc(50% - 2px)'
     document.getElementById('CountyView').style.width='calc(50% - 2px)'
     $('#ys_tr1').show();
     $('#ys_tr2').show();
 }
};
outputsize();
new ResizeObserver(outputsize).observe(sidepanel);

$('#t_ddRegion').hide();

/*
Listener for State Dropdown Selector
*/

document.getElementById('ddState').addEventListener('change', function(){
        d3.select('#st_'+st_dict[document.getElementById('ddState').value]).dispatch('click');
        d3.select('#st_'+st_dict[document.getElementById('ddState').value]).dispatch('click');
});

/*
let p_div=document.getElementById('583702767202115385');
p_div.style.minHeight='1000';
p_div.style.maxHeight='2000';
p_div.style.height='100%';
p_div.style.overflowY='hidden';
*/