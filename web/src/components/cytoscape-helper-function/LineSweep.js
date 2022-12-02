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
      const { children, x, y, name } = r
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
      for (const [index, checkingElement] of checkingArray.entries()) {
        // console.log(checkingElement[0].name, checkingElement[1].namePrime, checkingElement[1].yPrime, '===', j * 250, '?', checkingElement[1].yPrime === j * 250)
        if (checkingElement !== undefined && checkingElement[1].yPrime === currentHeight) {
          // console.log(checkingElement)
          for (const newElement of checkingArray) {
            if (newElement !== undefined) {
              const isIt = this.isIntersection({ x: checkingElement[0].x, y: checkingElement[0].y }, { x: checkingElement[1].xPrime, y: checkingElement[1].yPrime }, { x: newElement[0].x, y: newElement[0].y }, {
                x: newElement[1].xPrime,
                y: newElement[1].yPrime
              })
              // console.log(`(${checkingElement[0].name} ----- ${checkingElement[1].namePrime})`, `(${newElement[0].name} ----- ${newElement[1].namePrime})`, 'isIt:', isIt)
              if (isIt) {
                // console.log(`(${checkingElement[0].name} ----- ${checkingElement[1].namePrime})`, `(${newElement[0].name} ----- ${newElement[1].namePrime})`, 'isIt:', isIt, 'inside')
                total++
              }
            }
          }
          delete checkingArray[index]
        }
      }
    }
    return total
  }

  onSegment(p, q, r) {
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
      return true;

    return false;
  }

  lineOrientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)

    if (val === 0) return 0

    return (val > 0) ? 1 : 2
  }

  isIntersection(a, b, c, d) {
    if (a.x === c.x && b.x === d.x && a.y === c.y && b.y === d.y) return false

    if (b.x === c.x && b.y === c.y) return false
    if (a.x === c.x && a.y === c.y) return false
    if (a.x === d.x && a.y === d.y) return false
    if (b.x === d.x && b.y === d.y) return false
    // const top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
    // const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)
    // const point = top / bottom
    //
    // if ((point > 0.4) && (point < 0.6)) return true

    const t1 = this.lineOrientation(a, b, c)
    const t2 = this.lineOrientation(a, b, d)
    const t3 = this.lineOrientation(c, d, a)
    const t4 = this.lineOrientation(c, d, b)


    // General case
    if (t1 !== t2 && t3 !== t4)
      return true;

    // Special Cases
    if (t1 === 0 && this.onSegment(a, c, b)) return true;

    if (t2 === 0 && this.onSegment(a, d, b)) return true;

    if (t3 === 0 && this.onSegment(c, a, d)) return true;

    if (t4 === 0 && this.onSegment(c, b, d)) return true;

    return false; // Doesn't fall in any of the above cases

    // // console.log(top, 'and', bottom)
    // const point = top / bottom
    // console.log(point, 'what is the point:', (point > 0.4) && (point < 0.6), (!(point > 0.4) && !(point < 0.6)))
    // return ((point > 0.4) && (point < 0.6)) ||  (!(point > 0.4) && !(point < 0.6))
  }
}
