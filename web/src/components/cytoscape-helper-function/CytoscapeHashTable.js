export default class CytoscapeHashTable {
  constructor() {
    this.values = {}
    this.bottomValue = []
    this.valueArray = []
    this.totalIntersection = 0
    this.tuple = []
    this.valueArrayLength = 0
  }

  calculateHash(key) {
    return key.charCodeAt(0)
  }

  add(key, value) {
    const hash = this.calculateHash(key)
    if (!this.values.hasOwnProperty(hash)) {
      this.values[key] = {}
    }
    // if (!this.values[hash].hasOwnProperty(key)) {
    //   this.length++
    // }
    if (value.children.length === 0) {
      this.bottomValue.push(value)
    }
    this.values[key] = value;
    // console.log(this.values)
  }

  search(key) {
    // const hash = this.calculateHash(key)
    if (this.values.hasOwnProperty(key)) {
      return this.values[key]
    } else {
      return null
    }
  }

  updateTopLevel(key, count) {
    this.values[key].topLevel = count
    console.log('update', this.values[key].name, this.values[key].topLevel)
    return this.values[key].topLevel
  }

  getTopLevel() {
    const objToArray = Object.values(this.values)
    const sortedArray = this.sortJson(objToArray, 0, objToArray.length - 1)
    const resultLength = sortedArray[sortedArray.length - 1].topLevel
    this.divideByTopLevel(sortedArray, resultLength)
    this.compute(this.valueArray[0])
    this.valueArray.map(arr => this.computeBasedOnParents(arr, sortedArray))
    this.valueArrayLength = this.valueArray.length
    return this.valueArray
  }

  getTotalIntersection() {
    this.getSegment()
    this.lineSweep()
    return this.totalIntersection
  }

  divideByTopLevel(arr, length) {
    for (let i = 0; i <= length; i++) {
      this.valueArray.push(arr.filter(f => f.topLevel === i))
    }
  }

  getBottomNode() {
    return this.bottomValue
  }

  compute(data) {
    let length = data.length
    for (let i = 0; i <= length - 1; i++) {
      data[i].x = (i + 1) * (3000 / (length + 1))
      data[i].y = data[i].topLevel * 250
    }
  }

  computeBasedOnParents(data, list) {
    const getParentsXCorr = (nodeName) => {
      const { x } = list.filter(l => l.name === nodeName)[0]
      return x
    }
    let length = data.length
    for (let i = 0; i <= length - 1; i++) {
      if (data[i].x) {
        return
      }
      let newCorr = 0
      const { parents } = data[i]
      for (let element of parents) {
        newCorr += getParentsXCorr(element)
      }
      data[i].x = newCorr / parents.length
    }
    data.sort(function (a, b) {
      return a.x < b.x
    })
    this.compute(data)
  }

  getAllValues() {
    return this.values
  }

  getAllValuesArray() {
    return this.valueArray
  }

  swap(A, num1, num2) {
    let temp2 = A[num1]
    A[num1] = A[num2]
    A[num2] = temp2
  }

  partitionJson(array, start, end) {
    let value = array[end]
    let index = start
    for (let j = start; j < end; j++) {
      if (array[j].topLevel < value.topLevel) {
        this.swap(array, j, index)
        index++
      }
    }
    this.swap(array, index, end)
    return index
  }

  sortJson(array, start, end) {
    if (start >= end) {
      return
    }
    let q = this.partitionJson(array, start, end)
    this.sortJson(array, start, q - 1)
    this.sortJson(array, q + 1, end)
    return array
  }

  getSegment() {
    this.valueArray.flat().forEach(r => {
      const { children, x, y, name, topLevel } = r
      if (children.length <= 0) {
        return 0;
      }
      for (let element of children) {
        const newTuple = this.values[element]
        this.tuple.push([{ x, y, topLevel }, { xPrime: newTuple.x, yPrime: newTuple.y, topLevel: newTuple.topLevel }])
      }
    })
  }

  lineSweep() {
    let checkingArray = []
    for (let j = 0; j <= this.valueArrayLength ; j++) {
      // console.log(j, true)
      for (let element of this.tuple) {
        if (element[0].topLevel === j) {
          // console.log('print if true', element, j)
          checkingArray.push(element)
        }
      }
      for (const checkingElement of checkingArray) {
        if (checkingElement[1].topLevel === j) {
          for (const newElement of checkingArray) {
            const isIt = this.isIntersection({ x: checkingElement[0].x, y: checkingElement[0].y }, { x: checkingElement[1].xPrime, y: checkingElement[1].yPrime }, { x: newElement[0].x, y: newElement[0].y }, {
              x: newElement[1].xPrime,
              y: newElement[1].yPrime
            })
            if (isIt) {
              this.totalIntersection++
            }
          }
          checkingArray.shift()
        }
      }
    }
  }

  isIntersection(a, b, c, d) {
    const top = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)
    const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y)
    const point = top / bottom
    return (point > 0.4) && (point < 0.6)
  }
}
