export default class LineSweep {
  getTotalIntersection(array) {
    const nodeArray = array.flat()
    const length = array.length
    const total = this.lineSweep({ arr: this.getSegment({ arr: nodeArray, obj: this.add(nodeArray) }), nodeLength: length })
    return total
  }

  add(node) {
    const obj = Object.fromEntries(node.map(arr => [arr.name, { name: arr.name, x: arr.x, y: arr.y, topLevel: arr.topLevel }]))
    return obj
  }

  getSegment({ arr, obj }) {
    const tuple = []
    arr.forEach(r => {
      const { children, x, y, name, topLevel } = r
      if (children.length <= 0) {
        return 0;
      }

      for (let element of children) {
        // console.log(name, element)
        const newTuple = obj[element]
        tuple.push([{ name, x, y }, { namePrime: newTuple.name, xPrime: newTuple.x, yPrime: newTuple.y }])
      }
    })

    return tuple
  }

  lineSweep({ arr, nodeLength }) {
    let total = 0
    let checkingArray = []
    for (let j = 0; j <= nodeLength; j++) {
      let currentHeight = j * 250
      // console.log('j right now:', j, currentHeight)
      for (let element of arr) {
        if (element[0].y === currentHeight) {
          checkingArray.push(element)
        }
      }
      for (const checkingElement of checkingArray) {
        // console.log(checkingElement[0].name, checkingElement[1].namePrime, checkingElement[1].yPrime, '===', j * 250, '?', checkingElement[1].yPrime === j * 250)
        if (checkingElement[1].yPrime === currentHeight) {
          for (const newElement of checkingArray) {
            const isIt = this.isIntersection({ x: checkingElement[0].x, y: checkingElement[0].y }, { x: checkingElement[1].xPrime, y: checkingElement[1].yPrime }, { x: newElement[0].x, y: newElement[0].y }, {
              x: newElement[1].xPrime,
              y: newElement[1].yPrime
            })
            // console.log(`(${checkingElement[0].name} ----- ${checkingElement[1].namePrime})`, `(${newElement[0].name} ----- ${newElement[1].namePrime})`, 'isIt:', isIt)
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


  isIntersection(a, b, c, d) {
    const top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
    const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)
    // console.log(top, 'and', bottom)
    const point = top / bottom
    // console.log(point, 'what is the point:', (point > 0.4) && (point < 0.6))
    return (point > 0.4) && (point < 0.6)

  }
}
