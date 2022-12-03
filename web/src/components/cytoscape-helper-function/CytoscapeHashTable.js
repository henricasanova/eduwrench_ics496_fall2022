export default class CytoscapeHashTable {
  constructor() {
    this.values = {}
    this.bottomValue = []
    this.valueArray = []
    this.sortArray = []
    this.colorValues = {}
  }

  calculateHash(key) {
    let hash = 0
    let chr

    const re = /([a-z]+)|([A-Z]+)/
    const reKey = key.match(re)
    const keyStr = reKey[0]
    for (let i = 0; i <= keyStr.length - 1; i++) {
      chr = keyStr.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0
    }
    return Math.abs(hash)
  }

  add(key, value) {
    const hash = this.calculateHash(key)
    if (!this.values.hasOwnProperty(key)) {
      this.values[key] = {}
      this.colorValues[key] = {}
    }

    this.colorValues[key] = hash
    this.values[key] = value
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

  jsonFileWithNoChildren(arr) {
    let i = arr.length - 1
    while (i >= 0) {
      const child = arr[i].name
      let tempArray = arr[i].parents
      for (let j = 0; j <= tempArray.length - 1; j++) {
        this.values[tempArray[j]].children.push(child)
      }
      i--
    }
  }

  checkJsonFormatAndUpdate() {
    this.sortArray = Object.values(this.values)
    if (this.sortArray[0].children.length <= 0) {
      this.jsonFileWithNoChildren(this.sortArray)
    }
    console.log(this.sortArray)
    this.bottomValue = this.sortArray.filter(sArr => sArr.children.length <= 0)
  }

  getTopLevel() {
    this.sortJson(this.sortArray, 0, this.sortArray.length - 1)
    this.valueArrayLength = this.sortArray[this.sortArray.length - 1].topLevel
    this.divideByTopLevel(this.sortArray, this.valueArrayLength)
    this.compute(this.valueArray[0])
    this.valueArray.map(arr => this.computeBasedOnParents(arr))
    console.log(this.colorValues)
    return this.valueArray
  }

  getColor(node) {
    const { name } = node
    const hashValue = this.colorValues[name]
    const red = hashValue % 255
    const blue = hashValue % 245
    const green = hashValue % 235
    node.color = `rgb(${red}, ${green}, ${blue})`
  }

  divideByTopLevel(arr, length) {
    let temp
    for (let i = 0; i <= length; i++) {
      temp = arr.filter(fArr => fArr.topLevel === i)
      temp.map(tArr => this.getColor(tArr))
      this.valueArray.push(temp)
    }
  }

  getBottomNode() {
    // console.log(this.bottomValue)
    return this.bottomValue
  }

  compute(data) {
    let length = data.length
    let gap = Math.floor(this.sortArray.length/ this.valueArray.length / 5)
    gap = gap < 1 ? 1 : gap
    gap *= 3000

    for (let i = 0; i <= length - 1; i++) {
      data[i].x = (i + 1) * (gap / (length + 1))
      data[i].y = data[i].topLevel * 250
    }
  }

  computeBasedOnParents(data) {
    let length = data.length
    for (let i = 0; i <= length - 1; i++) {
      if (data[i].x) {
        return
      }
      let newCorr = 0
      const { parents } = data[i]
      for (let key of parents) {
        newCorr += this.values[key].x
        // console.log(data[i].name, newCorr, this.values[key].name, this.values[key].x)
      }
      data[i].x = newCorr / parents.length
    }
    data.sort((a, b) => a.x - b.x)
    // console.log(data)
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
}
