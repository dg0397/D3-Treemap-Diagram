async function drawMap(){
    //1) Acces Data

    //Fetching data

    const dataset = await d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")

    console.log(dataset)
}
drawMap()