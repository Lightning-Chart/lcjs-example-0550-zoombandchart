/*
 * LightningChartJS example that showcases the Zoom Band Chart feature
 */
const lcjs = require('@arction/lcjs')
const xydata = require('@arction/xydata')
const { lightningChart, AxisTickStrategies, Themes } = lcjs
const { createProgressiveTraceGenerator, createProgressiveRandomGenerator } = xydata

const numberOfDays = 1000

// Create a Dashboard, with a single column and two rows.
// NOTE: Using `Dashboard` is no longer recommended for new applications. Find latest recommendations here: https://lightningchart.com/js-charts/docs/basic-topics/grouping-charts/
const dashboard = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .Dashboard({
        numberOfColumns: 1,
        numberOfRows: 2,
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    // Set the row height for the top Cell in Dashboard.
    // As the bottom row is default (1), the top row height will be 3/4 of the
    // available Dashboard height.
    .setRowHeight(0, 3)

// Add XY Chart to top Cell in Dashboard.
const chart = dashboard
    .createChartXY({
        columnIndex: 0,
        columnSpan: 1,
        rowIndex: 0,
        rowSpan: 1,
    })
    .setTitle('')

// Do not animate Y Axis Scale changes on either Charts.
chart.getDefaultAxisY().setAnimationScroll(undefined)
chart
    .getDefaultAxisX()
    .setTickStrategy(AxisTickStrategies.DateTime)
    .setInterval({ start: new Date(2001, 0, numberOfDays - 180).getTime(), end: new Date(2001, 0, numberOfDays).getTime() })

// Add Zoom Band Chart to bottom Cell in Dashboard.
const zoomBandChart = dashboard.createZoomBandChart({
    columnIndex: 0,
    columnSpan: 1,
    rowIndex: 1,
    rowSpan: 1,
})

// Add Line and Point Series to the XY Chart.
const lines = new Array(3).fill(0).map((_, i) => {
    return chart
        .addLineSeries({
            dataPattern: {
                pattern: 'ProgressiveX',
            },
        })
        .setStrokeStyle((strokeStyle) => strokeStyle.setThickness(1))
        .setName(`Line ${i}`)
})

const points = chart.addPointSeries().setPointSize(2)

// Add the same Series to the Zoom Band Chart.
lines.forEach((line) => zoomBandChart.add(line))
zoomBandChart.add(points)

// Fill the Point Series with  data.
createProgressiveRandomGenerator()
    .setNumberOfPoints(numberOfDays)
    .generate()
    .toPromise()
    .then((data) => {
        // Offset the Y value of each point, then push to the Series.
        points.add(data.map((point) => ({ x: new Date(2001, 0, point.x).getTime(), y: point.y * 15 })))
    })

// Fill the Line Series with data.
lines.forEach((line, i) => {
    createProgressiveTraceGenerator()
        .setNumberOfPoints(numberOfDays)
        .generate()
        .toPromise()
        .then((data) => {
            line.add(data.map((point) => ({ x: new Date(2001, 0, point.x).getTime(), y: point.y })))
        })
})
