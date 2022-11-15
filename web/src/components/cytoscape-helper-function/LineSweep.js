function isIntersection(a, b, c, d) {
  const top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)
  const point = top / bottom
  return (point > 0.4) && (point < 0.6)
}

function lineSweep(arr, nodeLength) {
  let total = 0
  let checkingArray = []
  for (let j = 0; j <= nodeLength; j++) {
    // console.log(j, true)
    for (let element of arr) {
      if (element[0].topLevel === j) {
        // console.log('print if true', element, j)
        checkingArray.push(element)
      }
    }
    for (const checkingElement of checkingArray) {
      if (checkingElement[1].topLevel === j) {
        for (const newElement of checkingArray) {
          const isIt = isIntersection({ x: checkingElement[0].x, y: checkingElement[0].y }, { x: checkingElement[1].xPrime, y: checkingElement[1].yPrime }, { x: newElement[0].x, y: newElement[0].y }, {
            x: newElement[1].xPrime,
            y: newElement[1].yPrime
          })
          if (isIt) {
            total++
          }
        }
        checkingArray.shift()
      }
    }
  }
  return total
}

function getSegment(arr, obj) {
  const tuple = []

  arr.forEach(r => {
    const { children, x, y, name, topLevel } = r
    if (children.length <= 0) {
      return 0;
    }

    for (let element of children) {
      const newTuple = obj[element]
      tuple.push([{ x, y, topLevel }, { xPrime: newTuple.x, yPrime: newTuple.y, topLevel: newTuple.topLevel }])
    }
  })
  return tuple
}

export const LineSweep = ({ resultLength, jsonData }) => {
  const fileObj = Object.fromEntries(jsonData.map(fArr => [fArr.name, { x: fArr.x, y: fArr.y, topLevel: fArr.topLevel }]))
  const segments = getSegment(jsonData, fileObj)
  const total = lineSweep(segments, resultLength)

  return total
}
