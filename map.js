async function drawMap(){
    //1) Acces Data

    //Fetching data

    const  dataset = await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")

    const colorData = {
        'Wii' : '#f45d51',
        'DS' : '#3a3e70',
        'X360' : '#9bb948',
        'GB' : '#97b5cc',
        'PS3' : '#374667',
        'NES' : '#63cace',
        'PS2' : '#d54153',
        '3DS' : '#ac8daf',
        'PS4' : '#3282b8',
        'SNES' : '#718ca1',
        'PS' : '#3f5a92',
        'N64' : '#2e6186',
        'GBA' : '#942246',
        'XB' : '#484c7f',
        'PC' : '#bbe1fa',
        '2600' : '#59748c',
        'PSP' : '#5579c7',
        'XOne' : '#274765'
    }
    //2) Create Chart Dimensions

    let dimensions = {
        width: window.innerWidth * 0.9 <= 600 ? window.innerWidth * 0.9 : 1100,
        height: 500,
    }

    //3) Draw Canvas 

    //adding main svg 

    const canvas = d3.select("#canvas")
                        .append('svg')
                        .attr('width',dimensions.width)
                        .attr('height',dimensions.height)

    //adding bound(framework or whiteboard)

    const bounds = canvas.append('g')
                            .style('transform', `translate(${
                               0
                            }px, ${
                                0
                            }px)`);

    //4) Create Scales 
    
    //setting Hierarchy
    const hierarchy = d3.hierarchy(dataset,(node)=> node['children'])
                        .sum((node)=> node['value'])
                        .sort((node1,node2) => node2['value'] - node1['value'])
                    

    const createTreeMap = d3.treemap()
                            .size([dimensions.width,dimensions.height])

    
    createTreeMap(hierarchy)

    //5) Draw Data
    //selecting tooltip

    const tooltip = d3.select('#tooltip');

    //setting transition 

    const updateTransition = d3.transition().duration(1000);

    //drawing data

    const gamesTiles = hierarchy.leaves()

    const block = bounds.selectAll('g')
                        .data(gamesTiles)
                        .enter()
                        .append('g')
                        .attr('transform', d => `translate( ${d['x0']}, ${d['y0']} )`)

    const tile = block.append('rect')
                        .attr('class','tile')
                        .attr('fill','white')
                        .attr('data-name',d => d['data']['name'])
                        .attr('data-category',d => d['data']['category'])
                        .attr('data-value',d => d['data']['value'])
                        .attr('width', 0)
                        .attr('height', 0)
    
    //Adding transition
    tile.transition(updateTransition)
        .attr('width', d => d['x1'] - d['x0'])
        .attr('height', d => d['y1'] - d['y0'])
        .attr('fill',(d)=>{
            const {data : {category} } = d
            return colorData[category]
        })
    //Adding a text to each block
    block.append('text')
        .text(d => d['data']['name'])
        .attr('x',0)                
        .attr('y',20)
        .attr('height', d => d['y1'] - d['y0'])           
        
    //6)Draw Peripherals

    //select legeng element
    const legend = d3.select('#legend')
                        .append('svg')
                        .attr('width', dimensions.width * .4)
                        .attr('height', dimensions.height * .44)

    //adding legend
    const legendBlocks = legend.selectAll('g')
                                .data(Object.values(colorData))
                                .enter()
                                .append('g')
                                .attr('transform',(d,i) =>{
                                    if( i < 3) return `translate(${(i - 0) * 150}, ${0})`
                                    if( i < 6) return `translate(${(i - 3) * 150}, ${30})`
                                    if( i < 9) return `translate(${(i - 6) * 150}, ${60})`
                                    if( i < 12) return `translate(${(i - 9) * 150}, ${90})`
                                    if( i < 15) return `translate(${(i - 12) * 150}, ${120})`
                                    if( i < 18) return `translate(${(i - 15 )* 150}, ${150})`
                                })
                                .attr('class','legend-element')
    //adding rect elements 
    const legendRect = legendBlocks.append('rect')
                                    .attr('width',30)
                                    .attr('height',30)
                                    .attr('fill',d => d )
                                    .attr('x',(d,i) =>  0)
                                    .attr('y',(d,i) => 0 )
                                    .attr('class','legend-item')
    //adding text to the legend blocks                             
    const textLegend = legendBlocks.append('text')
                                    .text((d,i) => Object.keys(colorData)[i] )
                                    .attr('x',45)
                                    .attr('y',20)

    //adding transition to the legend 

    d3.select('#legend').transition(updateTransition)
            .style('opacity', 1)

   //7) Set up Interactions

    //adding interactions to the tiles
    tile.on("mouseenter", onMouseEnter)
        .on("mouseleave", onMouseLeave)

    function onMouseEnter(datum,index){
        //setting the tooltip position
        const x = index.x0 + (index.x1 - index.x0)/2 ;
        const y = index.y0;

        const {data : {name,category,value} } = index;

        //Updating tooltip styles
        tooltip.attr("data-year",index.Year)
                .style('opacity',1)
                .style("transform",`translate(calc(-50% + ${x}px) , calc(-100% + ${y}px) )`)

        //Updating tooltip information
        tooltip.select("#name").text(`Name: ${name}`);
        tooltip.select("#category").text(`Category: ${category}`);
        tooltip.select("#value").text(`Value: ${value}`)

        //adding attr data-value to the tooltip

        tooltip.attr('data-value',value)
    }

    function onMouseLeave(datum,index){
        tooltip.style('opacity',0)
    }
}
drawMap()