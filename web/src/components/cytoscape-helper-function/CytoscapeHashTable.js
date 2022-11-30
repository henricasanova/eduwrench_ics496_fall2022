export default class CytoscapeHashTable {
  constructor() {
    this.values = {}
    this.bottomValue = []
    this.valueArray = []
    this.sortedArray = []
  }

  calculateHash(key) {
    return key.charCodeAt(0)
  }

  add(key, value) {
    const hash = this.calculateHash(key)
    if (!this.values.hasOwnProperty(hash)) {
      this.values[key] = {}
    }

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

  jsonFileWithNoChildren(key, value) {
    this.values[key].children.push(value)
  }

  updateTopLevel(key, count) {
    console.log(key, count)
    this.values[key].topLevel = count
    return this.values[key].topLevel
  }

  getTopLevel() {
    this.sortedArray = Object.values(this.values)
    this.sortJson(this.sortedArray, 0, this.sortedArray.length - 1)
    this.valueArrayLength =  this.sortedArray[this.sortedArray.length - 1].topLevel
    this.divideByTopLevel(this.sortedArray, this.valueArrayLength)
    this.compute(this.valueArray[0])
    this.valueArray.map(arr => this.computeBasedOnParents(arr))
    return this.valueArray
  }

  divideByTopLevel(arr, length) {
    for (let i = 0; i <= length; i++) {
      this.valueArray.push(arr.filter(f => f.topLevel === i))
    }
  }

  getBottomNode() {
    // console.log(this.bottomValue)
    return this.bottomValue
  }

  compute(data) {
    let length = data.length
    for (let i = 0; i <= length - 1; i++) {
      data[i].x = (i + 1) * (3000 / (length + 1))
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
        console.log(data[i].name, newCorr, this.values[key].name, this.values[key].x)
      }
      data[i].x = newCorr / parents.length
    }
    data.sort((a, b) => a.x - b.x)
    console.log(data)
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
