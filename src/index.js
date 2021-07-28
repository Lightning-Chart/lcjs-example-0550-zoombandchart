/*
 * LightningChartJS example that showcases a simple XY line series.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    LegendBoxBuilders,
    Themes
} = lcjs

// Extract required parts from XYData Generator.
const {
    createProgressiveTraceGenerator,
    createOHLCGenerator,
    createProgressiveRandomGenerator
} = require('@arction/xydata')

// Create a Dashboard, with a single column and two rows.
const dashboard = lightningChart().Dashboard({
    // theme: Themes.darkGold 
    numberOfColumns: 1,
    numberOfRows: 2
})
    // Set the row height for the top Cell in Dashboard.
    // As the bottom row is default (1), the top row height will be 3/4 of the
    // available Dashboard height.
    .setRowHeight(0, 3)

// Add XY Chart to top Cell in Dashboard.
const chart = dashboard.createChartXY({
    columnIndex: 0,
    columnSpan: 1,
    rowIndex: 0,
    rowSpan: 1
})
    .setTitle('')

// Add Zoom Band Chart to bottom Cell in Dashboard.
const zoomBandChart = dashboard.createZoomBandChart({
    columnIndex: 0,
    columnSpan: 1,
    rowIndex: 1,
    rowSpan: 1,
    // Specify the Axis for the Zoom Band Chart to follow.
    // The Zoom Band Chart will imitate all Series present in that Axis.
    axis: chart.getDefaultAxisX()
})

// Do not animate Y Axis Scale changes on either Charts.
chart.getDefaultAxisY()
    .setAnimationScroll(undefined)
zoomBandChart.getDefaultAxisY()
    .setAnimationScroll(undefined)
zoomBandChart.band.setValueStart(300)
zoomBandChart.band.setValueEnd(500)

// Add different Series to the XY Chart.
const line = chart.addLineSeries()
const ohlc = chart.addOHLCSeries()
const points = chart.addPointSeries()
    .setPointSize(2)
const areaRange = chart.addAreaRangeSeries()

// Fill the Line Series with arbitrary data.
createProgressiveTraceGenerator()
    .setNumberOfPoints(1000)
    .generate()
    .toPromise()
    .then((data) => {
        // Offset the Y value of each point, then push to the Series.
        line.add(data.map((point) => ({ x: point.x, y: point.y * .1 + 100 })))
    })

// Fill the OHLC Series with arbitrary data.
createOHLCGenerator()
    .setNumberOfPoints(1000)
    .generate()
    .toPromise()
    .then((data) => {
        ohlc.add(data)
    })

// Fill the Point Series with arbitrary data.
createProgressiveRandomGenerator()
    .setNumberOfPoints(1000)
    .generate()
    .toPromise()
    .then((data) => {
        // Offset the Y value of each point, then push to the Series.
        points.add(data.map((point) => ({ x: point.x, y: point.y * 5 + 95 })))
    })

// Fill the Area Series with arbitrary data. 
Promise.all([
    createProgressiveRandomGenerator()
        .setNumberOfPoints(1000)
        .generate()
        .toPromise(),
    createProgressiveRandomGenerator()
        .setNumberOfPoints(1000)
        .generate()
        .toPromise()
]).then((data) => {
    // Offset the high and low values for each point, then push to the Series.
    areaRange.add(data[0].map((high, i) => ({
        position: high.x,
        high: high.y + 92,
        low: data[1][i].y + 90
    })))
})

// Add LegendBox to the XY Chart. Note that hiding a Series in XY Chart will also
// hide corresponding Series in the Zoom Band Chart.
chart.addLegendBox(LegendBoxBuilders.VerticalLegendBox)
    .add(chart)
    // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
    .setAutoDispose({
        type: 'max-width',
        maxWidth: 0.30,
    })
